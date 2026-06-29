import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { CiPlay1 } from "react-icons/ci";
import type { MovieDetail } from "@/types/movie";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

type MovieFeatureCardProps = {
  movie: MovieDetail;
};

export function MovieFeatureCard({ movie }: MovieFeatureCardProps) {
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
            className="rounded-4xl bg-white p-4 text-base font-semibold text-black hover:bg-zinc-200"
          >
            <Link href="#">
              <CiPlay1 />
              Watch
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-4xl p-4 text-base font-semibold hover:bg-zinc-200 hover:text-black"
          >
            <Link href="/favourites">Save to favourites</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
