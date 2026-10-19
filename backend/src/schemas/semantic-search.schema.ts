import { z } from "zod";

export const semanticSearchQuerySchema = z.object({
  query: z.string().trim().min(3).max(500),
});

export type SemanticSearchQuery = z.infer<typeof semanticSearchQuerySchema>;
