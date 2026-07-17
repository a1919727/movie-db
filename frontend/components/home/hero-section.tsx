"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HeroMovie } from "@/types/movie";
import { Button } from "../ui/button";

type HeroSectionProps = {
  movies: HeroMovie[];
};
export function HeroSection({ movies }: HeroSectionProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <Carousel className="w-full">
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem key={movie.id}>
              <div
                className="relative min-h-[560px] overflow-hidden rounded-[32px] bg-zinc-900 bg-cover bg-center bg-no-repeat"
                style={
                  movie.posterUrl
                    ? { backgroundImage: `url(${movie.posterUrl})` }
                    : undefined
                }
              >
                <div className="relative flex min-h-[560px] flex-col justify-end p-6 pb-20 md:p-10 md:pb-24">
                  <div className="max-w-3xl space-y-5">
                    <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
                      {movie.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 text-base text-white/75">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full border-white/20 bg-white/10 p-6 text-white hover:bg-white/20 text-base"
                    >
                      <Link href={`/movies/${movie.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-auto right-20 top-auto bottom-10 translate-y-0 border-white/20 text-white hover:bg-black/65 disabled:opacity-50 md:bottom-14" />
        <CarouselNext className="left-auto right-6 top-auto bottom-10 translate-y-0 border-white/20 text-white hover:bg-black/65 disabled:opacity-50 md:bottom-14" />
      </Carousel>
    </section>
  );
}
