const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";

export function getTmdbPosterUrl(posterPath: string | null | undefined): string | null {
  return posterPath ? `${TMDB_POSTER_BASE_URL}${posterPath}` : null;
}

type TmdbGenre = {
  id: number;
  name: string;
};

export type TmdbMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: TmdbGenre[];
  runtime?: number;
};

type TmdbMovieList = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

type TmdbCreditMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

type TmdbCrewMember = {
  id: number;
  name: string;
  job: string;
};

type TmdbCredits = {
  cast: TmdbCreditMember[];
  crew: TmdbCrewMember[];
};

export type TmdbMovieMetadata = Omit<TmdbMovie, "genres" | "runtime"> & {
  genres: TmdbGenre[];
  runtime: number | null;
  credits: TmdbCredits;
};

type TmdbWatchProviderRegion = {
  link?: string;
};

type TmdbWatchProvidersResponse = {
  id: number;
  results?: Record<string, TmdbWatchProviderRegion>;
};

function getTmdbApiKey() {
  const tmdbApiKey = process.env.TMDB_API_KEY;

  if (!tmdbApiKey) {
    throw new Error("Missing TMDB API key");
  }

  return tmdbApiKey;
}

async function fetchTmdbData<T>(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
  signal?: AbortSignal,
) {
  const tmdbApiKey = getTmdbApiKey();

  const params = new URLSearchParams({
    api_key: tmdbApiKey,
    language: "en-US",
  });

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  let response: Response;

  try {
    response = await fetch(`${TMDB_BASE_URL}${path}?${params.toString()}`, {
      signal: signal ?? null,
    });
  } catch {
    // Avoid exposing URLs containing the API key in network error messages.
    const error = new Error(
      signal?.aborted
        ? `TMDB request aborted: ${path}`
        : `Unable to reach TMDB: ${path}`,
    );

    if (signal?.aborted) {
      error.name = "AbortError";
    }

    throw error;
  }

  if (!response.ok) {
    throw new Error(`Failed TMDB request (${path}): HTTP ${response.status}`);
  }

  try {
    return (await response.json()) as T;
  } catch {
    const error = new Error(
      signal?.aborted
        ? `TMDB request aborted: ${path}`
        : `Invalid JSON response from TMDB: ${path}`,
    );

    if (signal?.aborted) {
      error.name = "AbortError";
    }

    throw error;
  }
}

export async function getNowPlayingMovies(page = 1) {
  return fetchTmdbData<TmdbMovieList>("/movie/now_playing", { page });
}

export async function getPopularMovies(page = 1, signal?: AbortSignal) {
  return fetchTmdbData<TmdbMovieList>("/movie/popular", { page }, signal);
}

export async function searchMovies(query: string, page = 1) {
  return fetchTmdbData<TmdbMovieList>("/search/movie", { query, page });
}

export async function discoverMovies(params: {
  genre?: string | undefined;
  year?: string | undefined;
  rating?: string | undefined;
  page?: number | undefined;
}) {
  const { genre, page = 1, rating, year } = params;

  return fetchTmdbData<TmdbMovieList>("/discover/movie", {
    with_genres: genre,
    primary_release_year: year,
    "vote_average.gte": rating,
    sort_by: "popularity.desc",
    page,
  });
}

export async function getMovieMetadata(
  id: string | number,
  signal?: AbortSignal,
) {
  return fetchTmdbData<TmdbMovieMetadata>(
    `/movie/${id}`,
    { append_to_response: "credits" },
    signal,
  );
}

export async function getMovieDetails(id: string | number) {
  const [detail, watchProviders] = await Promise.all([
    getMovieMetadata(id),
    fetchTmdbData<TmdbWatchProvidersResponse>(`/movie/${id}/watch/providers`),
  ]);

  const watchUrl =
    watchProviders.results?.US?.link ??
    watchProviders.results?.AU?.link ??
    Object.values(watchProviders.results ?? {}).find((region) => region.link);

  return { ...detail, watchUrl };
}
