import { z } from "zod";

export const AI_SEARCH_MIN_LENGTH = 3;
export const AI_SEARCH_MAX_LENGTH = 500;
export const AI_SEARCH_QUERY_ERROR = `Describe your movie in ${AI_SEARCH_MIN_LENGTH}–${AI_SEARCH_MAX_LENGTH} characters.`;

export const aiSearchQuerySchema = z.string()
  .trim()
  .min(AI_SEARCH_MIN_LENGTH, AI_SEARCH_QUERY_ERROR)
  .max(AI_SEARCH_MAX_LENGTH, AI_SEARCH_QUERY_ERROR);

export const aiMovieSchema = z.object({
  tmdbId: z.number().int().positive(),
  title: z.string().min(1),
  overview: z.string().nullable(),
  year: z.number().int().nullable(),
  rating: z.number().nullable(),
  genres: z.array(z.string()),
  runtime: z.number().int().nullable(),
  posterUrl: z.string().nullable().optional(),
  reason: z.string().trim().min(1).max(400).optional(),
}).strip();

export const aiSearchResponseSchema = z.object({
  results: z.array(aiMovieSchema),
}).strip();

export const aiSearchErrorCodeSchema = z.object({
  code: z.string().optional(),
});

export type AiMovie = z.infer<typeof aiMovieSchema>;
export type AiSearchResponse = z.infer<typeof aiSearchResponseSchema>;
