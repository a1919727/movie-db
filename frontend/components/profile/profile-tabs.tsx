"use client";

import { TbMovie } from "react-icons/tb";
import { CiStar, CiHeart } from "react-icons/ci";
import { useState } from "react";
import Link from "next/link";

import { movies } from "@/data/mock-data";
import { ProfileMovieCarousel } from "./profile-movie-carousel";
import { Button } from "../ui/button";

const profileStats = [
  { label: "Watch", value: 247, icon: TbMovie },
  { label: "Review", value: 89, icon: CiStar },
  { label: "Favorites", value: 15, icon: CiHeart },
] as const;

const profileCollections = {
  Watch: { href: "/watchlist", movies },
  Review: { href: "/reviews", movies: [...movies].reverse() },
  Favorites: { href: "/favorites", movies: movies.slice(0, 6) },
} as const;

export function ProfileTabs() {
  const [activeTab, setActiveTab] =
    useState<(typeof profileStats)[number]["label"]>("Watch");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="flex justify-end -mt-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20 text-base p-4"
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

      <ProfileMovieCarousel
        href={profileCollections[activeTab].href}
        movies={profileCollections[activeTab].movies}
      />
    </section>
  );
}
