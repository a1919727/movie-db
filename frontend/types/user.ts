export type StoredMovie = {
  id: number;
  tmdbId: number;
  title: string;
  year: number | null;
  rating: number | null;
  posterUrl: string | null;
  description: string | null;
};

export type FavoriteMovie = {
  id: number;
  movieId: number;
  createdAt: string;
  movie: StoredMovie;
};

export type WatchedMovie = {
  id: number;
  movieId: number;
  watchedAt: string;
  movie: StoredMovie;
};

export type User = {
  id: number;
  clerkUserId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  favorites?: FavoriteMovie[];
  watched?: WatchedMovie[];
};
