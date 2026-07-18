import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type MoviePaginationProps = {
  currentPage: number;
  totalPages: number;
  searchParams?: {
    genre?: string;
    query?: string;
    rating?: string;
    year?: string;
  };
};

const PAGE_WINDOW = 2;

export function MoviePagination({
  currentPage,
  totalPages,
  searchParams,
}: MoviePaginationProps) {
  if (totalPages <= 1) return null;

  const start = Math.max(1, currentPage - PAGE_WINDOW);
  const end = Math.min(totalPages, currentPage + PAGE_WINDOW);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  const buildPageHref = (page: number) => {
    const params = new URLSearchParams();

    if (searchParams?.genre) params.set("genre", searchParams.genre);
    if (searchParams?.query) params.set("query", searchParams.query);
    if (searchParams?.year) params.set("year", searchParams.year);
    if (searchParams?.rating) params.set("rating", searchParams.rating);
    params.set("page", String(page));

    return `?${params.toString()}`;
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:py-8">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? buildPageHref(currentPage - 1) : "#"}
              aria-disabled={currentPage <= 1}
              className="hover:bg-foreground/10"
            />
          </PaginationItem>

          {start > 1 && (
            <PaginationItem>
              <PaginationLink
                href={buildPageHref(1)}
                className="hover:bg-foreground/10"
              >
                1
              </PaginationLink>
            </PaginationItem>
          )}
          {start > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href={buildPageHref(page)}
                isActive={page === currentPage}
                className="hover:bg-foreground/10"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {end < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {end < totalPages && (
            <PaginationItem>
              <PaginationLink
                href={buildPageHref(totalPages)}
                className="hover:bg-foreground/10"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? buildPageHref(currentPage + 1)
                  : "#"
              }
              aria-disabled={currentPage >= totalPages}
              className="hover:bg-foreground/10"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
