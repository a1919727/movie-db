import { LoaderCircle } from "lucide-react";

export function LoadingMatches() {
  return (
    <div className="space-y-5">
      <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        Finding movies for your description…
      </p>
      <div aria-hidden="true" className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid grid-cols-[6rem_minmax(0,1fr)] items-start gap-3 rounded-2xl border border-border p-4 motion-safe:animate-pulse sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="aspect-[2/3] rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-6 w-2/3 rounded bg-muted" />
              <div className="h-4 w-1/3 rounded bg-muted" />
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-full rounded bg-muted" />
                <div className="h-3 w-3/4 rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
