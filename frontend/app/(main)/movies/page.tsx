import { MovieHeader } from "@/components/movies/movie-header";
import { MovieLibrary } from "@/components/movies/movie-library";
import { MoviePagination } from "@/components/movies/movie-pagination";

export default function Movies() {
  return (
    <>
      <MovieHeader />
      <MovieLibrary />
      <MoviePagination />
    </>
  );
}
