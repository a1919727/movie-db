import { MoviePagination } from "@/components/movies/movie-pagination";
import { SearchResult } from "@/components/search/search-result";
import { searchMovies } from "@/lib/api/movies";

const TMDB_MAX_PAGE = 500;

type SearchPageProps = {
  searchParams: Promise<{
    page?: string;
    query?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { page, query } = await searchParams;
  const trimmedQuery = query?.trim();
  const currentPage = Math.max(1, Math.min(Number(page) || 1, TMDB_MAX_PAGE));
  const data = trimmedQuery
    ? await searchMovies({ query: trimmedQuery, page: currentPage })
    : null;
  const totalPages = data ? Math.min(data.total_pages, TMDB_MAX_PAGE) : 0;

  return (
    <>
      <SearchResult
        movies={data?.results ?? []}
        query={trimmedQuery}
        totalResults={data?.total_results ?? 0}
      />
      {data ? (
        <MoviePagination
          currentPage={data.page}
          totalPages={totalPages}
          searchParams={{ query: trimmedQuery }}
        />
      ) : null}
    </>
  );
}
