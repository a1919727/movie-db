import type { MovieDetail } from "@/types/movie";
import { SearchResultCard } from "./search-result-card";

type SearchResultProps = {
  movies: MovieDetail[];
  query?: string;
  totalResults: number;
};

export function SearchResult({
  movies,
  query,
  totalResults,
}: SearchResultProps) {
  const trimmedQuery = query?.trim();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Search Result</h1>
          {!trimmedQuery ? (
            <p className="text-zinc-400">
              Enter a movie title in the search bar to see results.
            </p>
          ) : (
            <p className="text-zinc-400">
              {totalResults} result{totalResults > 1 ? "s" : ""} found "
            </p>
          )}
        </div>
        {trimmedQuery ? (
          movies.length > 0 ? (
            <div className="flex flex-col gap-6">
              {movies.map((movie) => (
                <SearchResultCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-zinc-900 px-6 py-10 text-center text-white">
              <p className="text-zinc-400">Not found movie "{trimmedQuery}".</p>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
