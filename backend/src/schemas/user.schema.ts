import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email().trim().toLowerCase(),
  avatarUrl: z.url().trim().nullable().optional(),
  clerkUserId: z.string().trim().min(1),
});

export const syncUserSchema = z.object({
  name: z.string().trim().nullable().optional(),
  email: z.email().trim().toLowerCase(),
  avatarUrl: z.url().trim().nullable().optional(),
  clerkUserId: z.string().trim().min(1),
});

export const updateUserProfileSchema = z.object({
  name: z.string().trim().min(1),
});
