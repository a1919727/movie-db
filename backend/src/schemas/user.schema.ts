import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().toLowerCase().email(),
  avatarUrl: z.string().trim().url().nullable().optional(),
  clerkUserId: z.string().trim().min(1),
});

export const syncUserSchema = z.object({
  name: z.string().trim().nullable().optional(),
  email: z.string().trim().toLowerCase().email(),
  avatarUrl: z.string().trim().url().nullable().optional(),
  clerkUserId: z.string().trim().min(1),
});
