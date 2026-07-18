"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MovieLibrary } from "@/components/movies/movie-library";
import { getUserByClerkId } from "@/lib/api/users";
import type { Movies } from "@/types/movie";

function mapWatchedMovie(movie: {
  tmdbId: number;
  title: string;
  year: number | null;
  rating: number | null;
  posterUrl: string | null;
}): Movies {
  return {
    id: movie.tmdbId,
    title: movie.title,
    year: movie.year ?? 0,
    rating: movie.rating ?? 0,
    posterUrl: movie.posterUrl ?? "",
  };
}

export function WatchlistClient() {
  const { user, isLoaded } = useUser();
  const [movies, setMovies] = useState<Movies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWatchlist() {
      if (!isLoaded) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const dbUser = await getUserByClerkId(user.id);
        const watchedMovies =
          dbUser?.watched?.map((item) => mapWatchedMovie(item.movie)) ?? [];
        setMovies(watchedMovies);
      } catch (error) {
        console.error(error);
        setError("Failed to load watchlist");
      } finally {
        setIsLoading(false);
      }
    }

    void loadWatchlist();
  }, [isLoaded, user]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <p className="text-zinc-400">Loading watchlist...</p>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Watchlist</h1>
          <p className="text-zinc-400">
            {movies.length} watched movie{movies.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>
      {movies.length > 0 ? (
        <MovieLibrary movies={movies} />
      ) : (
        <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
          <div className="rounded-3xl bg-zinc-900 px-6 py-10 text-center text-white">
            <p className="text-zinc-400">No watched movie</p>
          </div>
        </section>
      )}
    </>
  );
}
