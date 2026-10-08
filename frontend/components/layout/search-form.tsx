"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      if (pathname === "/search") {
        setIsExpanded(false);
        router.push("/search");
        return;
      }

      return;
    }

    const params = new URLSearchParams();
    params.set("query", trimmedQuery);
    setIsExpanded(false);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Popover open={isExpanded} onOpenChange={setIsExpanded}>
      <PopoverAnchor asChild>
        <div className="relative flex size-11 shrink-0 justify-end lg:h-11 lg:w-auto lg:min-w-0 lg:flex-1">
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Open movie search"
              aria-hidden={isExpanded}
              tabIndex={isExpanded ? -1 : 0}
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isExpanded ? "invisible" : ""}`}
            >
              <Search aria-hidden="true" className="size-5" />
            </button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent
        aria-label="Movie search"
        side="bottom"
        align="end"
        sideOffset={-40}
        avoidCollisions={false}
        className="h-9 w-[min(18rem,calc(100vw-11rem))] gap-0 rounded-full border border-border bg-background p-0 text-foreground shadow-xl ring-0 lg:w-[min(18rem,var(--radix-popover-trigger-width))]"
      >
        <form role="search" aria-label="Movie search" onSubmit={handleSubmit} className="relative h-full w-full">
          <button type="submit" tabIndex={-1} className="sr-only">
            Search movies
          </button>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search movies..."
            className="h-full w-full rounded-full bg-transparent pl-4 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground dark:focus-visible:ring-white [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="button" onClick={() => setIsExpanded(false)} className="absolute right-0 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring">
            <X aria-hidden="true" className="size-4" />
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
