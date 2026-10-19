"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bot, RotateCcw } from "lucide-react";
import { LoadingMatches } from "@/components/search/loading-matches";
import { MovieMatchCard } from "@/components/search/movie-match-card";
import { Button } from "@/components/ui/button";
import { AI_SEARCH_MAX_LENGTH, AI_SEARCH_MIN_LENGTH, aiSearchQuerySchema } from "@/lib/schemas/ai-search.schema";
import { AiSearchError, fetchAiMovies, type AiMovie, type AiSearchErrorKind } from "@/lib/api/ai-search";

type AiSearchResultsProps = {
  query: string;
};

type SearchState = {
  query: string;
  attempt: number;
} & (
  | { status: "success"; movies: AiMovie[] }
  | { status: "error" | AiSearchErrorKind }
);

export function AiSearchResults({ query }: AiSearchResultsProps) {
  const trimmedQuery = query.trim();
  const isValidQuery = aiSearchQuerySchema.safeParse(query).success;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<SearchState | null>(null);

  useEffect(() => {
    if (!isValidQuery) return;

    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 40_000);

    void fetchAiMovies(trimmedQuery, { signal: controller.signal })
      .then((data) => {
        if (active) {
          setState({ query: trimmedQuery, attempt, status: "success", movies: data.results });
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setState({
            query: trimmedQuery,
            attempt,
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
  }, [attempt, isValidQuery, trimmedQuery]);

  const currentState = state?.query === trimmedQuery && state.attempt === attempt ? state : null;
  const status = !trimmedQuery
    ? "empty-query"
    : !isValidQuery
      ? "invalid-query"
      : currentState?.status ?? "loading";
  const canRetry = status === "error" || status === "unavailable";

  const stateCopy = {
    "empty-query": {
      title: "What would you like to watch?",
      detail: "Describe a story, theme, or mood in English to start finding movies.",
    },
    "invalid-query": {
      title: "Update your description",
      detail: `Please enter an English description between ${AI_SEARCH_MIN_LENGTH} and ${AI_SEARCH_MAX_LENGTH} characters.`,
    },
    "not-ready": {
      title: "AI movie search is coming soon",
      detail: "This search isn't available yet. You can explore movies with title search in the meantime.",
    },
    unavailable: {
      title: "AI movie search is temporarily unavailable",
      detail: "Please try again in a moment, or use title search to keep exploring.",
    },
    error: {
      title: "We couldn't load your movie matches",
      detail: "Please try again in a moment.",
    },
  };

  return (
    <section aria-labelledby="ai-search-title" className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 md:py-12">
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bot aria-hidden="true" className="size-4" />
          AI movie search
        </div>
        <h1 id="ai-search-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">Search results</h1>
      </div>

      {status === "loading" ? <LoadingMatches /> : status === "success" && currentState?.status === "success" ? (
        <div className="space-y-5">
          <p role="status" className="text-sm text-muted-foreground">
            {currentState.movies.length} movie{currentState.movies.length === 1 ? "" : "s"} found in our collection.
          </p>
          {currentState.movies.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {currentState.movies.map((movie) => <MovieMatchCard key={movie.tmdbId} movie={movie} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-border px-6 py-12 text-center">
              <h2 className="text-xl font-semibold">No movies matched this description</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Try a broader theme or a different mood.
              </p>
            </div>
          )}
        </div>
      ) : status in stateCopy ? (
        <div role={canRetry ? "alert" : "status"} className="rounded-2xl border border-border bg-muted/20 px-6 py-10">
          <h2 className="text-xl font-semibold">{stateCopy[status as keyof typeof stateCopy].title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {stateCopy[status as keyof typeof stateCopy].detail}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {canRetry ? (
              <Button type="button" onClick={() => setAttempt((value) => value + 1)} className="rounded-full">
                <RotateCcw aria-hidden="true" className="size-4" />
                Try again
              </Button>
            ) : null}
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/search">Try title search</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
