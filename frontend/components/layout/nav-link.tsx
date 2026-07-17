"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { RequireAuthDialog } from "@/components/ui/require-auth-dialog";

type NavLinkProps = {
  href: string;
  label: string;
  requiresAuth?: boolean;
};

export function NavLink({ href, label, requiresAuth }: NavLinkProps) {
  const { isSignedIn } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  function handleClick(event: React.MouseEvent) {
    if (requiresAuth && !isSignedIn) {
      event.preventDefault();
      setShowAuthDialog(true);
    }
  }

  return (
    <>
      <Link
        href={href}
        onClick={handleClick}
        className="text-base font-medium text-foreground"
      >
        {label}
      </Link>
      <RequireAuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
}
