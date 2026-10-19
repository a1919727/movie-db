-- CreateTable
CREATE TABLE "MovieDocument" (
    "id" SERIAL NOT NULL,
    "tmdbId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT,
    "year" INTEGER,
    "rating" DOUBLE PRECISION,
    "genres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "runtime" INTEGER,
    "content" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MovieDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MovieDocument_tmdbId_key" ON "MovieDocument"("tmdbId");
