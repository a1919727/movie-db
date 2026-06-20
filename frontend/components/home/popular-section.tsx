import Link from "next/link";
import { movies } from "@/data/mock-data";
import { MovieCard } from "../movies/movie-card";

export function PopularSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8 mb-6">
      <div className="flex justify-between">
        <h1 className="text-3xl mb-4">Popular Movies</h1>
        <Link href="/movies">View All</Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
