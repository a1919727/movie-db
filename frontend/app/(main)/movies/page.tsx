import { MovieHeader } from "@/components/movies/movie-header";
import { MovieLibrary } from "@/components/movies/movie-library";
import { MoviePagination } from "@/components/movies/movie-pagination";
import { getMovies } from "@/lib/api/movies";

export default async function Movies() {
  const data = await getMovies();

  return (
    <>
      <MovieHeader />
      <MovieLibrary movies={data.results} />
      <MoviePagination />
    </>
  );
}
