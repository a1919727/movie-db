import type { Movies } from "@/types/movie";
import { MovieCard } from "./movie-card";

type MovieLibraryProps = {
  movies: Movies[];
};

export function MovieLibrary({ movies }: MovieLibraryProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
