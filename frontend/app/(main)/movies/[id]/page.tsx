import { auth } from "@clerk/nextjs/server";
import { RequireAuthDialog } from "@/components/ui/require-auth-dialog";
import { MovieDetailHeader } from "@/components/movies/movie-detail-header";
import { MovieDetailInfor } from "@/components/movies/movie-detail-infor";
import { MovieReviewSection } from "@/components/movies/movie-review-section";
import { getMovieDetails } from "@/lib/api/movies";

type MovieDetailsProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MovieDetails({ params }: MovieDetailsProps) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RequireAuthDialog open onOpenChange={() => {}} />
      </div>
    );
  }

  const { id } = await params;
  const movieId = Number(id);
  const { detail, information } = await getMovieDetails(movieId);

  return (
    <>
      <MovieDetailHeader movieDetail={detail} />
      <MovieDetailInfor movieInformation={information} />
      <MovieReviewSection movieId={movieId} />
    </>
  );
}
