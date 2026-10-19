import type { Request, Response } from "express";
import { semanticSearchQuerySchema } from "../schemas/semantic-search.schema.js";
import { EmbeddingError } from "../services/embedding.service.js";
import { searchMoviesByMeaning, SemanticSearchError } from "../services/semantic-search.service.js";
import { parseRequest } from "../utils/validation.js";

export async function semanticSearchHandler(req: Request, res: Response) {
  try {
    const query = parseRequest(semanticSearchQuerySchema, req.query, res);
    if (!query) return;

    res.status(200).json(await searchMoviesByMeaning(query.query));
  } catch (error) {
    if (error instanceof SemanticSearchError) {
      res.status(503).json({ code: error.code, message: error.message });
      return;
    }

    if (error instanceof EmbeddingError) {
      if (error.kind === "notconfigured") {
        res.status(503).json({
          code: "NOT_CONFIGURED",
          message: "AI movie search is not configured yet.",
        });
      } else if (error.kind === "invalid-input") {
        res.status(400).json({
          code: "INVALID_QUERY",
          message: "Enter a movie description between 3 and 500 characters.",
        });
      } else {
        res.status(503).json({
          code: "SEARCH_UNAVAILABLE",
          message: "AI movie search is temporarily unavailable. Please try again later.",
        });
      }
      return;
    }

    console.error("Semantic movie search failed.");
    res.status(500).json({
      code: "SEARCH_FAILED",
      message: "Unable to search movies right now. Please try again later.",
    });
  }
}
