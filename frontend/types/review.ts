export type Review = {
  id: number;
  content: string;
  createdAt: string;
  tmdbMovieId: number;
  userId: number;
  user: {
    id: number;
    name: string;
    avatarUrl: string | null;
  };
};
