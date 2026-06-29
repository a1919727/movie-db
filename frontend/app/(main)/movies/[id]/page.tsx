import { MovieDetailHeader } from "@/components/movies/movie-detail-header";
import { MovieDetailInfor } from "@/components/movies/movie-detail-infor";
import { MovieReviewForm } from "@/components/movies/movie-review-form";
import { MovieReviews } from "@/components/movies/movie-reviews";
import { getMovieDetails } from "@/lib/api/movies";

type MovieDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { id } = await params;
  const movieId = Number(id);

  const { detail, information } = await getMovieDetails(movieId);

  return (
    <>
      <MovieDetailHeader movieDetail={detail} />
      <MovieDetailInfor movieInformation={information} />
      {/* <MovieReviewForm />
      <MovieReviews /> */}
    </>
  );
}
