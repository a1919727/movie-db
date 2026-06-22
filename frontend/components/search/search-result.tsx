import { movieDetails } from "@/data/mock-data";
import { SearchResultCard } from "./search-result-card";

export function SearchResult() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Search Result</h1>
          <p className="text-zinc-400">
            {movieDetails.length} result{movieDetails.length > 1 ? "s" : ""}{" "}
            found
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {movieDetails.map((movie) => (
            <SearchResultCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  );
}
