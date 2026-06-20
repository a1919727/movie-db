import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Movies } from "@/types/movie";
import Image from "next/image";

type MovieCardProps = {
  movie: Movies;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Card className="group overflow-hidden border-white/10 bg-zinc-950 text-white transition hover:-translate-y-1 hover:border-white/20">
      <div className="aspect-[4/5] overflow-hidden">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 text-lg font-semibold">
              {movie.title}
            </h3>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-zinc-400">{movie.year}</p>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              {movie.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
