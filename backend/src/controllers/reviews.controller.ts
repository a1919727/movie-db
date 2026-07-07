import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getReviews(req: Request, res: Response) {
  try {
    const movieIdParam = req.query.tmdbMovieId ?? req.query.movieId;
    const tmdbMovieId = Number(movieIdParam);

    if (!tmdbMovieId) {
      return res.status(400).json({ message: "Invalid TMDB movie id" });
    }

    const reviews = await prisma.review.findMany({
      where: { tmdbMovieId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to get movie reviews",
    });
  }
}

export async function getReviewsByUserId(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (!userId) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to get user reviews",
    });
  }
}

export async function createReview(req: Request, res: Response) {
  const { userId, tmdbMovieId, content } = req.body as {
    userId?: number;
    tmdbMovieId?: number;
    content?: string;
  };

  if (!Number.isInteger(userId) || !Number.isInteger(tmdbMovieId)) {
    return res
      .status(400)
      .json({ message: "userId and tmdbMovieId are required" });
  }
  if (!content?.trim()) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: Number(userId),
        tmdbMovieId: Number(tmdbMovieId),
      },
    });

    const review = existingReview
      ? await prisma.review.update({
          where: {
            id: existingReview.id,
          },
          data: {
            content: content.trim(),
          },
          include: {
            user: true,
          },
        })
      : await prisma.review.create({
          data: {
            userId: Number(userId),
            tmdbMovieId: Number(tmdbMovieId),
            content: content.trim(),
          },
          include: {
            user: true,
          },
        });

    res.status(existingReview ? 200 : 201).json(review);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to create reviews",
    });
  }
}

export async function deleteReview(req: Request, res: Response) {
  const reviewId = Number(req.params.id);
  const { userId } = req.body as {
    userId?: number;
  };

  if (!Number.isInteger(reviewId) || !Number.isInteger(userId)) {
    return res.status(400).json({ message: "Missing review id and user id" });
  }

  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existingReview.userId !== Number(userId)) {
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    }
    await prisma.review.delete({ where: { id: reviewId } });
    return res.status(200).json({ message: "Delete review successfully" });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to delete reviews",
    });
  }
}
