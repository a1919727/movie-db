import { movieDetails } from "@/data/mock-data";
import type { MovieDetail } from "@/types/movie";
import { MovieFeatureCard } from "./movie-feature-card";

type MovieDetailProps = {
  movieDetail?: MovieDetail;
};

export function MovieDetailHeader({
  movieDetail = movieDetails[0],
}: MovieDetailProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <MovieFeatureCard movie={movieDetail} />
    </section>
  );
}
