import { HeroSection } from "@/components/home/hero-section";
import { PopularSection } from "@/components/home/popular-section";
import { getMovies } from "@/lib/api/movies";

export default async function Home() {
  const movies = await getMovies()
    .then((data) => data.results)
    .catch((error: unknown) => {
      console.error("Failed to load home movies:", error);
      return [];
    });

  const heroMovies = movies.slice(0, 5);
  const popularMovies = movies.slice(0, 4);

  return (
    <>
      <HeroSection movies={heroMovies} />
      <PopularSection movies={popularMovies} />
    </>
  );
}
