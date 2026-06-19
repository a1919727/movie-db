import type { Movies } from "@/types/movie";
import Link from "next/link";
import { MovieCard } from "./movie-card";

const movies: Movies[] = [
  {
    id: 1,
    title: "Movie 1",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 2,
    title: "Movie 2",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 3,
    title: "Movie 3",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 4,
    title: "Movie 4",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 5,
    title: "Movie 5",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 6,
    title: "Movie 6",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 7,
    title: "Movie 7",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 8,
    title: "Movie 8",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
];

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
