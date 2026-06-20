import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

export function SignupForm() {
  return (
    <section className="mx-auto flex min-h-[800px] w-full max-w-7xl items-center justify-center px-4 py-6">
      <Card className="w-full max-w-xl rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-6 text-[#D2D2D2] sm:gap-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-semibold">
            Create an account
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <form className="space-y-5 sm:space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="name"
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
                placeholder="Please enter your password"
                className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                required
              />
            </div>
            <Button
              type="submit"
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
