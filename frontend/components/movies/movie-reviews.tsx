import { Card, CardContent, CardHeader } from "../ui/card";
import { userReview } from "@/data/mock-data";
import { CiFlag1 } from "react-icons/ci";
import Image from "next/image";
import { Button } from "../ui/button";

function formatReviewTime(createdAt: string) {
  const createdAtDate = new Date(createdAt);
  const hoursAgo = Math.max(
    1,
    Math.floor((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60)),
  );

  return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
}

export function MovieReviews() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="max-w-6xl flex flex-col gap-6">
        {userReview.map((review) => (
          <Card
            key={review.id}
            className="border-white/10 bg-zinc-950 px-4 py-8 text-white gap-6"
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  {review.avatar ? (
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-3xl bg-zinc-500 flex items-center justify-center">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-lg font-medium">{review.name}</span>
                </div>
                <span className="text-lg font-medium">
                  {formatReviewTime(review.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex justify-between">
              <p className="text-base font-medium">{review.review}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="flag"
                className="hover:bg-transparent hover:text-white"
              >
                <CiFlag1 />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
