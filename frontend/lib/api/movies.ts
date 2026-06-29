import type {
  HeroMovie,
  MovieDetail,
  MovieInformation,
  UserReview,
} from "@/types/movie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

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

type TmdbMovieDetailResponse = TmdbMovie & {
  genres?: Array<{ id: number; name: string }>;
  origin_country?: string[];
  spoken_languages?: Array<{ english_name: string; name: string }>;
  runtime?: number;
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
  const response = await fetch(`${API_BASE_URL}/movies?page=${page}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
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

  const response = await fetch(
    `${API_BASE_URL}/movies/discover?${params.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to discover movies");
  }

  const data: TmdbMovieListResponse = await response.json();

  return mapMoviesResponse(data);
}

export async function getMovieDetails(
  movieId: number,
): Promise<MovieDetailPageData> {
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Failed to fetch movie details");

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
