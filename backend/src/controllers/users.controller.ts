import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        id: "asc",
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (!userId) return res.status(400).json({ message: "Invalid user id" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reviews: {
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: true,
        watched: {
          orderBy: {
            watchedAt: "desc",
          },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  const { name, email, avatarUrl, clerkUserId } = req.body as {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    clerkUserId?: string;
  };

  if (!name?.trim() || !email?.trim() || !clerkUserId?.trim()) {
    res
      .status(400)
      .json({ message: "Name, email, and clerkUserId are required" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl?.trim() || null,
        clerkUserId: clerkUserId.trim(),
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
}

export async function syncUser(req: Request, res: Response) {
  const { name, email, avatarUrl, clerkUserId } = req.body as {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
    clerkUserId?: string;
  };

  const normalizedName = name?.trim();
  const normalizedEmail = email?.trim().toLowerCase();
  const normalizedClerkUserId = clerkUserId?.trim();

  if (!normalizedEmail || !normalizedClerkUserId) {
    res.status(400).json({ message: "Email and clerkUserId are required" });
    return;
  }

  const fallbackName =
    normalizedName || normalizedEmail.split("@")[0] || "User";

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { clerkUserId: normalizedClerkUserId },
          { email: normalizedEmail },
        ],
      },
    });

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            clerkUserId: normalizedClerkUserId,
            email: normalizedEmail,
            name: fallbackName,
            avatarUrl: avatarUrl?.trim() || null,
          },
        })
      : await prisma.user.create({
          data: {
            clerkUserId: normalizedClerkUserId,
            email: normalizedEmail,
            name: fallbackName,
            avatarUrl: avatarUrl?.trim() || null,
          },
        });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to sync user",
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
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
}

export async function addFavorite(req: Request, res: Response) {
  const userId = Number(req.params.id);

  const { tmdbId, title, year, rating, posterUrl, description } = req.body as {
    tmdbId?: number;
    title?: string;
    year?: number;
    rating?: number;
    posterUrl?: string;
    description?: string;
  };

  if (!userId || !tmdbId || !title?.trim()) {
    return res
      .status(400)
      .json({ message: "Invalid userId or tmdbId or title" });
  }
  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {
        title: title.trim(),
        year: year ?? null,
        rating: rating ?? null,
        posterUrl: posterUrl ?? null,
        description: description ?? null,
      },
      create: {
        tmdbId,
        title: title.trim(),
        year: year ?? null,
        rating: rating ?? null,
        posterUrl: posterUrl ?? null,
        description: description ?? null,
      },
    });

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
      update: {},
      create: {
        userId,
        movieId: movie.id,
      },
    });

    return res.status(201).json(favorite);
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to add favorite",
    });
  }
}

export async function deleteFavorite(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const tmdbMovieId = Number(req.params.tmdbMovieId);

  if (!userId || !tmdbMovieId) {
    return res.status(400).json({ message: "Invalid params" });
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { tmdbId: tmdbMovieId },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await prisma.favorite.delete({
      where: {
        userId_movieId: {
          userId,
          movieId: movie.id,
        },
      },
    });
    return res.status(200).json({ message: "Delete favourite successfully" });
  } catch (error) {
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete favorite",
    });
  }
}
