/*
  Warnings:

  - You are about to drop the column `movieId` on the `Review` table. All the data in the column will be lost.
  - Added the required column `tmdbMovieId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movieId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN "tmdbMovieId" INTEGER;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "movieId";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "tmdbMovieId" SET NOT NULL;
