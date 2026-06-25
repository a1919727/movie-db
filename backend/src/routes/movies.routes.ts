import { Router } from "express";
import {
  getMovieById,
  getMovies,
  searchMovieHandler,
  discoverMoviesHandler,
} from "../controllers/movies.controller.js";

const router = Router();

router.get("/", getMovies);
router.get("/search", searchMovieHandler);
router.get("/discover", discoverMoviesHandler);
router.get("/:id", getMovieById);

export default router;
