"use client";

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

const popularMovies: HeroMovie[] = [
  {
    id: 1,
    title: "Movie 1",
    year: 2024,
    rating: 8.7,
    description:
      "2009-yilda Pixar tomonidan suratga olingan animatsion film. Keksaygan Karl Frederiksen uyini minglab sharlar yordamida Janubiy Amerikaga uchiradi va tasodifan yosh sarguzashtchi bilan sayohat qiladi.",
    posterUrl: "",
  },
  {
    id: 2,
    title: "Movie 2",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 3,
    title: "Movie 3",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 4,
    title: "Movie 4",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 5,
    title: "Movie 5",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 6,
    title: "Movie 6",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 7,
    title: "Movie 7",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 8,
    title: "Movie 8",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 9,
    title: "Movie 9",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
  {
    id: 10,
    title: "Movie 10",
    year: 2024,
    rating: 8.7,
    description: "This movie....",
    posterUrl: "",
  },
];

export function HeroSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <Carousel className="w-full">
        <CarouselContent>
          {popularMovies.map((movie) => (
            <CarouselItem key={movie.id}>
              <div
                className="relative overflow-hidden rounded-[32px] min-h-[560px] bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${movie.posterUrl})` }}
              >
                <div className="relative flex min-h-[560px] flex-col justify-center p-6 md:p-10">
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
                    <p className="text-base">{movie.description}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-white/20 bg-white/10 p-6 text-white hover:bg-white/20 text-base"
                    >
                      View Details
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
