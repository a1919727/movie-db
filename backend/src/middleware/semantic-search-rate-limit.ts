import { isIP } from "node:net";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { aiSearchRateLimitEnvSchema } from "../schemas/rate-limit.schema.js";

export function createSemanticSearchRateLimiter() {
  const config = aiSearchRateLimitEnvSchema.parse(process.env);
  const isRailway = Boolean(process.env.RAILWAY_ENVIRONMENT_ID?.trim());

  return rateLimit({
    windowMs: config.AI_SEARCH_RATE_LIMIT_WINDOW_MS,
    limit: config.AI_SEARCH_RATE_LIMIT_MAX,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator(request) {
      // Railway's public edge overwrites X-Real-IP. Ignore this header elsewhere.
      const railwayIp = isRailway ? request.get("x-real-ip")?.trim() : undefined;
      const ip = railwayIp && isIP(railwayIp)
        ? railwayIp
        : request.ip || request.socket.remoteAddress || "unknown";

      return ipKeyGenerator(ip);
    },
    message: {
      code: "RATE_LIMITED",
      message: "Too many AI searches. Please try again later.",
    },
  });
}
