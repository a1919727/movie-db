import type { Review, UserReview } from "@/types/review";
import { fetchFromApi, getErrorMessage } from "./client";

export async function getReviews(tmdbMovieId: number) {
  const response = await fetchFromApi(
    `/reviews?tmdbMovieId=${tmdbMovieId}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to fetch reviews"));
  }

  const reviews: Review[] = await response.json();
  return reviews;
}

export async function getReviewsByUserId(userId: number) {
  const response = await fetchFromApi(`/reviews/user/${userId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to fetch user reviews"),
    );
  }

  const reviews: UserReview[] = await response.json();
  return reviews;
}

export async function saveReview(payload: {
  userId: number;
  tmdbMovieId: number;
  content: string;
}) {
  const response = await fetchFromApi("/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to save review"));
  }

  const review: Review = await response.json();
  return review;
}

export async function deleteReview(reviewId: number, userId: number) {
  const response = await fetchFromApi(`/reviews/${reviewId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to delete review"),
    );
  }
}
