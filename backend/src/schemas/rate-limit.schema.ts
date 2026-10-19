import { z } from "zod";

export const aiSearchRateLimitEnvSchema = z.object({
  AI_SEARCH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  AI_SEARCH_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().max(2_147_483_647).default(60_000),
});
