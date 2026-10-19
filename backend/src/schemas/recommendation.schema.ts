import { z } from "zod";

export const MAX_RECOMMENDATION_REASON_LENGTH = 400;
export const MAX_RECOMMENDATION_MOVIES = 10;

export function createRecommendationResponseSchema(movieIds: number[]) {
  return z.strictObject({
    recommendations: z.array(z.strictObject({
      tmdbId: z.literal(movieIds.map(String)),
      reason: z.string().trim().min(1).max(MAX_RECOMMENDATION_REASON_LENGTH),
    })).length(movieIds.length),
  }).superRefine(({ recommendations }, context) => {
    const seen = new Set<string>();

    for (const [index, recommendation] of recommendations.entries()) {
      if (seen.has(recommendation.tmdbId)) {
        context.addIssue({
          code: "custom",
          path: ["recommendations", index, "tmdbId"],
          message: "Each retrieved movie must have exactly one recommendation.",
        });
      }
      seen.add(recommendation.tmdbId);
    }
  });
}

export function createRecommendationResponseJsonSchema(movieIds: number[]) {
  return z.toJSONSchema(createRecommendationResponseSchema(movieIds));
}
