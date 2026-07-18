"use client";

import { useState } from "react";
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

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div
          role="button"
          tabIndex={0}
          className="cursor-pointer rounded-3xl transition hover:bg-white/3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          onClick={(event) => {
            if (isInteractiveElementClick(event.target)) {
              return;
            }

            handleOpenDetails();
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") {
              return;
            }

            if (isInteractiveElementClick(event.target)) {
              return;
            }

            event.preventDefault();
            handleOpenDetails();
          }}
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
