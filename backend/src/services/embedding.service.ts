import { ApiError, GoogleGenAI, type EmbedContentResponse } from "@google/genai";

export const EMBEDDING_DIMENSIONS = 1536;

const REQUEST_TIMEOUT_MS = 12_000;
const MAX_INPUT_UTF8_BYTES = 1_800;
const MAX_TITLE_CHARACTERS = 500;
const MAX_QUERY_CHARACTERS = 500;

export type EmbeddingErrorKind =
  | "notconfigured"
  | "auth"
  | "rate-limit"
  | "upstream"
  | "invalid-input";

export class EmbeddingError extends Error {
  readonly kind: EmbeddingErrorKind;
  /** The upstream HTTP status, if the provider returned one. */
  readonly status: number | undefined;

  constructor(kind: EmbeddingErrorKind, message: string, status?: number) {
    super(message);
    this.name = "EmbeddingError";
    this.kind = kind;
    this.status = status;
  }
}

export type EmbeddingConfig = {
  provider: "gemini";
  model: string;
  dimensions: typeof EMBEDDING_DIMENSIONS;
};

export type MovieEmbeddingInput = {
  title: string;
  content: string;
};

function readModel() {
  const configured = process.env.GEMINI_EMBEDDING_MODEL?.trim() || process.env.EMBEDDING_MODEL?.trim();

  if (!configured) {
    throw new EmbeddingError("notconfigured", "Configure GEMINI_EMBEDDING_MODEL to enable AI search.");
  }

  const model = configured.replace(/^models\//, "");
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(model)) {
    throw new EmbeddingError("notconfigured", "GEMINI_EMBEDDING_MODEL must be a valid Gemini model ID.");
  }

  return model;
}

function readApiKey() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new EmbeddingError("notconfigured", "Configure GEMINI_API_KEY or GOOGLE_API_KEY to enable AI search.");
  }

  return apiKey;
}

export function getEmbeddingConfig(): EmbeddingConfig {
  const model = readModel();
  readApiKey();
  return { provider: "gemini", model, dimensions: EMBEDDING_DIMENSIONS };
}

function validateText(value: unknown, label: string, maxLength?: number): asserts value is string {
  if (typeof value !== "string" || !value.trim()) {
    throw new EmbeddingError("invalid-input", `${label} must be a nonempty string.`);
  }

  if (maxLength !== undefined && value.length > maxLength) {
    throw new EmbeddingError("invalid-input", `${label} is too long for embedding.`);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeEmbedding(values: unknown): number[] {
  if (
    !Array.isArray(values) ||
    values.length !== EMBEDDING_DIMENSIONS ||
    !Array.from(values).every((value: unknown) => typeof value === "number" && Number.isFinite(value))
  ) {
    throw new EmbeddingError("upstream", "Gemini returned an invalid embedding vector.");
  }

  // Scale first so that finite coordinates cannot overflow or underflow the norm.
  const maximum = Math.max(...values.map((value: number) => Math.abs(value)));

  if (maximum === 0) {
    throw new EmbeddingError("upstream", "Gemini returned a zero embedding vector.");
  }

  const scaled = values.map((value: number) => value / maximum);
  const norm = Math.sqrt(scaled.reduce((sum, value) => sum + value * value, 0));

  if (!Number.isFinite(norm) || norm <= 0) {
    throw new EmbeddingError("upstream", "Gemini returned an invalid embedding norm.");
  }

  return scaled.map((value) => value / norm);
}

async function requestEmbedding(
  content: string,
  taskType: "RETRIEVAL_DOCUMENT" | "RETRIEVAL_QUERY",
  title?: string,
): Promise<number[]> {
  const { model } = getEmbeddingConfig();
  const apiKey = readApiKey();
  const usesTaskInstructions = /^gemini-embedding-2(?:[.-]|$)/.test(model);
  const requestContent = usesTaskInstructions
    ? taskType === "RETRIEVAL_QUERY"
      ? `task: search result | query: ${content}`
      : `title: ${title ?? "none"} | text: ${content}`
    : content;
  const inputBytes = Buffer.byteLength(requestContent, "utf8") +
    (!usesTaskInstructions && title !== undefined ? Buffer.byteLength(title, "utf8") : 0);
  if (inputBytes > MAX_INPUT_UTF8_BYTES) {
    throw new EmbeddingError("invalid-input", "The embedding input is too long.");
  }
  const signal = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  let response: EmbedContentResponse;

  try {
    const ai = new GoogleGenAI({ apiKey, vertexai: false });
    response = await ai.models.embedContent({
      model,
      contents: requestContent,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
        abortSignal: signal,
        httpOptions: {
          timeout: REQUEST_TIMEOUT_MS,
          retryOptions: { attempts: 1 },
        },
        ...(!usesTaskInstructions ? { taskType, ...(title === undefined ? {} : { title }) } : {}),
      },
    });
  } catch (error: unknown) {
    const status = error instanceof ApiError ? error.status : undefined;
    let invalidApiKey = false;

    // The SDK's ApiError message contains the raw provider response. Inspect
    // stable error reasons without exposing the message to callers or logs.
    if (error instanceof ApiError && status === 400) {
      try {
        const payload: unknown = JSON.parse(error.message);
        const providerError = isRecord(payload) ? payload.error : null;
        invalidApiKey = isRecord(providerError) && Array.isArray(providerError.details) &&
          providerError.details.some((detail: unknown) => isRecord(detail) && detail.reason === "API_KEY_INVALID");
      } catch {
        // Non-JSON API errors use the generic upstream error below.
      }
    }

    if (status === 401 || status === 403 || invalidApiKey) {
      throw new EmbeddingError("auth", "Gemini rejected the API credentials or permissions.", status);
    }

    if (status === 429) {
      throw new EmbeddingError("rate-limit", "Gemini embedding rate limit reached. Try again later.", status);
    }

    throw new EmbeddingError(
      "upstream",
      signal.aborted ? "Gemini embedding request timed out." : "Gemini embedding service request failed.",
      status,
    );
  }

  if (response.embeddings?.length !== 1) {
    throw new EmbeddingError("upstream", "Gemini returned an invalid embedding response.");
  }

  return normalizeEmbedding(response.embeddings[0]?.values);
}

export async function embedMovieDocument(input: MovieEmbeddingInput): Promise<number[]> {
  if (!isRecord(input)) {
    throw new EmbeddingError("invalid-input", "A movie title and document content are required.");
  }

  validateText(input.title, "Movie title", MAX_TITLE_CHARACTERS);
  validateText(input.content, "Movie content");

  if (Buffer.byteLength(input.title, "utf8") + Buffer.byteLength(input.content, "utf8") > MAX_INPUT_UTF8_BYTES) {
    throw new EmbeddingError("invalid-input", "Movie title and content are too long for embedding.");
  }

  return requestEmbedding(input.content, "RETRIEVAL_DOCUMENT", input.title);
}

export async function embedSearchQuery(query: string): Promise<number[]> {
  validateText(query, "Search query", MAX_QUERY_CHARACTERS);

  if (query.trim().length < 3) {
    throw new EmbeddingError("invalid-input", "Search query must contain at least 3 characters.");
  }

  if (Buffer.byteLength(query, "utf8") > MAX_INPUT_UTF8_BYTES) {
    throw new EmbeddingError("invalid-input", "Search query is too long for embedding.");
  }

  return requestEmbedding(query, "RETRIEVAL_QUERY");
}
