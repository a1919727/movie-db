"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      if (pathname === "/search") {
        router.push("/search");
        return;
      }

      return;
    }

    const params = new URLSearchParams();
    params.set("query", trimmedQuery);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search movies..."
        className="h-10 w-full rounded-full border bg-background pl-10 pr-10 text-sm"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
}
