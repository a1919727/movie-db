"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function LoginForm() {
  const [emailAddress, setEmailAddresss] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();
  const isSubmitting = fetchStatus === "fetching";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!signIn) return;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error("Invalid email or password.");
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      console.log("Second factor required.");
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log("Sign-in attempt not complete:", signIn);
    }
  }

  async function handleGoogleLogin() {
    if (!signIn) return;

    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/",
      redirectCallbackUrl: "/sso-callback",
    });

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error("Google login failed.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-md  px-4 py-6 text-foreground sm:p-2">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome back
        </h1>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            onChange={(e) => setEmailAddresss(e.target.value)}
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
            autoComplete="current-password"
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
          disabled={!signIn || isSubmitting}
          className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Login
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
        disabled={!signIn || isSubmitting}
        onClick={handleGoogleLogin}
        className="h-12 w-full gap-3 rounded-xl border-input bg-background font-medium text-foreground hover:bg-muted hover:text-foreground dark:bg-background dark:hover:bg-muted"
      >
        <FcGoogle className="size-5" />
        Login with Google
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="rounded-sm font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Sign up
        </Link>
      </p>
    </section>
  );
}
