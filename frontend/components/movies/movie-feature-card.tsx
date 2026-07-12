"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Heart } from "lucide-react";
import { CiPlay1 } from "react-icons/ci";
import type { MovieDetail } from "@/types/movie";
import { addFavorite, deleteFavorite, getUserByClerkId } from "@/lib/api/users";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";

type MovieFeatureCardProps = {
  movie: MovieDetail;
};

export function MovieFeatureCard({ movie }: MovieFeatureCardProps) {
  const { user, isLoaded } = useUser();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWatch = () =>
    movie.watchUrl
      ? window.open(movie.watchUrl, "_blank", "noopener, noreferrer")
      : toast.error("Sorry, no available resource");

  useEffect(() => {
    async function favoriteStatus() {
      if (!isLoaded || !user) return;

      const dbUser = await getUserByClerkId(user.id);
      const favorited = dbUser?.favorites?.some(
        (item) => item.movie.tmdbId === movie.id,
      );
      setIsFavorite(Boolean(favorited));
    }
    void favoriteStatus();
  }, [isLoaded, user, movie.id]);

  async function handleToggleFavorite() {
    if (!isLoaded || !user) {
      toast.error("Please sign in first");
      return;
    }

    setIsSubmitting(true);

    try {
      const dbUser = await getUserByClerkId(user.id);

      if (!dbUser) {
        toast.error("User profile has bot synced");
        return;
      }

      if (isFavorite) {
        await deleteFavorite(dbUser.id, movie.id);
        setIsFavorite(false);
        toast.success("Deleted from favorites");
      } else {
        await addFavorite(dbUser.id, {
          tmdbId: movie.id,
          title: movie.title,
          year: movie.year,
          rating: movie.rating,
          posterUrl: movie.posterUrl,
          description: movie.description,
          genres: movie.genres,
        });

        setIsFavorite(true);
        toast.success("Saved to favorites");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update favorites",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-10 sm:grid-cols-[240px_1fr] md:grid-cols-[1fr_2fr] lg:grid-cols-[300px_1fr]">
      <div className="overflow-hidden rounded-2xl bg-zinc-900">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            width={600}
            height={900}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] items-center justify-center text-sm text-zinc-500">
            No poster
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold">{movie.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {movie.genres.map((genre) => (
            <Badge key={genre} variant="outline" className="px-3 py-2 text-sm">
              {genre}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-3 text-base text-white">
          <span>{movie.year}</span>
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
            {movie.rating.toFixed(1)}
          </span>
        </div>
        <p className="max-w-3xl">{movie.description}</p>
        <div className="flex gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-4xl bg-white p-4 text-base font-semibold text-black"
            onClick={handleWatch}
          >
            <Link href="#">
              <CiPlay1 />
              Watch
            </Link>
          </Button>

          <Button
            type="button"
            size="lg"
            className="rounded-4xl p-4 text-base font-semibold border-white-50"
            onClick={handleToggleFavorite}
            disabled={isSubmitting}
          >
            <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            Save to favorites
          </Button>
        </div>
      </div>
    </div>
  );
}
