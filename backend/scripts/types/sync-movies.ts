import type {
  getMovieMetadata,
  getPopularMovies,
} from "../../src/services/tmdb.service.js";

export type MovieDocumentData = {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  overview: string | null;
  year: number | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
  content: string;
  contentHash: string;
  syncedAt: Date;
};

export type SyncDependencies = {
  getPopularMovies: typeof getPopularMovies;
  getMovieMetadata: typeof getMovieMetadata;
  upsertMovieDocument: (args: {
    where: { tmdbId: number };
    create: MovieDocumentData;
    update: MovieDocumentData;
  }) => Promise<unknown>;
  log: (message: string) => void;
};
