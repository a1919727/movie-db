"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SignOutButton, useAuth, useUser } from "@clerk/nextjs";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserByClerkId } from "@/lib/api/users";
import type { User } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthControls() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [dbUser, setDbUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSignedIn || !user?.id) return;

    let isMounted = true;

    async function loadDbUser() {
      const fetchedUser = await getUserByClerkId(user!.id).catch(() => null);

      if (isMounted) {
        setDbUser(fetchedUser);
      }
    }

    function handleProfileUpdated(event: Event) {
      const updatedUser = (event as CustomEvent<User>).detail;
      setDbUser(updatedUser);
    }

    void loadDbUser();
    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-3">
        <Button
          asChild
          variant="outline"
          className="bg-black text-white hover:bg-black hover:text-white"
        >
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const displayName = dbUser?.name || user?.fullName || "User";
  const avatarUrl = dbUser?.avatarUrl || user?.imageUrl;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={`${displayName} avatar`} />
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <SignOutButton>
          <DropdownMenuItem className="flex items-center gap-2">
            <LogOutIcon className="h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
