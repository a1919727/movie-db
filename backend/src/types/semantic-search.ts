export type SemanticMovie = {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  overview: string | null;
  year: number | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
};

export type RecommendedMovie = SemanticMovie & { reason: string };
