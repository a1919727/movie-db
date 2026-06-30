"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { createUser } from "@/lib/api/users";

export function SignupForm() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  const isSubmitting = fetchStatus === "fetching";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signUp) return;

    const { error } = await signUp.create({
      emailAddress,
      password,
    });

    if (error) {
      toast.error("Sign up failed.");
      return;
    }

    if (signUp.status !== "complete" || !signUp.createdUserId) {
      toast.error("Sign up is not complete.");
      return;
    }

    try {
      await createUser({
        clerkUserId: signUp.createdUserId,
        name: name.trim(),
        email: emailAddress.trim(),
        avatarUrl: null,
      });

      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
            return;
          }

          router.push(url);
        },
      });

      if (finalizeError) {
        toast.error("Failed to complete sign up.");
      }
    } catch (createUserError) {
      toast.error(
        createUserError instanceof Error
          ? createUserError.message
          : "Failed to create app user",
      );
    }
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
    <section className="mx-auto flex min-h-[800px] w-full max-w-7xl items-center justify-center px-4 py-6">
      <Card className="w-full max-w-xl rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-6 text-[#D2D2D2] sm:gap-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-semibold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Please enter your name"
                className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="Please enter your email"
                className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="font-semibold">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Please enter your password"
                className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                required
              />
            </div>
            <div id="clerk-captcha" />
            <Button
              type="submit"
              disabled={!signUp || isSubmitting}
              className="mt-5 h-11 font-bold w-full bg-zinc-200 text-black hover:bg-zinc-300"
            >
              Sign up
            </Button>
          </form>
          <div className="mt-5 flex items-center gap-3">
            <span className="border-t flex-1 boder border-[#1A1A1A]" />
            <span className="text-sm font-bold tracking-[0.3em] text-zinc-500">
              OR
            </span>
            <span className="border-t flex-1 border-[#1A1A1A]" />
          </div>
          <Button
            variant="outline"
            disabled={!signUp || isSubmitting}
            onClick={handleGoogleSignup}
            className="mt-5 h-11 w-full font-bold border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 sm:h-12"
          >
            <FcGoogle className="h-6 w-6" />
            Signup with Google
          </Button>
          <p className="text-center mt-4 text-base">
            Already have an account?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
