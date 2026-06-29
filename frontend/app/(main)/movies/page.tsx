import { MovieHeader } from "@/components/movies/movie-header";
import { MovieLibrary } from "@/components/movies/movie-library";
import { MoviePagination } from "@/components/movies/movie-pagination";
import { getMovies } from "@/lib/api/movies";

const TMDB_MAX_PAGE = 500;

type MoviesProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function Movies({ searchParams }: MoviesProps) {
  const { page } = await searchParams;
  const currentPage = Math.min(Number(page) || 1, TMDB_MAX_PAGE);
  const data = await getMovies(currentPage);

  return (
    <>
      <MovieHeader />
      <MovieLibrary movies={data.results} />
      <MoviePagination currentPage={data.page} totalPages={TMDB_MAX_PAGE} />
    </>
  );
}
