"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { syncClerkUser } from "@/lib/api/users";

export function SyncClerkUser() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const clerkUserId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = user?.fullName;
  const avatarUrl = user?.imageUrl;

  useEffect(() => {
    if (!isSignedIn || !clerkUserId || !email) {
      return;
    }

    void syncClerkUser({
      clerkUserId,
      email,
      name,
      avatarUrl,
    }).catch((error: unknown) => {
      console.error("Failed to sync Clerk user:", error);
    });
  }, [avatarUrl, clerkUserId, email, isSignedIn, name]);

  return null;
}
