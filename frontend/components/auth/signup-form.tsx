"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isPendingVerification, setIsPendingVerification] = useState(false);

  const isSubmitting = fetchStatus === "fetching";

  async function finalizeSignUp() {
    if (!signUp) return;

    const { error } = await signUp.finalize({
      navigate: ({ decorateUrl }) => {
        const url = decorateUrl("/");

        if (url.startsWith("http")) {
          window.location.href = url;
          return;
        }

        router.push(url);
      },
    });

    if (error) {
      toast.error("Failed to complete sign up.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signUp) return;

    const { error } = await signUp.create({
      emailAddress,
      password,
      unsafeMetadata: {
        name: name.trim(),
      },
    });

    if (error) {
      toast.error("Sign up failed.");
      return;
    }

    if (signUp.status === "complete") {
      await finalizeSignUp();
      return;
    }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields.includes("email_address")
    ) {
      const { error: verificationError } =
        await signUp.verifications.sendEmailCode();

      if (verificationError) {
        toast.error("Failed to send verification code.");
        return;
      }

      setIsPendingVerification(true);
      toast.success("Verification code sent to your email.");
      return;
    }

    toast.error("Sign up is not complete.");
  }

  async function handleEmailVerification(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!signUp) return;

    const { error } = await signUp.verifications.verifyEmailCode({
      code: verificationCode,
    });

    if (error) {
      toast.error("Invalid verification code.");
      return;
    }

    if (signUp.status !== "complete") {
      toast.error("Email verification is not complete.");
      return;
    }

    await finalizeSignUp();
  }

  async function handleGoogleSignup() {
    if (!signUp) return;

    const { error } = await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectCallbackUrl: "/sso-callback",
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error("Google sign up failed.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-md text-foreground">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Create an account
        </h1>
      </div>
      {isPendingVerification ? (
        <form className="space-y-5" onSubmit={handleEmailVerification}>
          <div className="grid gap-2">
            <Label htmlFor="verificationCode" className="font-medium">
              Verification code
            </Label>
            <Input
              id="verificationCode"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter the code from your email"
              className="h-12 w-full rounded-xl border-input bg-muted/50 px-4 text-foreground dark:bg-muted/50"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={!signUp || isSubmitting}
            className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Verify email
          </Button>
        </form>
      ) : (
        <>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Please enter your name"
                className="h-12 w-full rounded-xl border-input bg-muted/50 px-4 text-foreground dark:bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Please enter your email"
                className="h-12 w-full rounded-xl border-input bg-muted/50 px-4 text-foreground dark:bg-muted/50"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Please enter your password"
                className="h-12 w-full rounded-xl border-input bg-muted/50 px-4 text-foreground dark:bg-muted/50"
                required
              />
            </div>
            <div id="clerk-captcha" />
            <Button
              type="submit"
              disabled={!signUp || isSubmitting}
              className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Sign up
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="flex-1 border-t border-border" />
            <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground">
              OR
            </span>
            <span className="flex-1 border-t border-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={!signUp || isSubmitting}
            onClick={handleGoogleSignup}
            className="h-12 w-full gap-3 rounded-xl border-input bg-background font-medium text-foreground hover:bg-muted hover:text-foreground dark:bg-background dark:hover:bg-muted"
          >
            <FcGoogle className="size-5" />
            Signup with Google
          </Button>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Login
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
