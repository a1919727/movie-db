import type { Review } from "@/types/review";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export async function getReviews(tmdbMovieId: number) {
  const response = await fetch(`${API_BASE_URL}/reviews?tmdbMovieId=${tmdbMovieId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  const reviews: Review[] = await response.json();
  return reviews;
}

export async function saveReview(payload: {
  userId: number;
  tmdbMovieId: number;
  content: string;
}) {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(errorBody?.message || "Failed to save review");
  }

  const review: Review = await response.json();
  return review;
}
