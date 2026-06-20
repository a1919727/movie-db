import { MovieSelector } from "./movie-selector";

const GenreOptions = [
  { label: "Action", value: "action" },
  { label: "Drama", value: "drama" },
  { label: "Comedy", value: "comedy" },
];

const ReleaseYearOptions = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
];

const RatingOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

const filters = [
  { id: "genre", placeholder: "Genre", options: GenreOptions },
  {
    id: "release-year",
    placeholder: "Release Year",
    options: ReleaseYearOptions,
  },
  { id: "rating", placeholder: "Rating", options: RatingOptions },
];

export function MovieHeader() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <h1 className="text-3xl mb-3">Movie Library</h1>
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        {filters.map((filter) => (
          <MovieSelector
            key={filter.id}
            placeholder={filter.placeholder}
            options={filter.options}
          />
        ))}
      </div>
    </section>
  );
}
