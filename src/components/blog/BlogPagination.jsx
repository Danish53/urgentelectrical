"use client";

import Link from "next/link";

function buildPageNumbers(current, last) {
  if (last <= 7) {
    return Array.from({ length: last }, (_, i) => i + 1);
  }

  const pages = new Set([1, last, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);

  /** @type {(number | "ellipsis")[]} */
  const result = [];
  let prev = 0;

  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }

  return result;
}

function PaginationControl({
  href,
  disabled,
  onClick,
  className,
  ariaLabel,
  ariaCurrent,
  children,
}) {
  if (href && !disabled) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel} aria-current={ariaCurrent}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </button>
  );
}

export default function BlogPagination({
  currentPage,
  lastPage,
  loading,
  onPageChange,
  hrefForPage,
  ariaLabel = "Pagination",
  className = "",
}) {
  if (lastPage <= 1) return null;

  const pages = buildPageNumbers(currentPage, lastPage);

  return (
    <nav
      className={`flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 ${className}`.trim()}
      aria-label={ariaLabel}
    >
      <PaginationControl
        href={hrefForPage?.(currentPage - 1)}
        disabled={currentPage <= 1 || loading}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="home1-blog-pagination-btn home1-blog-pagination-btn--nav"
        ariaLabel="Previous page"
      >
        ← Prev
      </PaginationControl>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="home1-blog-pagination-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <PaginationControl
              key={item}
              href={hrefForPage?.(item)}
              disabled={loading}
              onClick={() => onPageChange?.(item)}
              ariaLabel={`Page ${item}`}
              ariaCurrent={item === currentPage ? "page" : undefined}
              className={`home1-blog-pagination-btn home1-blog-pagination-btn--num${
                item === currentPage ? " is-active" : ""
              }`}
            >
              {item}
            </PaginationControl>
          )
        )}
      </div>

      <PaginationControl
        href={hrefForPage?.(currentPage + 1)}
        disabled={currentPage >= lastPage || loading}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="home1-blog-pagination-btn home1-blog-pagination-btn--nav"
        ariaLabel="Next page"
      >
        Next →
      </PaginationControl>
    </nav>
  );
}
