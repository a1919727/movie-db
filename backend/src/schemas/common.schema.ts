import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const clerkUserIdParamSchema = z.object({
  clerkUserId: z.string().trim().min(1),
});

export const userMovieParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
  tmdbMovieId: z.coerce.number().int().positive(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
});
