"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import ListSearchBar from "@/components/common/ListSearchBar";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { buildBlogPostFromListItem } from "@/lib/blogs/buildBlogPost";
import { matchesListSearch, normalizeSearchQuery } from "@/lib/listSearch";
import { fetchAllBlogs, fetchBlogsPage } from "@/services/blogApiService";
import { getApiErrorMessage } from "@/lib/api/errors";
import BlogCard from "./BlogCard";
import CategoryTabsSlider from "@/components/common/CategoryTabsSlider";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPool, setSearchPool] = useState(/** @type {typeof posts | null} */ (null));
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchRetryKey, setSearchRetryKey] = useState(0);

  const categoryLabelFor = useCallback(
    (categorySlug) =>
      categorySlug === "all"
        ? "Article"
        : categories.find((category) => category.id === categorySlug)?.label ?? "Article",
    [categories]
  );

  const mapBlogItems = useCallback(
    (items, categorySlug, includeFeatured = false) =>
      items.map((item, index) =>
        buildBlogPostFromListItem(item, {
          categorySlug,
          categoryLabel: categoryLabelFor(categorySlug),
          featured: includeFeatured && categorySlug === "all" && index === 0,
        })
      ),
    [categoryLabelFor]
  );

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
            categoryLabel: categoryLabelFor(nextCategory),
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
    [categoryLabelFor]
  );

  const searchActive = Boolean(normalizeSearchQuery(searchQuery));

  if (!searchActive && (searchPool !== null || searchError !== null || searchLoading)) {
    setSearchPool(null);
    setSearchError(null);
    setSearchLoading(false);
  }

  useEffect(() => {
    if (!normalizeSearchQuery(searchQuery)) return;

    let cancelled = false;
    const startId = window.setTimeout(() => {
      if (cancelled) return;
      setSearchLoading(true);
      setSearchError(null);

      fetchAllBlogs({ category: active === "all" ? "" : active })
        .then((result) => {
          if (cancelled) return;
          setSearchPool(mapBlogItems(result.blogs, active));
        })
        .catch((err) => {
          if (cancelled) return;
          setSearchPool([]);
          setSearchError(getApiErrorMessage(err, "Could not search articles."));
        })
        .finally(() => {
          if (!cancelled) setSearchLoading(false);
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(startId);
    };
  }, [active, mapBlogItems, searchQuery, searchRetryKey]);

  const filteredSearchPosts = useMemo(() => {
    if (!searchActive || !searchPool) return [];
    return searchPool.filter((post) => matchesListSearch(searchQuery, post.title, post.excerpt));
  }, [searchActive, searchPool, searchQuery]);

  function handleCategoryChange(catId) {
    if (catId === active) return;
    setActive(catId);
    setPage(1);
    setSearchQuery("");
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

  const featured = !searchActive && active === "all" && page === 1 ? posts.find((p) => p.featured) : null;
  const gridPosts = searchActive
    ? filteredSearchPosts
    : featured
      ? posts.filter((p) => p.slug !== featured.slug)
      : posts;

  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;
  const listLoading = loading || (searchActive && searchLoading);

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

        <ListSearchBar
          id="blog-list-search"
          label="Search articles"
          placeholder="Search articles by title or description…"
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {searchActive && !searchLoading ? (
          <p className="home1-list-search-results" aria-live="polite">
            {filteredSearchPosts.length} result{filteredSearchPosts.length === 1 ? "" : "s"} for &ldquo;
            {searchQuery.trim()}&rdquo;
          </p>
        ) : null}

        <CategoryTabsSlider
          categories={categories}
          active={active}
          disabled={loading || searchLoading}
          onChange={handleCategoryChange}
          layoutId="blog-tab-pill"
          ariaLabel="Filter articles by category"
        />

        {error ? (
          <ServicesLoadError message={error} onRetry={() => loadPage(active, page)} />
        ) : null}

        {searchError ? (
          <ServicesLoadError
            message={searchError}
            onRetry={() => {
              setSearchError(null);
              setSearchPool(null);
              setSearchRetryKey((key) => key + 1);
            }}
          />
        ) : null}

        {listLoading ? (
          <div className="flex justify-center py-16 text-[var(--home1-muted)]" aria-live="polite">
            <SubmitSpinner />
            <span className="ml-2 text-sm font-semibold">
              {searchActive ? "Searching articles…" : "Loading articles…"}
            </span>
          </div>
        ) : null}

        {!listLoading && !error && !searchError && featured ? (
          <div className="mb-6 sm:mb-8">
            <BlogCard post={featured} featured />
          </div>
        ) : null}

        {!listLoading && !error && !searchError && posts.length > 0 && gridPosts.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-16">
            {searchActive
              ? `No articles found for "${searchQuery.trim()}". Try another search term.`
              : "No articles in this category yet."}
          </p>
        ) : null}

        {!error && !searchError && gridPosts.length > 0 ? (
          <div
            className={`relative transition-opacity duration-200${listLoading ? " opacity-50 pointer-events-none" : ""}`}
            aria-busy={listLoading}
          >
            {listLoading ? (
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

        {!searchActive && !error ? (
          <BlogPagination
            currentPage={currentPage}
            lastPage={lastPage}
            loading={loading}
            onPageChange={handlePageChange}
            className="mt-10 sm:mt-12"
          />
        ) : null}

        {!searchActive && !error && meta?.total ? (
          <p className="text-center text-xs font-medium text-[var(--home1-muted)] mt-4">
            Showing page {currentPage} of {lastPage} · {meta.total} articles
          </p>
        ) : null}
      </div>
    </section>
  );
}
