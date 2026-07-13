import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";
import { parseRequest } from "../utils/validation.js";
import {
  clerkUserIdParamSchema,
  idParamSchema,
  userMovieParamsSchema,
} from "../schemas/common.schema.js";
import { moviePayloadSchema } from "../schemas/movie.schema.js";
import { createUserSchema, syncUserSchema } from "../schemas/user.schema.js";

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const params = parseRequest(idParamSchema, req.params, res);
  if (!params) return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        reviews: { orderBy: { createdAt: "desc" } },
        favorites: { include: { movie: true } },
        watched: { include: { movie: true }, orderBy: { watchedAt: "desc" } },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  const body = parseRequest(createUserSchema, req.body, res);
  if (!body) return;

  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        avatarUrl: body.avatarUrl || null,
        clerkUserId: body.clerkUserId,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch user",
    });
  }
}

export async function syncUser(req: Request, res: Response) {
  const body = parseRequest(syncUserSchema, req.body, res);
  if (!body) return;

  const fallbackName = body.name || body.email.split("@")[0] || "User";

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkUserId: body.clerkUserId }, { email: body.email }],
      },
    });

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            clerkUserId: body.clerkUserId,
            email: body.email,
            name: fallbackName,
            avatarUrl: body.avatarUrl || null,
          },
        })
      : await prisma.user.create({
          data: {
            clerkUserId: body.clerkUserId,
            email: body.email,
            name: fallbackName,
            avatarUrl: body.avatarUrl || null,
          },
        });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to sync user",
    });
  }
}

export async function getUserByClerkId(req: Request, res: Response) {
  const params = parseRequest(clerkUserIdParamSchema, req.params, res);
  if (!params) return;

  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId: params.clerkUserId },
      include: {
        favorites: { include: { movie: true }, orderBy: { createdAt: "desc" } },
        watched: { include: { movie: true }, orderBy: { watchedAt: "desc" } },
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

export async function addFavorite(req: Request, res: Response) {
  const params = parseRequest(idParamSchema, req.params, res);
  if (!params) return;

  const body = parseRequest(moviePayloadSchema, req.body, res);
  if (!body) return;

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId: body.tmdbId },
      update: {
        title: body.title,
        year: body.year ?? null,
        rating: body.rating ?? null,
        posterUrl: body.posterUrl ?? null,
        description: body.description ?? null,
      },
      create: {
        tmdbId: body.tmdbId,
        title: body.title,
        year: body.year ?? null,
        rating: body.rating ?? null,
        posterUrl: body.posterUrl ?? null,
        description: body.description ?? null,
      },
    });

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_movieId: {
          userId: params.id,
          movieId: movie.id,
        },
      },
      update: {},
      create: {
        userId: params.id,
        movieId: movie.id,
      },
    });

    return res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add favorite",
    });
  }
}

export async function deleteFavorite(req: Request, res: Response) {
  const params = parseRequest(userMovieParamsSchema, req.params, res);
  if (!params) return;

  try {
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: params.tmdbMovieId },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    await prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId: params.id,
          movieId: movie.id,
        },
      },
    });
    return res.status(200).json({ message: "Delete favourite successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete favorite",
    });
  }
}

export async function addWatched(req: Request, res: Response) {
  const params = parseRequest(idParamSchema, req.params, res);
  if (!params) return;

  const body = parseRequest(moviePayloadSchema, req.body, res);
  if (!body) return;

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId: body.tmdbId },
      update: {
        title: body.title,
        year: body.year ?? null,
        rating: body.rating ?? null,
        posterUrl: body.posterUrl ?? null,
        description: body.description ?? null,
      },
      create: {
        tmdbId: body.tmdbId,
        title: body.title,
        year: body.year ?? null,
        rating: body.rating ?? null,
        posterUrl: body.posterUrl ?? null,
        description: body.description ?? null,
      },
    });

    const watchedMovie = await prisma.watchedMovie.upsert({
      where: {
        userId_movieId: {
          userId: params.id,
          movieId: movie.id,
        },
      },
      update: {},
      create: {
        userId: params.id,
        movieId: movie.id,
      },
    });

    return res.status(201).json(watchedMovie);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to add favorite",
    });
  }
}

export async function deleteWatched(req: Request, res: Response) {
  const params = parseRequest(userMovieParamsSchema, req.params, res);
  if (!params) return;

  try {
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: params.tmdbMovieId },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await prisma.watchedMovie.delete({
      where: {
        userId_movieId: {
          userId: params.id,
          movieId: movie.id,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to delete watched movie",
    });
  }
}
