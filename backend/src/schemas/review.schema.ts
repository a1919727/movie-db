import { z } from "zod";

export const createReviewSchema = z.object({
  userId: z.number().int().positive(),
  tmdbMovieId: z.number().int().positive(),
  content: z.string().trim().min(1),
});

export const reviewsQuerySchema = z.object({
  tmdbMovieId: z.coerce.number().int().positive().optional(),
  movieId: z.coerce.number().int().positive().optional(),
});

export const deleteReviewBodySchema = z.object({
  userId: z.number().int().positive(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
