import Link from "next/link";
import type { Movies } from "@/types/movie";
import { MovieCard } from "../movies/movie-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

type ProfileMovieCarouselProps = {
  href: string;
  movies: Movies[];
};

export function ProfileMovieCarousel({
  href,
  movies,
}: ProfileMovieCarouselProps) {
  return (
    <div className="mt-8">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
        className="px-10"
      >
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="basis-full sm:basis-1/2 lg:basis-1/4"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white" />
        <CarouselNext className="right-0 border-white/10 bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white" />
      </Carousel>
      <div className="mt-5 flex justify-end">
        <Link href={href}>View All</Link>
      </div>
    </div>
  );
}
