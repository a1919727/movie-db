import { movieDetails } from "@/data/mock-data";
import Image from "next/image";
import type { MovieDetail } from "@/types/movie";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { CiPlay1 } from "react-icons/ci";
import { Star } from "lucide-react";

type MovieDetailProps = {
  movieDetail?: MovieDetail;
};

export function MovieDetailHeader({
  movieDetail = movieDetails[0],
}: MovieDetailProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-[240px_1fr] md:grid-cols-[1fr_2fr] lg:grid-cols-[300px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-zinc-900">
          {movieDetail.posterUrl ? (
            <Image
              src={movieDetail.posterUrl}
              alt={movieDetail.title}
              width={600}
              height={900}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="aspect-[2/3] text-sm">No poster</div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-5">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{movieDetail.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {movieDetail.geners.map((gener, index) => (
              <Badge
                variant="outline"
                key={index}
                className="px-3 py-2 text-sm"
              >
                {gener}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-3 text-base text-white">
            <span>{movieDetail.year}</span>
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              {movieDetail.rating.toFixed(1)}
            </span>
          </div>
          <p className="max-w-3xl">{movieDetail.description}</p>
          <div className="flex gap-3 ">
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
              className="rounded-4xl p-4 text-base font-semibold  hover:bg-zinc-200 hover:text-black"
            >
              <Link href="/favourites">Save to favourites</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
