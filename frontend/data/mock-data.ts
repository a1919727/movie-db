import type {
  Movies,
  MovieDetail,
  MovieInformation,
  UserReview,
} from "@/types/movie";

export const movies: Movies[] = [
  {
    id: 1,
    title: "Movie 1",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 2,
    title: "Movie 2",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 3,
    title: "Movie 3",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 4,
    title: "Movie 4",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 5,
    title: "Movie 5",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 6,
    title: "Movie 6",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 7,
    title: "Movie 7",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
  {
    id: 8,
    title: "Movie 8",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
  },
];

export const movieDetails: MovieDetail[] = [
  {
    id: 1,
    title: "Avatar",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
    description:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home. ...",
    genres: ["Drama", "Action"],
  },
  {
    id: 2,
    title: "Avatar",
    year: 2025,
    rating: 4.8,
    posterUrl: "",
    description:
      "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home. ...",
    genres: ["Drama", "Action"],
  },
];

export const movieInfor: MovieInformation[] = [
  {
    id: 1,
    country: "United States",
    releaseDate: "August 21, 2009",
    language: "English",
    director: "Ryan Condal",
    runtime: "50m",
    actors: ["Sam Worthington", "Zoe Saldaña"],
  },
  {
    id: 2,
    country: "United States",
    releaseDate: "August 21, 2009",
    language: "English",
    director: "Ryan Condal",
    runtime: "50m",
    actors: ["Sam Worthington", "Zoe Saldaña"],
  },
];

export const userReview: UserReview[] = [
  {
    id: 1,
    avatar: "",
    name: "Judy",
    createdAt: "2026-06-22T08:00:00.000Z",
    review: "I wish season three would come out sooner",
  },
  {
    id: 2,
    avatar: "",
    createdAt: "2026-06-22T07:00:00.000Z",
    name: "Lili",
    review: "I wish season three would come out sooner",
  },
];
