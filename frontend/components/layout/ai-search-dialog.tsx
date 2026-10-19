"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  AI_SEARCH_MAX_LENGTH,
  AI_SEARCH_QUERY_ERROR,
  aiSearchQuerySchema,
} from "@/lib/schemas/ai-search.schema";

type AiSearchDialogProps = {
  initialQuery?: string;
  trigger?: ReactNode;
};

export function AiSearchDialog({ initialQuery = "", trigger }: AiSearchDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState(initialQuery);
  const [error, setError] = useState("");
  const inputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canSubmit = aiSearchQuerySchema.safeParse(description).success;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedQuery = aiSearchQuerySchema.safeParse(description);

    if (!parsedQuery.success) {
      setError(AI_SEARCH_QUERY_ERROR);
      textareaRef.current?.focus();
      return;
    }

    setError("");
    setOpen(false);
    const params = new URLSearchParams({ mode: "ai", query: parsedQuery.data });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            aria-label="Gemini AI movie search"
            title="AI movie search"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:size-11"
          >
            <Bot aria-hidden="true" className="size-5" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        overlayClassName="bg-black/40 backdrop-blur-md"
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl gap-0 overflow-y-auto rounded-2xl p-0 shadow-2xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          textareaRef.current?.focus();
        }}
      >
        <div className="flex min-h-16 items-center gap-2.5 border-b border-border px-5 pr-14 sm:px-7 sm:pr-14">
          <Bot aria-hidden="true" className="size-5 text-muted-foreground" />
          <DialogTitle className="text-sm font-medium tracking-wide">AI movie search</DialogTitle>
        </div>

        <form aria-label="AI movie search" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 p-5 sm:p-7">
            <DialogDescription className="text-sm">
              Describe a movie, mood, or story.
            </DialogDescription>

            <div className="overflow-hidden rounded-xl border border-input bg-muted/20 transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20">
              <label htmlFor={inputId} className="sr-only">
                Your movie idea
              </label>
              <Textarea
                ref={textareaRef}
                id={inputId}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && !event.nativeEvent.isComposing) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                maxLength={AI_SEARCH_MAX_LENGTH}
                rows={4}
                placeholder="e.g. A sci-fi movie about time travel and family..."
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className="h-36 min-h-36 resize-none rounded-none border-0 bg-transparent p-4 text-base leading-relaxed shadow-none focus-visible:ring-0 md:text-base dark:bg-transparent"
              />
              <div className="flex min-h-10 items-center justify-end gap-2 px-4 pb-3 text-xs text-muted-foreground">
                <div className="flex shrink-0 items-center gap-1">
                  {description && (
                    <button
                      type="button"
                      aria-label="Clear movie idea"
                      className="inline-flex size-7 items-center justify-center rounded-full transition hover:bg-foreground/10 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      onClick={() => {
                        setDescription("");
                        setError("");
                        textareaRef.current?.focus();
                      }}
                    >
                    </button>
                  )}
                  <span className="tabular-nums" aria-label={`${description.length} of ${AI_SEARCH_MAX_LENGTH} characters`}>
                    {description.length}/{AI_SEARCH_MAX_LENGTH}
                  </span>
                </div>
              </div>
            </div>
            {error && <p id={`${inputId}-error`} role="alert" className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-4 sm:px-7">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="h-10 rounded-full px-4">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!canSubmit} className="h-10 rounded-full px-4">
              Find movies
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
