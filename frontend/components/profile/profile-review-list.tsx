"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import type { UserReview } from "@/types/review";
import { Button } from "../ui/button";

type ProfileReviewListProps = {
  reviews: UserReview[];
  onDeleteReview: (reviewId: number) => Promise<void> | void;
};

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function ProfileReviewList({
  reviews,
  onDeleteReview,
}: ProfileReviewListProps) {
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  if (reviews.length === 0) {
    return <div className="mt-8 text-zinc-400">No reviews yet.</div>;
  }

  async function handleDeleteReview(reviewId: number) {
    setDeletingReviewId(reviewId);

    try {
      await onDeleteReview(reviewId);
    } finally {
      setDeletingReviewId(null);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl bg-zinc-900 p-5 text-white">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex justify-between items-center flex-1">
              <h3 className="text-xl font-semibold">{review.title}</h3>
              <span className="text-sm text-zinc-400">
                {formatReviewDate(review.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <p className="leading-7">{review.content}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="trash"
              className="hover:bg-transparent hover:text-white"
              onClick={() => void handleDeleteReview(review.id)}
              disabled={deletingReviewId === review.id}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
