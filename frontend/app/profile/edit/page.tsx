import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CiLock } from "react-icons/ci";

export default function ProfileEdit() {
  return (
    <section className="mx-auto flex min-h-[60px] w-full max-w-7xl items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-6 text-[#D2D2D2] sm:gap-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <CardHeader className="px-0 ">
          <CardTitle className="text-3xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:pt-8">
          <form className="space-y-5 sm:space-y-6">
            <div className="flex flex-col items-start gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-2xl font-semibold text-white">
                J
              </div>
              <Button
                type="button"
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50"
              >
                Upload Avatar
              </Button>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
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
            <div className="flex flex-col gap-4 border-t border-[#1F1F1F]">
              <h3 className="text-xl mt-4 flex items-center gap-2">
                <CiLock /> Change Password
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="current-password" className="font-semibold">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  placeholder="Please enter your current password"
                  className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password" className="font-semibold">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  placeholder="Please enter your new password"
                  className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-new-password" className="font-semibold">
                  Confirm new Password
                </Label>
                <Input
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type="password"
                  placeholder="Please confirm your new password"
                  className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button
                type="submit"
                className="mt-5 h-11 w-full font-bold sm:h-12 sm:w-2/5"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                className="mt-5 h-11 w-full border-zinc-700 bg-zinc-900 font-bold text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 sm:h-12 sm:w-2/5"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
