import { HeroSection } from "@/components/home/hero-section";
import { PopularSection } from "@/components/home/popular-section";
import { getMovies } from "@/lib/api/movies";

export default async function Home() {
  const data = await getMovies();
  const heroMovies = data.results.slice(0, 5);
  const popularMovies = data.results.slice(0, 4);

  return (
    <>
      <HeroSection movies={heroMovies} />
      <PopularSection movies={popularMovies} />
    </>
  );
}
