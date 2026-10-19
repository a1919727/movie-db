import { Router } from "express";
import {
  getMovieById,
  getMovies,
  searchMovieHandler,
  discoverMoviesHandler,
} from "../controllers/movies.controller.js";
import { semanticSearchHandler } from "../controllers/semantic-search.controller.js";
import { createSemanticSearchRateLimiter } from "../middleware/semantic-search-rate-limit.js";

const router = Router();

router.get("/", getMovies);
router.get("/search", searchMovieHandler);
router.get("/search/semantic", createSemanticSearchRateLimiter(), semanticSearchHandler);
router.get("/discover", discoverMoviesHandler);
router.get("/:id", getMovieById);

export default router;
