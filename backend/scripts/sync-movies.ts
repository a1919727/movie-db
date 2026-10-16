import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { Prisma } from "@prisma/client";
import { config } from "dotenv";
import {
  getMovieMetadata,
  getPopularMovies,
  type TmdbMovieMetadata,
} from "../src/services/tmdb.service.js";

const MAX_TMDB_PAGE = 500;
const REQUEST_TIMEOUT_MS = 15_000;

export type MovieDocumentData = {
  tmdbId: number;
  title: string;
  overview: string | null;
  year: number | null;
  rating: number | null;
  genres: string[];
  runtime: number | null;
  content: string;
  contentHash: string;
  syncedAt: Date;
};

export type SyncDependencies = {
  getPopularMovies: typeof getPopularMovies;
  getMovieMetadata: typeof getMovieMetadata;
  upsertMovieDocument: (args: {
    where: { tmdbId: number };
    create: MovieDocumentData;
    update: MovieDocumentData;
  }) => Promise<unknown>;
  log: (message: string) => void;
};

export function parseOptions(args: string[]) {
  const { values } = parseArgs({
    args,
    options: {
      count: { type: "string", default: "100" },
      help: { type: "boolean", short: "h", default: false },
    },
    allowPositionals: false,
  });

  if (values.help) return { help: true, count: 100 };

  const count = Number(values.count);

  if (!Number.isInteger(count) || count < 1 || count > 10_000) {
    throw new Error("--count must be an integer between 1 and 10000.");
  }

  return { help: false, count };
}

export function buildMovieDocument(movie: TmdbMovieMetadata): MovieDocumentData {
  const title = movie.title?.trim();

  if (!Number.isSafeInteger(movie.id) || movie.id < 1 || !title) {
    throw new Error("TMDB returned a movie without a valid ID or title.");
  }

  const overview = movie.overview?.trim() || null;
  const releaseYear = /^(\d{4})-\d{2}-\d{2}$/.exec(movie.release_date)?.[1];
  const year = releaseYear && Number(releaseYear) > 0 ? Number(releaseYear) : null;
  const rating = Number.isFinite(movie.vote_average) ? movie.vote_average : null;
  const genres = [...new Set(
    (movie.genres ?? []).map((genre) => genre.name.trim()).filter(Boolean),
  )].sort();
  const runtime = movie.runtime !== null && Number.isFinite(movie.runtime) && movie.runtime > 0
    ? movie.runtime
    : null;
  const directors = [...new Set(
    (movie.credits?.crew ?? [])
      .filter((member) => member.job === "Director")
      .map((member) => member.name.trim())
      .filter(Boolean),
  )].sort();
  const cast = (movie.credits?.cast ?? [])
    .slice()
    .sort((a, b) => a.order - b.order || a.id - b.id)
    .slice(0, 5)
    .map((member) => member.name.trim())
    .filter(Boolean);
  // Keep changing ratings out of the text so they do not invalidate embeddings.
  const content = [
    `Title: ${title}`,
    year === null ? null : `Year: ${year}`,
    genres.length ? `Genres: ${genres.join(", ")}` : null,
    runtime === null ? null : `Runtime: ${runtime} minutes`,
    directors.length ? `Director: ${directors.join(", ")}` : null,
    cast.length ? `Cast: ${cast.join(", ")}` : null,
    overview ? `Overview: ${overview}` : null,
  ].filter((line) => line !== null).join("\n");

  return {
    tmdbId: movie.id,
    title,
    overview,
    year,
    rating,
    genres,
    runtime,
    content,
    contentHash: createHash("sha256").update(content).digest("hex"),
    syncedAt: new Date(),
  };
}

export async function syncMovies(count: number, dependencies: SyncDependencies) {
  const seen = new Set<number>();
  let synced = 0;
  let totalPages = MAX_TMDB_PAGE;

  for (let page = 1; page <= totalPages && synced < count; page += 1) {
    const movies = await dependencies.getPopularMovies(
      page,
      AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    );
    totalPages = Math.min(movies.total_pages, MAX_TMDB_PAGE);

    if (!movies.results.length) break;

    for (const movie of movies.results) {
      if (synced >= count) break;
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);

      const detail = await dependencies.getMovieMetadata(
        movie.id,
        AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      );

      if (detail.id !== movie.id) {
        throw new Error(`TMDB returned a different movie for ID ${movie.id}.`);
      }

      const document = buildMovieDocument(detail);

      try {
        await dependencies.upsertMovieDocument({
          where: { tmdbId: document.tmdbId },
          create: document,
          update: document,
        });
      } catch (error) {
        throw new Error(
          `Could not save TMDB movie ${movie.id}${databaseErrorCode(error)}. Check the database connection and migrations.`,
        );
      }

      synced += 1;
      dependencies.log(`[${synced}/${count}] Synced ${document.title} (TMDB ${document.tmdbId})`);
    }
  }

  if (synced < count) {
    throw new Error(`Only ${synced} of ${count} movies were synced; TMDB returned no more unique movies.`);
  }

  return synced;
}

function databaseErrorCode(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return ` (Prisma ${error.code})`;
  }

  if (error instanceof Prisma.PrismaClientInitializationError && error.errorCode) {
    return ` (Prisma ${error.errorCode})`;
  }

  return "";
}

async function main() {
  const options = parseOptions(process.argv.slice(2));

  if (options.help) {
    console.log("Usage: npm run sync:movies -- [--count 100]\n\nSync 1-10000 popular TMDB movies into MovieDocument (default: 100).\nUses DATABASE_URL and TMDB_API_KEY from the environment or backend/.env.");
    return;
  }

  config({ path: fileURLToPath(new URL("../.env", import.meta.url)), quiet: true });

  for (const key of ["DATABASE_URL", "TMDB_API_KEY"] as const) {
    if (!process.env[key]?.trim()) {
      throw new Error(`Missing ${key}. Configure it in backend/.env or the environment.`);
    }
  }

  const { prisma } = await import("../src/lib/prisma.js");

  try {
    try {
      await prisma.movieDocument.count();
    } catch (error) {
      throw new Error(`Could not access MovieDocument${databaseErrorCode(error)}. Check DATABASE_URL and apply the Prisma migrations first.`);
    }

    console.log(`Syncing ${options.count} popular movies into MovieDocument...`);
    const synced = await syncMovies(options.count, {
      getPopularMovies,
      getMovieMetadata,
      upsertMovieDocument: (args) => prisma.movieDocument.upsert(args),
      log: console.log,
    });
    console.log(`Completed: ${synced} movies synced. Existing TMDB IDs were updated.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(`Movie sync failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    console.error("Any completed writes are kept. Rerun the command to retry the sync.");
    process.exitCode = 1;
  });
}
