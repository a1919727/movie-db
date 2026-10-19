"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import type { MovieDetail } from "@/types/movie";
import { MovieFeatureCard } from "../movies/movie-feature-card";
import { RequireAuthDialog } from "../ui/require-auth-dialog";

type SearchResultCardProps = {
  movie: MovieDetail;
};

export function SearchResultCard({ movie }: SearchResultCardProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  function isInteractiveElementClick(target: EventTarget | null) {
    return (
      target instanceof HTMLElement &&
      Boolean(target.closest("button, a, input, textarea, select"))
    );
  }

  function handleOpenDetails() {
    if (!isSignedIn) {
      setShowAuthDialog(true);
      return;
    }

    router.push(`/movies/${movie.id}`);
  }

  function handleCardClick(event: MouseEvent<HTMLDivElement>) {
    if (isInteractiveElementClick(event.target)) {
      return;
    }

    handleOpenDetails();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    if (isInteractiveElementClick(event.target)) {
      return;
    }

    event.preventDefault();
    handleOpenDetails();
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div
          role="button"
          tabIndex={0}
          className="cursor-pointer rounded-3xl transition hover:bg-white/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          onClick={handleCardClick}
          onKeyDown={handleCardKeyDown}
        >
          <MovieFeatureCard movie={movie} />
        </div>
      </section>
      <RequireAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </>
  );
}
