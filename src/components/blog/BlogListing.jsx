"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { buildBlogPostFromListItem } from "@/lib/blogs/buildBlogPost";
import { fetchBlogsPage } from "@/services/blogApiService";
import { getApiErrorMessage } from "@/lib/api/errors";
import BlogCard from "./BlogCard";
import BlogPagination from "./BlogPagination";

function SubmitSpinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function BlogListing({ categories, initialPosts, initialMeta }) {
  const [active, setActive] = useState("all");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(initialPosts ?? []);
  const [meta, setMeta] = useState(initialMeta ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const reduceMotion = useReducedMotion();

  const loadPage = useCallback(
    async (nextCategory, nextPage) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBlogsPage({
          page: nextPage,
          category: nextCategory === "all" ? "" : nextCategory,
        });
        const mapped = result.blogs.map((item, index) =>
          buildBlogPostFromListItem(item, {
            categorySlug: nextCategory,
            categoryLabel:
              nextCategory === "all"
                ? "Article"
                : categories.find((c) => c.slug === nextCategory)?.label ?? "Article",
            featured: nextCategory === "all" && nextPage === 1 && index === 0,
          })
        );
        setPosts(mapped);
        setMeta(result.meta);
      } catch (err) {
        setError(getApiErrorMessage(err, "Could not load articles."));
      } finally {
        setLoading(false);
      }
    },
    [categories]
  );

  function handleCategoryChange(catId) {
    if (catId === active) return;
    setActive(catId);
    setPage(1);
    loadPage(catId, 1);
  }

  function handlePageChange(nextPage) {
    if (nextPage === page || nextPage < 1) return;
    const last = meta?.last_page ?? 1;
    if (nextPage > last) return;
    setPage(nextPage);
    loadPage(active, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const featured = active === "all" && page === 1 ? posts.find((p) => p.featured) : null;
  const gridPosts = featured ? posts.filter((p) => p.slug !== featured.slug) : posts;

  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;

  return (
    <section
      className="py-10 sm:py-16 lg:py-20 bg-white overflow-x-clip relative z-[1]"
      aria-labelledby="blog-list-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <SectionHeader
          id="blog-list-heading"
          eyebrow="Latest articles"
          title="Guides, safety tips & industry news"
          description="Stay informed on electrical compliance, domestic upgrades, and commercial testing across Nottinghamshire."
          align="center"
        />

        <div
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10"
          role="tablist"
          aria-label="Filter articles by category"
        >
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={loading}
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-colors disabled:opacity-60 ${
                  isActive
                    ? "text-white"
                    : "text-[var(--home1-muted)] hover:text-[var(--home1-text)] bg-[var(--home1-surface)]"
                }`}
              >
                {isActive && !reduceMotion && (
                  <motion.span
                    layoutId="blog-tab-pill"
                    className="absolute inset-0 rounded-xl bg-[var(--home1-red)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                {isActive && reduceMotion && (
                  <span className="absolute inset-0 rounded-xl bg-[var(--home1-red)]" aria-hidden="true" />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {error ? (
          <ServicesLoadError message={error} onRetry={() => loadPage(active, page)} />
        ) : null}

        {loading ? (
          <div className="flex justify-center py-16 text-[var(--home1-muted)]" aria-live="polite">
            <SubmitSpinner />
            <span className="ml-2 text-sm font-semibold">Loading articles…</span>
          </div>
        ) : null}

        {!loading && !error && featured ? (
          <div className="mb-6 sm:mb-8">
            <BlogCard post={featured} featured />
          </div>
        ) : null}

        {!loading && !error && posts.length > 0 && gridPosts.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-16">No articles in this category yet.</p>
        ) : null}

        {!error && gridPosts.length > 0 ? (
          <div
            className={`relative transition-opacity duration-200${loading ? " opacity-50 pointer-events-none" : ""}`}
            aria-busy={loading}
          >
            {loading ? (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center"
                aria-live="polite"
              >
                <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-md border border-[#e8eaed]">
                  <SubmitSpinner />
                  <span className="text-sm font-semibold text-[var(--home1-muted)]">Loading…</span>
                </div>
              </div>
            ) : null}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0">
              {gridPosts.map((post) => (
                <li key={post.slug} className="min-w-0">
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!error ? (
          <BlogPagination
            currentPage={currentPage}
            lastPage={lastPage}
            loading={loading}
            onPageChange={handlePageChange}
          />
        ) : null}

        {!error && meta?.total ? (
          <p className="text-center text-xs font-medium text-[var(--home1-muted)] mt-4">
            Showing page {currentPage} of {lastPage} · {meta.total} articles
          </p>
        ) : null}
      </div>
    </section>
  );
}
