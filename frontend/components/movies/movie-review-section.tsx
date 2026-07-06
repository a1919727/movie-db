"use client";

import { useState } from "react";
import { MovieReviewForm } from "@/components/movies/movie-review-form";
import { MovieReviews } from "@/components/movies/movie-reviews";

export function MovieReviewSection({ movieId }: { movieId: number }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <MovieReviewForm
        movieId={movieId}
        onSaved={() => setRefreshKey((current) => current + 1)}
      />
      <MovieReviews movieId={movieId} refreshKey={refreshKey} />
    </>
  );
}
