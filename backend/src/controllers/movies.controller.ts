import type { Request, Response } from "express";
import {
  getMovieDetails,
  getPopularMovies,
  searchMovies,
  discoverMovies,
} from "../services/tmdb.service.js";
import { prisma } from "../lib/prisma.js";
import { parseRequest } from "../utils/validation.js";
import { paginationQuerySchema } from "../schemas/common.schema.js";
import {
  discoverMoviesQuerySchema,
  movieIdParamSchema,
  searchMoviesQuerySchema,
} from "../schemas/movie.schema.js";

export async function getMovies(req: Request, res: Response) {
  try {
    const query = parseRequest(paginationQuerySchema, req.query, res);
    if (!query) return;

    const movies = await getPopularMovies(query.page);
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch movies",
    });
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    const params = parseRequest(movieIdParamSchema, req.params, res);
    if (!params) return;

    const movie = await getMovieDetails(params.id);
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch movie details",
    });
  }
}

export async function getUserByClerkId(req: Request, res: Response) {
  const clerkUserId = req.params.clerkUserId;

  if (typeof clerkUserId !== "string") {
    return res.status(400).json({ message: "Invalid clerk user id" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId.trim() },
      include: {
        favorites: {
          include: {
            movie: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}

export async function searchMovieHandler(req: Request, res: Response) {
  try {
    const query = parseRequest(searchMoviesQuerySchema, req.query, res);
    if (!query) return;

    const movies = await searchMovies(query.query, query.page);
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to search movies",
    });
  }
}

export async function discoverMoviesHandler(req: Request, res: Response) {
  try {
    const query = parseRequest(discoverMoviesQuerySchema, req.query, res);
    if (!query) return;

    const movies = await discoverMovies(query);
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to discover movies",
    });
  }
}
