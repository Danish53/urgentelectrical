"use client";

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

export default function BlogPagination({ currentPage, lastPage, loading, onPageChange }) {
  if (lastPage <= 1) return null;

  const pages = buildPageNumbers(currentPage, lastPage);

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-10 sm:mt-12"
      aria-label="Blog pagination"
    >
      <button
        type="button"
        disabled={currentPage <= 1 || loading}
        onClick={() => onPageChange(currentPage - 1)}
        className="home1-blog-pagination-btn home1-blog-pagination-btn--nav"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="home1-blog-pagination-ellipsis" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={loading}
              onClick={() => onPageChange(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              className={`home1-blog-pagination-btn home1-blog-pagination-btn--num${
                item === currentPage ? " is-active" : ""
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        disabled={currentPage >= lastPage || loading}
        onClick={() => onPageChange(currentPage + 1)}
        className="home1-blog-pagination-btn home1-blog-pagination-btn--nav"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
