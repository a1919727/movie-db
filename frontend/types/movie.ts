export type HeroMovie = {
  id: number;
  title: string;
  year: number;
  rating: number;
  description: string;
  posterUrl: string;
};

export type Movies = {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterUrl: string;
};

export type MovieDetail = {
  id: number;
  title: string;
  year: number;
  rating: number;
  posterUrl: string;
  description: string;
  geners: string[];
};

export type MovieInformation = {
  id: number;
  country: string;
  releaseDate: string;
  language: string;
  director: string;
  runtime: string;
  actors: string[];
};
