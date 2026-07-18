"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { deleteReview, getReviewsByUserId } from "@/lib/api/reviews";
import { getUserByClerkId } from "@/lib/api/users";
import { ProfileReviewList } from "@/components/profile/profile-review-list";
import type { UserReview } from "@/types/review";
import type { User } from "@/types/user";

export function ReviewsClient() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReviews() {
      if (!isLoaded) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedUser = await getUserByClerkId(user.id);
        setDbUser(fetchedUser);

        if (fetchedUser) {
          const fetchedReviews = await getReviewsByUserId(fetchedUser.id);
          setReviews(fetchedReviews);
        }
      } catch (loadError) {
        console.error(error);
        setError("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    }

    void loadReviews();
  }, [isLoaded, user]);

  async function handleDeleteReview(reviewId: number) {
    if (!dbUser) {
      return;
    }

    try {
      await deleteReview(reviewId, dbUser.id);
      setReviews((currentReviews) =>
        currentReviews.filter((review) => review.id !== reviewId),
      );
      toast.success("Review deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete review");
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <p className="text-zinc-400">Loading reviews...</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Reviews</h1>
        <p className="text-zinc-400">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>
      </div>
      <ProfileReviewList
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
      />
    </section>
  );
}
