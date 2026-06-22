import type { MovieDetail } from "@/types/movie";
import { MovieFeatureCard } from "../movies/movie-feature-card";

type SearchResultCardProps = {
  movie: MovieDetail;
};

export function SearchResultCard({ movie }: SearchResultCardProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <MovieFeatureCard movie={movie} />
    </section>
  );
}
