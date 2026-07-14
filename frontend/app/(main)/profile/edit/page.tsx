"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserByClerkId, updateUserProfile } from "@/lib/api/users";
import type { User } from "@/types/user";

const MAX_AVATAR_SIZE = 1024 * 1024;

export default function ProfileEdit() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!isLoaded) return;

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const fetchedUser = await getUserByClerkId(user.id);
        setDbUser(fetchedUser);
        setName(fetchedUser?.name ?? "");
        setAvatarUrl(fetchedUser?.avatarUrl ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    void loadProfile();
  }, [isLoaded, user]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  async function handleAvatarChange(file: File | undefined) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error("Avatar image must be 1MB or smaller.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreviewUrl((currentPreviewUrl) => {
      if (currentPreviewUrl) {
        URL.revokeObjectURL(currentPreviewUrl);
      }

      return previewUrl;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dbUser) {
      toast.error("User profile has not synced yet.");
      return;
    }

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateUserProfile(dbUser.id, {
        name,
        avatar: avatarFile,
      });
      window.dispatchEvent(
        new CustomEvent<User>("profile-updated", {
          detail: updatedUser,
        }),
      );
      toast.success("Profile updated.");
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8 text-white">
        Loading...
      </section>
    );
  }

  if (!dbUser) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-8 text-white">
        User not found.
      </section>
    );
  }

  const fallbackInitial = name.charAt(0).toUpperCase() || "U";
  const displayedAvatarUrl = avatarPreviewUrl ?? avatarUrl;

  return (
    <section className="mx-auto flex min-h-[60px] w-full max-w-7xl items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-6 text-[#D2D2D2] sm:gap-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <CardHeader className="px-0">
          <CardTitle className="text-3xl font-semibold">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-0 sm:pt-8">
          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col items-start gap-3">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-2xl font-semibold text-white">
                {displayedAvatarUrl ? (
                  <img
                    src={displayedAvatarUrl}
                    alt={name || "User avatar"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  fallbackInitial
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) =>
                  void handleAvatarChange(event.target.files?.[0])
                }
              />
              <Button
                type="button"
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera />
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
                value={name}
                onChange={(event) => setName(event.target.value)}
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
                value={dbUser.email}
                className="h-11 w-full bg-[#1A1A1A] text-[#D2D2D2] sm:h-12"
                disabled
              />
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button
                type="submit"
                className="mt-5 h-11 w-full font-bold sm:h-12 sm:w-2/5"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="mt-5 h-11 w-full border-zinc-700 bg-zinc-900 font-bold text-zinc-50 hover:bg-zinc-800 hover:text-zinc-50 sm:h-12 sm:w-2/5"
              >
                <Link href="/profile">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
