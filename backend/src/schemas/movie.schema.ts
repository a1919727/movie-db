import { z } from "zod";

export const moviePayloadSchema = z.object({
  tmdbId: z.number().int().positive(),
  title: z.string().trim().min(1),
  year: z.number().int().nonnegative().nullable().optional(),
  rating: z.number().min(0).max(10).nullable().optional(),
  posterUrl: z.url().trim().or(z.literal("")).nullable().optional(),
  description: z.string().trim().nullable().optional(),
});

export const movieIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const searchMoviesQuerySchema = z.object({
  query: z.string().trim().min(1),
  page: z.coerce.number().int().positive().catch(1),
});

export const discoverMoviesQuerySchema = z.object({
  genre: z.string().trim().optional(),
  year: z.string().trim().optional(),
  rating: z.string().trim().optional(),
  page: z.coerce.number().int().positive().catch(1),
});

export type MoviePayload = z.infer<typeof moviePayloadSchema>;
