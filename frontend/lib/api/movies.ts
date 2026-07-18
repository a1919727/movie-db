import type {
  HeroMovie,
  MovieDetail,
  MovieInformation,
  UserReview,
} from "@/types/movie";
import { fetchFromApi, getErrorMessage } from "./client";

type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
};

type TmdbMovieListResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

type DiscoverMoviesParams = {
  genre?: string;
  year?: string;
  rating?: string;
  page?: number;
};

type SearchMoviesParams = {
  query: string;
  page?: number;
};

type TmdbMovieDetailResponse = TmdbMovie & {
  genres?: Array<{ id: number; name: string }>;
  origin_country?: string[];
  spoken_languages?: Array<{ english_name: string; name: string }>;
  runtime?: number;
  watchUrl?: string;
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      order: number;
    }>;
    crew: Array<{
      id: number;
      name: string;
      job: string;
    }>;
  };
};

export type MoviesResponse = {
  page: number;
  results: HeroMovie[];
  total_pages: number;
  total_results: number;
};

export type SearchMoviesResponse = {
  page: number;
  results: MovieDetail[];
  total_pages: number;
  total_results: number;
};

export type MovieDetailPageData = {
  detail: MovieDetail;
  information: MovieInformation;
};

const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

function mapTmdbMovie(movie: TmdbMovie): HeroMovie {
  return {
    id: movie.id,
    title: movie.title,
    year: Number(movie.release_date.slice(0, 4)),
    rating: movie.vote_average,
    posterUrl: movie.poster_path
      ? `${TMDB_POSTER_BASE_URL}${movie.poster_path}`
      : "",
    backdropUrl: movie.backdrop_path
      ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}`
      : "",
    description: movie.overview,
  };
}

function mapMoviesResponse(data: TmdbMovieListResponse): MoviesResponse {
  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map(mapTmdbMovie),
  };
}

export async function getMovies(page = 1): Promise<MoviesResponse> {
  const response = await fetchFromApi(`/movies?page=${page}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to fetch movies"));
  }

  const data: TmdbMovieListResponse = await response.json();

  return mapMoviesResponse(data);
}

export async function discoverMovies({
  genre,
  year,
  rating,
  page = 1,
}: DiscoverMoviesParams): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    page: String(page),
  });

  if (genre) params.set("genre", genre);
  if (year) params.set("year", year);
  if (rating) params.set("rating", rating);

  const response = await fetchFromApi(
    `/movies/discover?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to discover movies"),
    );
  }

  const data: TmdbMovieListResponse = await response.json();

  return mapMoviesResponse(data);
}

export async function searchMovies({
  query,
  page = 1,
}: SearchMoviesParams): Promise<SearchMoviesResponse> {
  const params = new URLSearchParams({
    query,
    page: String(page),
  });

  const response = await fetchFromApi(`/movies/search?${params.toString()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, "Failed to search movies"));
  }

  const data: TmdbMovieListResponse = await response.json();

  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: Number(movie.release_date?.slice(0, 4)) || 0,
      rating: movie.vote_average,
      posterUrl: movie.poster_path
        ? `${TMDB_POSTER_BASE_URL}${movie.poster_path}`
        : "",
      description: movie.overview,
      genres: [],
    })),
  };
}

export async function getMovieDetails(
  movieId: number,
): Promise<MovieDetailPageData> {
  const response = await fetchFromApi(`/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Failed to fetch movie details"),
    );
  }

  const data: TmdbMovieDetailResponse = await response.json();
  const director =
    data.credits?.crew.find((member) => member.job === "Director")?.name ??
    "Unkonwn";
  const actors =
    data.credits?.cast
      .sort((a, b) => a.order - b.order)
      .slice(0, 3)
      .map((actor) => actor.name) ?? [];
  return {
    detail: {
      id: data.id,
      title: data.title,
      year: Number(data.release_date?.slice(0, 4)) || 0,
      rating: data.vote_average,
      posterUrl: data.poster_path
        ? `${TMDB_POSTER_BASE_URL}${data.poster_path}`
        : "",
      description: data.overview,
      genres: data.genres?.map((genre) => genre.name) ?? [],
      watchUrl: data.watchUrl,
    },
    information: {
      id: data.id,
      country: data.origin_country?.join(", ") || "Unknown",
      releaseDate: data.release_date || "Unknown",
      language:
        data.spoken_languages
          ?.map((language) => language.english_name)
          .join(", ") || "Unknown",
      director,
      runtime: data.runtime ? `${data.runtime} min` : "Unknown",
      actors,
    },
  };
}
