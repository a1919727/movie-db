"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getUserByClerkId } from "@/lib/api/users";
import { saveReview } from "@/lib/api/reviews";
import { toast } from "sonner";

type MovieReviewFormProps = {
  movieId: number;
  onSaved: () => Promise<void> | void;
};

export function MovieReviewForm({ movieId, onSaved }: MovieReviewFormProps) {
  const { user, isLoaded } = useUser();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!isLoaded || !user) {
      toast.error("Please sign in before leaving a review.");
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter your review.");
      return;
    }

    setIsSubmitting(true);

    try {
      const databaseUser = await getUserByClerkId(user.id);

      if (!databaseUser) {
        toast.error("User profile has not synced yet. Please try again.");
        return;
      }

      await saveReview({
        userId: databaseUser.id,
        tmdbMovieId: movieId,
        content,
      });

      setContent("");
      await onSaved();
      toast.success("Review saved.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save review",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <div className="max-w-6xl">
        <h1 className="mb-5 text-3xl font-semibold">Reviews</h1>
        <Card className="border-white/10 bg-zinc-950 text-white px-2 py-6">
          <CardHeader>
            <CardTitle className="text-xl">Write your review</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Please enter your review..."
              className="min-h-48 border-white/10 bg-zinc-900 text-white"
              disabled={!user || isSubmitting}
            />
            <div className="mt-5 flex justify-end">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!user || isSubmitting}
                className="px-4 py-2 text-base font-semibold"
              >
                {isSubmitting ? "Saving..." : "Submit review"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
