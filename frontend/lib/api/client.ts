import { z } from "zod";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

const apiErrorSchema = z.object({
  message: z.string().optional(),
});

export async function fetchFromApi(path: string, init?: RequestInit) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error(
      `Unable to connect to API server at ${API_BASE_URL}. Make sure the backend is running.`,
    );
  }
}

export async function getErrorMessage(response: Response, fallback: string) {
  const json = await response.json().catch(() => null);
  const parsed = apiErrorSchema.safeParse(json);

  if (!parsed.success) {
    return fallback;
  }

  return parsed.data.message || fallback;
}
