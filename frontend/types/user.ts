export type FavoriteMovie = {
  id: number;
  movieId: number;
  movie: {
    id: number;
    tmdbId: number;
    title: string;
    year: number | null;
    rating: number | null;
    posterUrl: string | null;
    description: string | null;
  };
};

export type User = {
  id: number;
  clerkUserId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  favorites?: FavoriteMovie[];
};
