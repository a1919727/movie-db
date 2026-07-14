"use client";

import { TbMovie } from "react-icons/tb";
import { CiStar, CiHeart } from "react-icons/ci";
import { useState } from "react";
import Link from "next/link";
import type { Movies } from "@/types/movie";
import type { User } from "@/types/user";
import type { UserReview } from "@/types/review";
import { ProfileMovieCarousel } from "./profile-movie-carousel";
import { ProfileReviewList } from "./profile-review-list";
import { Button } from "../ui/button";

type ProfileTabsProps = {
  user: User;
  reviews: UserReview[];
  onDeleteReview: (reviewId: number) => Promise<void> | void;
};

function mapMovieToMovieCard(movie: {
  tmdbId: number;
  title: string;
  year: number | null;
  rating: number | null;
  posterUrl: string | null;
}): Movies {
  return {
    id: movie.tmdbId,
    title: movie.title,
    year: movie.year ?? 0,
    rating: movie.rating ?? 0,
    posterUrl: movie.posterUrl ?? "",
  };
}

export function ProfileTabs({
  user,
  reviews,
  onDeleteReview,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"Watch" | "Review" | "Favorites">(
    "Watch",
  );

  const watchedMovies: Movies[] =
    user.watched?.map((item) => mapMovieToMovieCard(item.movie)) ?? [];

  const favoriteMovies: Movies[] =
    user.favorites?.map((item) => mapMovieToMovieCard(item.movie)) ?? [];

  const profileStats = [
    { label: "Watch", value: watchedMovies.length, icon: TbMovie },
    { label: "Review", value: reviews.length, icon: CiStar },
    { label: "Favorites", value: favoriteMovies.length, icon: CiHeart },
  ] as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="-mt-4 mb-6 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/10 p-4 text-base text-white hover:bg-white/20"
        >
          <Link href="/profile/edit">Edit profile</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        {profileStats.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.label;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActiveTab(item.label)}
              className={`flex flex-col items-center rounded-2xl py-6 transition ${
                isActive
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-black" : "text-zinc-400"
                  }`}
                />
                <span className={isActive ? "text-black" : "text-zinc-400"}>
                  {item.label}
                </span>
              </div>
              <span className="text-2xl font-bold">{item.value}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "Watch" && (
        <ProfileMovieCarousel href="/watchlist" movies={watchedMovies} />
      )}

      {activeTab === "Favorites" && (
        <ProfileMovieCarousel href="/favorites" movies={favoriteMovies} />
      )}

      {activeTab === "Review" && (
        <ProfileReviewList reviews={reviews} onDeleteReview={onDeleteReview} />
      )}
    </section>
  );
}
