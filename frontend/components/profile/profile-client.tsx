"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getReviewsByUserId } from "@/lib/api/reviews";
import { getUserByClerkId } from "@/lib/api/users";
import type { User } from "@/types/user";
import type { UserReview } from "@/types/review";
import { ProfileHeader } from "./profile-header";
import { ProfileTabs } from "./profile-tabs";

export function ProfileClient() {
  const { user, isLoaded } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
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
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfileData();
  }, [isLoaded, user]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8 text-white">
        Loading...
      </section>
    );
  }

  if (!dbUser) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8 text-white">
        User not found.
      </section>
    );
  }

  return (
    <>
      <ProfileHeader user={dbUser} />
      <ProfileTabs user={dbUser} reviews={reviews} />
    </>
  );
}
