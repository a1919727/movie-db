"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { CiFlag1 } from "react-icons/ci";
import Image from "next/image";
import { Button } from "../ui/button";
import { getReviews } from "@/lib/api/reviews";
import type { Review } from "@/types/review";

function formatReviewTime(createdAt: string) {
  const createdAtDate = new Date(createdAt);
  const hoursAgo = Math.max(
    1,
    Math.floor((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60)),
  );

  return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
}

type MovieReviewsProps = {
  movieId: number;
  refreshKey: number;
};

export function MovieReviews({ movieId, refreshKey }: MovieReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadReviews() {
      setIsLoading(true);
      setError(null);

      try {
        const nextReviews = await getReviews(movieId);
        if (mounted) {
          setReviews(nextReviews);
        }
      } catch (loadError) {
        if (mounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load reviews",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadReviews();

    return () => {
      mounted = false;
    };
  }, [movieId, refreshKey]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="max-w-6xl flex flex-col gap-6">
        {isLoading ? <p className="text-zinc-400">Loading reviews...</p> : null}
        {error ? <p className="text-red-400">{error}</p> : null}
        {!isLoading && !error && reviews.length === 0 ? (
          <p className="text-zinc-400">No reviews yet.</p>
        ) : null}
        {reviews.map((review) => (
          <Card
            key={review.id}
            className="border-white/10 bg-zinc-950 px-4 py-8 text-white gap-6"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {review.user.avatarUrl ? (
                    <Image
                      src={review.user.avatarUrl}
                      alt={review.user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-cover rounded-3xl"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-3xl bg-zinc-500 flex items-center justify-center">
                      {review.user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-lg font-medium">{review.user.name}</span>
                </div>
                <span className="text-lg font-medium">
                  {formatReviewTime(review.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between">
              <p className="text-base font-medium">{review.content}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="flag"
                className="hover:bg-transparent hover:text-white"
              >
                <CiFlag1 />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
