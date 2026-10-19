import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import {
  embedSearchQuery,
  getEmbeddingConfig,
} from "./embedding.service.js";

export type SemanticMovie = {
  tmdbId: number;
  title: string;
  posterUrl: string | null;
  overview: string | null;
  year: number | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
};

export class SemanticSearchError extends Error {
  constructor(
    public readonly code: "INDEX_NOT_READY" | "SEARCH_UNAVAILABLE",
    message: string,
  ) {
    super(message);
    this.name = "SemanticSearchError";
  }
}

export async function searchMoviesByMeaning(
  query: string,
): Promise<{ results: SemanticMovie[] }> {
  const config = getEmbeddingConfig();
  const embeddingModel = `${config.provider}:${config.model}`;
  const availability = await prisma.$queryRaw<Array<{ ready: boolean }>>(
    Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM "MovieDocument"
        WHERE "embedding" IS NOT NULL
          AND "embeddingModel" = ${embeddingModel}
          AND "embeddedContentHash" = "contentHash"
      ) AS "ready"
    `,
  );

  if (!availability[0]?.ready) {
    throw new SemanticSearchError(
      "INDEX_NOT_READY",
      "AI movie search is not ready yet.",
    );
  }

  const embedding = await embedSearchQuery(query);

  if (
    embedding.length !== config.dimensions ||
    !embedding.every(Number.isFinite) ||
    !embedding.some((value) => value !== 0)
  ) {
    throw new SemanticSearchError(
      "SEARCH_UNAVAILABLE",
      "AI movie search is temporarily unavailable.",
    );
  }

  const vector = `[${embedding.join(",")}]`;
  const results = await prisma.$queryRaw<SemanticMovie[]>(Prisma.sql`
    SELECT
      "tmdbId",
      "title",
      "posterUrl",
      "overview",
      "year",
      "rating",
      COALESCE("genres", ARRAY[]::TEXT[]) AS "genres",
      "runtime"
    FROM "MovieDocument"
    WHERE "embedding" IS NOT NULL
      AND "embeddingModel" = ${embeddingModel}
      AND "embeddedContentHash" = "contentHash"
    ORDER BY "embedding" <=> ${vector}::vector ASC, "tmdbId" ASC
    LIMIT ${10}
  `);

  return { results };
}
