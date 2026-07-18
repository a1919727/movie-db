"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getUserByClerkId } from "@/lib/api/users";
import { MovieLibrary } from "@/components/movies/movie-library";
import type { Movies } from "@/types/movie";

function mapFavoriteMovie(movie: {
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

export function FavoritesClient() {
  const { user, isLoaded } = useUser();
  const [movies, setMovies] = useState<Movies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      if (!isLoaded) {
        return;
      }

      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const dbUser = await getUserByClerkId(user.id);
        const favoriteMovies =
          dbUser?.favorites?.map((item) => mapFavoriteMovie(item.movie)) ?? [];
        setMovies(favoriteMovies);
      } catch (Error) {
        console.error(Error);
        setError("Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    }

    void loadFavorites();
  }, [isLoaded, user]);

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <p className="text-zinc-400">Loading favorites...</p>
      </section>
    );
  }

  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-white">Favorites</h1>
          <p className="text-zinc-400">
            {movies.length} favorite movie{movies.length === 1 ? "" : "s"}
          </p>
        </div>
      </section>
      {movies.length > 0 ? (
        <MovieLibrary movies={movies} />
      ) : (
        <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
          <div className="rounded-3xl bg-zinc-900 px-6 py-10 text-center text-white">
            <p className="text-zinc-400">
              You have not added any favorite movies yet.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
