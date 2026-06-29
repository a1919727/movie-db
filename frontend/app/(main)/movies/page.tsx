import { MovieHeader } from "@/components/movies/movie-header";
import { MovieLibrary } from "@/components/movies/movie-library";
import { MoviePagination } from "@/components/movies/movie-pagination";
import { discoverMovies, getMovies } from "@/lib/api/movies";

const TMDB_MAX_PAGE = 500;

type MoviesProps = {
  searchParams: Promise<{
    page?: string;
    genre?: string;
    year?: string;
    rating?: string;
  }>;
};

export default async function Movies({ searchParams }: MoviesProps) {
  const { genre, page, rating, year } = await searchParams;
  const currentPage = Math.max(1, Math.min(Number(page) || 1, TMDB_MAX_PAGE));
  const hasFilters = Boolean(genre || year || rating);
  const data = hasFilters
    ? await discoverMovies({ genre, year, rating, page: currentPage })
    : await getMovies(currentPage);
  const totalPages = Math.min(data.total_pages, TMDB_MAX_PAGE);

  return (
    <>
      <MovieHeader genre={genre} rating={rating} year={year} />
      <MovieLibrary movies={data.results} />
      <MoviePagination
        currentPage={data.page}
        totalPages={totalPages}
        searchParams={{ genre, rating, year }}
      />
    </>
  );
}
