import { MovieDetailHeader } from "@/components/movies/movie-detail-header";
import { MovieDetailInfor } from "@/components/movies/movie-detail-infor";
import { MovieReviewForm } from "@/components/movies/movie-review-form";
import { MovieReviews } from "@/components/movies/movie-reviews";

export default function MovieDetails() {
  return (
    <>
      <MovieDetailHeader />
      <MovieDetailInfor />
      <MovieReviewForm />
      <MovieReviews />
    </>
  );
}
