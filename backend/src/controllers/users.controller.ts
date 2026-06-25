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
  const { name, email, avatarUrl } = req.body as {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  };

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ message: "Name and email are required" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        avatarUrl: avatarUrl?.trim() || null,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to fetch user",
    });
  }
}
