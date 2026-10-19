"use client";

import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { LoadingMatches } from "@/components/search/loading-matches";
import { MovieMatchCard } from "@/components/search/movie-match-card";
import { aiSearchQuerySchema } from "@/lib/schemas/ai-search.schema";
import { AiSearchError, fetchAiMovies, type AiMovie, type AiSearchErrorKind } from "@/lib/api/ai-search";

type AiSearchResultsProps = {
  query: string;
};

type SearchState = {
  query: string;
} & (
  | { status: "success"; movies: AiMovie[] }
  | { status: "error" | AiSearchErrorKind }
);

export function AiSearchResults({ query }: AiSearchResultsProps) {
  const trimmedQuery = query.trim();
  const isValidQuery = aiSearchQuerySchema.safeParse(query).success;
  const [state, setState] = useState<SearchState | null>(null);

  useEffect(() => {
    if (!isValidQuery) return;

    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 40_000);

    void fetchAiMovies(trimmedQuery, { signal: controller.signal })
      .then((data) => {
        if (active) {
          setState({ query: trimmedQuery, status: "success", movies: data.results });
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setState({
            query: trimmedQuery,
            status: cause instanceof AiSearchError ? cause.kind : "error",
          });
        }
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [isValidQuery, trimmedQuery]);

  const currentState = state?.query === trimmedQuery ? state : null;
  const isLoading = isValidQuery && currentState === null;
  const movies = currentState?.status === "success" ? currentState.movies : [];

  return (
    <section aria-labelledby="ai-search-title" className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:py-12">
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bot aria-hidden="true" className="size-4" />
          AI movie search
        </div>
        <h1 id="ai-search-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Search results</h1>
      </div>

      {isLoading ? <LoadingMatches /> : movies.length > 0 ? (
        <div className="space-y-5">
          <p role="status" className="text-sm text-muted-foreground">
            {movies.length} movie{movies.length === 1 ? "" : "s"} found in our collection.
          </p>
          <div className="grid gap-4 lg:grid-cols-2">
            {movies.map((movie) => <MovieMatchCard key={movie.tmdbId} movie={movie} />)}
          </div>
        </div>
      ) : (
        <p role="status" className="text-sm text-muted-foreground">Not found</p>
      )}
    </section>
  );
}
