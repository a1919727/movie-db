"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import type { SetActiveNavigate } from "@clerk/shared/types";
import { createUser, getUserByClerkId } from "@/lib/api/users";

export default function SsoCallbackPage() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    const navigateToApp: SetActiveNavigate = async ({ session, decorateUrl }) => {
      const user = session.user;

      if (user) {
        try {
          await getUserByClerkId(user.id);
        } catch {
          if (user.primaryEmailAddress?.emailAddress) {
            await createUser({
              clerkUserId: user.id,
              name: user.fullName || user.firstName || "Anonymous",
              email: user.primaryEmailAddress.emailAddress,
              avatarUrl: user.imageUrl ?? null,
            });
          }
        }
      }

      const url = decorateUrl("/");
      if (url.startsWith("http")) {
        window.location.href = url;
      } else {
        router.replace(url);
      }
    }

    function navigateToSignIn() {
      router.replace("/login");
    }

    function navigateToSignUp() {
      router.replace("/signup");
    }

    async function run() {
      if (!clerk.loaded || hasRun.current) return;
      hasRun.current = true;

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: navigateToApp });
        return;
      }

      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        if ((signIn.status as string) === "complete") {
          await signIn.finalize({ navigate: navigateToApp });
          return;
        }
        navigateToSignIn();
        return;
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every(
          (factor) => factor.strategy === "enterprise_sso",
        )
      ) {
        navigateToSignIn();
        return;
      }

      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if ((signUp.status as string) === "complete") {
          await signUp.finalize({ navigate: navigateToApp });
          return;
        }
        navigateToSignUp();
        return;
      }

      if (signUp.status === "complete") {
        await signUp.finalize({ navigate: navigateToApp });
        return;
      }

      if (
        signIn.status === "needs_second_factor" ||
        signIn.status === "needs_new_password"
      ) {
        navigateToSignIn();
        return;
      }

      const existingSessionId =
        signIn.existingSession?.sessionId ?? signUp.existingSession?.sessionId;
      if (existingSessionId) {
        await clerk.setActive({
          session: existingSessionId,
          navigate: navigateToApp,
        });
      }
    }

    run();
  }, [clerk, signIn, signUp, router]);

  return <div>Signing you in...</div>;
}
