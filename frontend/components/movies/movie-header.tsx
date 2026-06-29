"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MovieSelector } from "./movie-selector";

const GenreOptions = [
  { label: "All Genres", value: "all" },
  { label: "Action", value: "28" },
  { label: "Drama", value: "18" },
  { label: "Comedy", value: "35" },
];

const ReleaseYearOptions = [
  { label: "All Years", value: "all" },
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
];

const RatingOptions = [
  { label: "All Ratings", value: "all" },
  { label: "7+", value: "7" },
  { label: "8+", value: "8" },
  { label: "9+", value: "9" },
];

const filters = [
  { id: "genre", placeholder: "Genre", options: GenreOptions },
  { id: "year", placeholder: "Release Year", options: ReleaseYearOptions },
  { id: "rating", placeholder: "Rating", options: RatingOptions },
] as const;

type MovieHeaderProps = {
  genre?: string;
  rating?: string;
  year?: string;
};

export function MovieHeader({ genre, rating, year }: MovieHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const values = { genre, year, rating };

  function movieFilter(key: "genre" | "year" | "rating", value: string) {
    const params = new URLSearchParams(currentSearchParams.toString());

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <h1 className="text-3xl mb-3">Movie Library</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        {filters.map((filter) => (
          <MovieSelector
            key={filter.id}
            placeholder={filter.placeholder}
            options={filter.options}
            value={values[filter.id] ?? "all"}
            onValueChange={(value) => movieFilter(filter.id, value)}
          />
        ))}
      </div>
    </section>
  );
}
