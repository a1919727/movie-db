import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { Prisma } from "@prisma/client";
import { config } from "dotenv";
import {
  EMBEDDING_DIMENSIONS,
  EmbeddingError,
  embedMovieDocument,
  getEmbeddingConfig,
} from "../src/services/embedding.service.js";
import type { EmbeddingDependencies, PendingDocument } from "./types/generate-embeddings.js";

export function parseOptions(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      limit: { type: "string", default: "100" },
      "delay-ms": { type: "string", default: "1000" },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: false,
  });
  const limit = Number(values.limit);
  const delayMs = Number(values["delay-ms"]);
  if (!Number.isInteger(limit) || limit < 1 || limit > 10_000) {
    throw new Error("--limit must be an integer from 1 to 10000.");
  }
  if (!Number.isInteger(delayMs) || delayMs < 0 || delayMs > 60_000) {
    throw new Error("--delay-ms must be an integer from 0 to 60000.");
  }
  return { limit, delayMs, help: values.help };
}

export function vectorLiteral(vector: number[]) {
  if (vector.length !== EMBEDDING_DIMENSIONS || !Array.from(vector).every(Number.isFinite) || !vector.some((value) => value !== 0)) {
    throw new Error("An invalid embedding was returned; no vector was saved.");
  }
  return JSON.stringify(vector);
}

export async function generateEmbeddings(
  options: { limit: number; delayMs: number; model: string },
  dependencies: EmbeddingDependencies,
) {
  const pending = await dependencies.findPending(options.limit, options.model);
  let saved = 0;
  let changed = 0;

  for (const [index, document] of pending.entries()) {
    if (index > 0 && options.delayMs > 0) await dependencies.wait(options.delayMs);
    const vector = await dependencies.embed({ title: document.title, content: document.content });
    vectorLiteral(vector);
    if (await dependencies.save(document, vector, options.model)) {
      saved += 1;
      dependencies.log(`[${index + 1}/${pending.length}] Embedded ${document.title}`);
    } else {
      changed += 1;
      dependencies.log(`[${index + 1}/${pending.length}] Skipped a document updated during generation; rerun to retry.`);
    }
  }

  return { pending: pending.length, saved, changed };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help) {
    console.log("Usage: npm run generate:embeddings -- [--limit 100] [--delay-ms 1000]\nGenerates real Gemini vectors for missing or outdated movie documents.\nUses DATABASE_URL, GEMINI_EMBEDDING_MODEL, and GEMINI_API_KEY (or GOOGLE_API_KEY) from backend/.env.");
    return;
  }

  config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });
  const embeddingConfig = getEmbeddingConfig();
  const model = `${embeddingConfig.provider}:${embeddingConfig.model}`;
  const { prisma } = await import("../src/lib/prisma.js");

  try {
    console.log(`Generating up to ${options.limit} movie embeddings with ${model} (${EMBEDDING_DIMENSIONS} dimensions)...`);
    const result = await generateEmbeddings({ ...options, model }, {
      findPending: (limit, currentModel) => prisma.$queryRaw<PendingDocument[]>(Prisma.sql`
        SELECT id, title, content, "contentHash"
        FROM "MovieDocument"
        WHERE embedding IS NULL
          OR "embeddingModel" IS DISTINCT FROM ${currentModel}
          OR "embeddedContentHash" IS DISTINCT FROM "contentHash"
        ORDER BY id
        LIMIT ${limit}
      `),
      embed: embedMovieDocument,
      save: async (document, vector, currentModel) => {
        const updated = await prisma.$executeRaw(Prisma.sql`
          UPDATE "MovieDocument"
          SET embedding = ${vectorLiteral(vector)}::vector,
              "embeddingModel" = ${currentModel},
              "embeddedContentHash" = ${document.contentHash},
              "embeddedAt" = NOW()
          WHERE id = ${document.id} AND "contentHash" = ${document.contentHash}
        `);
        return updated > 0;
      },
      wait: delay,
      log: console.log,
    });
    console.log(`Completed: ${result.saved} saved; ${result.changed} changed during generation. Current vectors were skipped.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof EmbeddingError ? error.message : "Movie embedding generation failed. Check the database connection, migrations, and command options.");
    console.error("Completed writes are kept. Rerun the command to continue with missing or outdated documents.");
    process.exitCode = 1;
  });
}
