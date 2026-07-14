import { HeroSection } from "@/components/home/hero-section";
import { PopularSection } from "@/components/home/popular-section";
import { getMovies } from "@/lib/api/movies";

export default async function Home() {
  const movies = await getMovies();

  const heroMovies = movies.results.slice(0, 5);
  const popularMovies = movies.results.slice(0, 4);

  return (
    <>
      <HeroSection movies={heroMovies} />
      <PopularSection movies={popularMovies} />
    </>
  );
}
