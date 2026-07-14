"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserByClerkId } from "@/lib/api/users";
import { deleteReview, getReviewsByUserId } from "@/lib/api/reviews";
import type { User } from "@/types/user";
import type { UserReview } from "@/types/review";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";
import { toast } from "sonner";

export function ProfileClient() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded || !user) {
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
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [isLoaded, user]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-white">Loading...</div>
    );
  }

  if (!dbUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-white">
        User not found.
      </div>
    );
  }

  async function handleDeleteReview(reviewId: number) {
    if (!dbUser) return;

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

  return (
    <>
      <ProfileHeader user={dbUser} />
      <ProfileTabs
        user={dbUser}
        reviews={reviews}
        onDeleteReview={handleDeleteReview}
      />
    </>
  );
}
