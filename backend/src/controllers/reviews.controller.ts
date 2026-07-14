import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { parseRequest } from "../utils/validation.js";
import { idParamSchema } from "../schemas/common.schema.js";
import {
  createReviewSchema,
  deleteReviewBodySchema,
  reviewsQuerySchema,
} from "../schemas/review.schema.js";
import { getMovieDetails } from "../services/tmdb.service.js";

export async function getReviews(req: Request, res: Response) {
  const query = parseRequest(reviewsQuerySchema, req.query, res);
  if (!query) return;

  const tmdbMovieId = query.tmdbMovieId ?? query.movieId;

  if (!tmdbMovieId) {
    return res.status(400).json({ message: "Invalid TMDB movie id" });
  }
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
    console.error(error);
    res.status(500).json({
      message: "Failed to get movie reviews",
    });
  }
}

export async function getReviewsByUserId(req: Request, res: Response) {
  const params = parseRequest(idParamSchema, req.params, res);
  if (!params) return;

  try {
    const reviews = await prisma.review.findMany({
      where: { userId: params.id },
      orderBy: { createdAt: "desc" },
    });

    const reviewsWithMovieTitle = await Promise.all(
      reviews.map(async (review) => {
        try {
          const movie = await getMovieDetails(review.tmdbMovieId);

          return {
            ...review,
            title: movie.title,
          };
        } catch {
          return {
            ...review,
            title: `Movie ${review.tmdbMovieId}`,
          };
        }
      }),
    );

    res.status(200).json(reviewsWithMovieTitle);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to get user reviews",
    });
  }
}

export async function createReview(req: Request, res: Response) {
  const body = parseRequest(createReviewSchema, req.body, res);
  if (!body) return;

  try {
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: body.userId,
        tmdbMovieId: body.tmdbMovieId,
      },
    });

    const review = existingReview
      ? await prisma.review.update({
          where: {
            id: existingReview.id,
          },
          data: {
            content: body.content,
          },
          include: {
            user: true,
          },
        })
      : await prisma.review.create({
          data: {
            userId: body.userId,
            tmdbMovieId: body.tmdbMovieId,
            content: body.content,
          },
          include: {
            user: true,
          },
        });

    res.status(existingReview ? 200 : 201).json(review);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create reviews" });
  }
}

export async function deleteReview(req: Request, res: Response) {
  const params = parseRequest(idParamSchema, req.params, res);
  if (!params) return;

  const body = parseRequest(deleteReviewBodySchema, req.body, res);
  if (!body) return;

  try {
    const existingReview = await prisma.review.findUnique({
      where: { id: params.id },
    });

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (existingReview.userId !== body.userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own review" });
    }

    await prisma.review.delete({
      where: { id: params.id },
    });

    return res.status(200).json({ message: "Delete review successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete reviews",
    });
  }
}
