"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="mx-auto flex min-h-[760px] w-full max-w-7xl items-center justify-center px-4 py-6">
      <Card className="w-full max-w-xl rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-6 text-[#D2D2D2] sm:gap-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-semibold">Welcome back</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-2 sm:pt-8">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddresss(e.target.value)}
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
              disabled={!signIn || isSubmitting}
              className="mt-5 h-11 font-bold w-full bg-zinc-200 text-black hover:bg-zinc-300"
            >
              Login
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
            type="button"
            variant="outline"
            disabled={!signIn || isSubmitting}
            onClick={handleGoogleLogin}
            className="mt-5 h-11 w-full font-bold border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 sm:h-12"
          >
            <FcGoogle className="h-6 w-6" />
            Login with Google
          </Button>
          <p className="text-center mt-4 text-base">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
