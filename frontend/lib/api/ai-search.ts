import { aiSearchErrorCodeSchema, aiSearchQuerySchema, aiSearchResponseSchema, type AiSearchResponse } from "@/lib/schemas/ai-search.schema";
import { fetchFromApi } from "./client";

export type { AiMovie, AiSearchResponse } from "@/lib/schemas/ai-search.schema";
export type AiSearchErrorKind = "invalid-query" | "not-ready" | "unavailable";

export class AiSearchError extends Error {
  constructor(public readonly kind: AiSearchErrorKind) {
    super("AI movie search could not be completed.");
    this.name = "AiSearchError";
  }
}

function supportedPosterUrl(value: string | null | undefined) {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "image.tmdb.org" && !url.port && !url.username && !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export async function fetchAiMovies(
  query: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<AiSearchResponse> {
  const parsedQuery = aiSearchQuerySchema.safeParse(query);

  if (!parsedQuery.success) {
    throw new AiSearchError("invalid-query");
  }

  const params = new URLSearchParams({ query: parsedQuery.data });
  const response = await fetchFromApi(
    `/movies/search/semantic?${params.toString()}`,
    { cache: "no-store", signal },
  );

  if (!response.ok) {
    if (response.status === 400) throw new AiSearchError("invalid-query");
    if (response.status === 404 || response.status === 501) {
      throw new AiSearchError("not-ready");
    }

    if (response.status === 503) {
      const errorBody = aiSearchErrorCodeSchema.safeParse(
        await response.json().catch(() => null),
      );
      throw new AiSearchError(
        errorBody.success && ["NOT_CONFIGURED", "INDEX_NOT_READY"].includes(errorBody.data.code ?? "")
          ? "not-ready"
          : "unavailable",
      );
    }

    throw new Error("Unable to load AI movie results.");
  }

  const data = aiSearchResponseSchema.parse(await response.json());

  return {
    results: data.results.map((movie) => ({
      ...movie,
      posterUrl: supportedPosterUrl(movie.posterUrl),
    })),
  };
}
