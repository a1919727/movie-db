import { MovieDetailHeader } from "@/components/movies/movie-detail-header";
import { MovieDetailInfor } from "@/components/movies/movie-detail-infor";
import { MovieReviews } from "@/components/movies/movie-review-form";

export default function MovieDetails() {
  return (
    <>
      <MovieDetailHeader />
      <MovieDetailInfor />
      <MovieReviews />
    </>
  );
}
