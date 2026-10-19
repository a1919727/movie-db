"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Film, Star } from "lucide-react";
import type { AiMovie } from "@/lib/api/ai-search";

export function MovieMatchCard({ movie }: { movie: AiMovie }) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);
  const posterUrl = movie.posterUrl;

  return (
    <article className="grid min-w-0 grid-cols-[6rem_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[10rem_minmax(0,1fr)]">
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-muted">
        {posterUrl && posterUrl !== failedPosterUrl ? (
          <Image
            src={posterUrl}
            alt={`${movie.title} poster`}
            width={320}
            height={480}
            sizes="(min-width: 1024px) 160px, (min-width: 640px) 144px, 96px"
            className="h-full w-full object-cover"
            onError={() => setFailedPosterUrl(posterUrl)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-1 text-center text-muted-foreground">
            <Film aria-hidden="true" className="size-5" />
            <span className="text-xs">No poster</span>
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-3">
        <h2 className="text-xl font-semibold leading-snug">
          <Link
            href={`/movies/${movie.tmdbId}`}
            className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {movie.title}
          </Link>
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {movie.year !== null ? <span>{movie.year}</span> : null}
          {movie.rating !== null ? (
            <span className="inline-flex items-center gap-1">
              <Star aria-hidden="true" className="size-3.5 fill-amber-300 text-amber-300" />
              <span className="sr-only">Rating </span>
              {movie.rating.toFixed(1)}/10
            </span>
          ) : null}
          {movie.runtime !== null && movie.runtime > 0 ? (
            <span>{movie.runtime} min</span>
          ) : null}
        </div>
        {movie.genres.length > 0 ? (
          <p className="text-xs text-muted-foreground">{movie.genres.join(" · ")}</p>
        ) : null}
        {movie.reason ? (
          <div className="space-y-1 border-t border-border pt-3">
            <h3 className="text-sm font-medium">Recommended reason</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{movie.reason}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
