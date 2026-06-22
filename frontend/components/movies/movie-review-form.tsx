import { FaRegThumbsUp, FaRegThumbsDown } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";

export function MovieReviews() {
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
              placeholder="Please enter your review..."
              className="min-h-48 border-white/10 bg-zinc-900 text-white"
            />
            <div className="mt-5 flex justify-between flex-1">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Thumbup"
                  className="border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <FaRegThumbsUp size="lg" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Thumbdown"
                  className="border-white/10 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <FaRegThumbsDown size="lg" />
                </Button>
              </div>
              <Button className="px-4 py-2 text-base font-semibold">
                Submit review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
