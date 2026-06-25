import type { Request, Response } from "express";
import {
  getMovieDetails,
  getPopularMovies,
  searchMovies,
  discoverMovies,
} from "../services/tmdb.service.js";

export async function getMovies(req: Request, res: Response) {
  try {
    const page =
      typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;
    const movies = await getPopularMovies(page);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to fetch movies",
    });
  }
}

export async function getMovieById(req: Request, res: Response) {
  const movieId = Number(req.params.id);

  if (!movieId) {
    res.status(400).json({ message: "Invalid movie id" });
    return;
  }

  try {
    const movie = await getMovieDetails(movieId);
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch movie details",
    });
  }
}

export async function searchMovieHandler(req: Request, res: Response) {
  const query =
    typeof req.query.query === "string" ? req.query.query.trim() : "";
  if (!query) {
    res.status(400).json({ message: "Query is required" });
    return;
  }

  try {
    const page =
      typeof req.query.page === "string" ? Number(req.query.page) || 1 : 1;
    const movies = await searchMovies(query, page);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to search movies",
    });
  }
}

export async function discoverMoviesHandler(req: Request, res: Response) {
  const { genre, page, rating, year } = req.query;
  const params = {
    ...(typeof genre === "string" ? { genre } : {}),
    ...(typeof year === "string" ? { year } : {}),
    ...(typeof rating === "string" ? { rating } : {}),
    ...(typeof page === "string" ? { page: Number(page) || 1 } : {}),
  };

  try {
    const movies = await discoverMovies(params);
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to discover movies",
    });
  }
}
