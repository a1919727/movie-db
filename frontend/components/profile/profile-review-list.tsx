import type { UserReview } from "@/types/review";

type ProfileReviewListProps = {
  reviews: UserReview[];
};

export function ProfileReviewList({ reviews }: ProfileReviewListProps) {
  if (reviews.length === 0) {
    return <div className="mt-8 text-zinc-400">No reviews yet.</div>;
  }

  return (
    <div className="mt-8 space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl bg-zinc-900 p-5 text-white">
          <p className="leading-7">{review.content}</p>
        </div>
      ))}
    </div>
  );
}
