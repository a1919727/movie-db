import type { Response } from "express";
import { z } from "zod";

export function parseRequest<T>(
  schema: z.ZodType<T>,
  value: unknown,
  res: Response,
): T | null {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    res.status(400).json({
      message: "Invalid request data",
      errors: z.flattenError(parsed.error),
    });
    return null;
  }

  return parsed.data;
}
