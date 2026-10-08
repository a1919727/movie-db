"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HeroMovie } from "@/types/movie";
import { Button } from "../ui/button";
import { RequireAuthDialog } from "../ui/require-auth-dialog";

type HeroSectionProps = {
  movies: HeroMovie[];
};
export function HeroSection({ movies }: HeroSectionProps) {
  const { isSignedIn } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  function handleViewDetailsClick(event: React.MouseEvent) {
    if (!isSignedIn) {
      event.preventDefault();
      setShowAuthDialog(true);
    }
  }

  return (
    <section className="w-full overflow-hidden">
      <h1 className="sr-only">Discover featured movies</h1>
      <Carousel className="w-full">
        <CarouselContent className="ml-0">
          {movies.map((movie, index) => (
            <CarouselItem key={movie.id} className="pl-0">
              <div className="relative overflow-hidden bg-zinc-900">
                {(movie.backdropUrl || movie.posterUrl) && (
                  <Image
                    src={movie.backdropUrl || movie.posterUrl}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background/50 via-black/5 to-transparent" />
                <div className="relative mx-auto flex min-h-[520px] w-full max-w-7xl flex-col justify-end px-4 pb-28 pt-16 sm:min-h-[600px] sm:px-6 md:min-h-[640px] md:pb-32 lg:min-h-[min(760px,85svh)] lg:px-8">
                  <div className="max-w-2xl space-y-5">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                      {movie.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-base text-white/75">
                      {movie.year > 0 && <><span>{movie.year}</span><span aria-hidden="true">•</span></>}
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                        {movie.rating.toFixed(1)}
                        <span className="text-sm text-white/60">/ 10 · TMDB</span>
                      </span>
                    </div>
                    {movie.description && (
                      <p className="line-clamp-3 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                        {movie.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-7">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="min-h-12 rounded-full border-white/25 bg-white/10 px-6 text-base text-white backdrop-blur-sm hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
                    >
                      <Link
                        href={`/movies/${movie.id}`}
                        onClick={handleViewDetailsClick}
                      >
                        View Details
                        <ArrowRight aria-hidden="true" className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="pointer-events-none absolute inset-x-0 bottom-7 mx-auto h-11 max-w-7xl">
          <CarouselPrevious size="icon" className="pointer-events-auto bottom-0 left-auto right-18 top-auto my-0 border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white disabled:opacity-30 sm:right-20 lg:right-22" />
          <CarouselNext size="icon" className="pointer-events-auto bottom-0 left-auto right-4 top-auto my-0 border-white/20 bg-black/30 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white disabled:opacity-30 sm:right-6 lg:right-8" />
        </div>
      </Carousel>
      <RequireAuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
      />
    </section>
  );
}
