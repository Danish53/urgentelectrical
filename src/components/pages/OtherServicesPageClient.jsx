"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CTAHome1 from "@/components/home1/CTAHome1";
import ListSearchBar from "@/components/common/ListSearchBar";
import AppImage from "@/components/common/AppImage";
import BlogPagination from "@/components/blog/BlogPagination";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { matchesListSearch, normalizeSearchQuery } from "@/lib/listSearch";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  fetchAllOtherServices,
  fetchOtherServicesPage,
  getPageImageUrl,
} from "@/services/pagesApiService";

/**
 * @param {{
 *   page: import("@/services/pagesApiService").ApiInfoPage & { short_description?: string, full_title?: string },
 * }} props
 */
function OtherServiceCard({ page }) {
  const imageUrl = getPageImageUrl(page);
  const description =
    page.short_description ||
    page.description ||
    "Learn more about this service and how our electricians can help.";

  return (
    <article className="home1-other-service-card">
      <div className="home1-other-service-card-media relative">
        {imageUrl ? (
          <AppImage
            src={imageUrl}
            alt={page.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="home1-other-service-card-body">
        <h2 className="home1-other-service-card-title">{page.title}</h2>
        <p className="home1-other-service-card-desc">{description}</p>
        <Link href={`/pages/${page.slug}`} className="home1-other-service-card-cta">
          View details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

function ListSpinner() {
  return (
    <svg
      className="h-5 w-5 shrink-0 animate-spin text-[#d3231f]"
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

/**
 * @param {{
 *   initialPages: (import("@/services/pagesApiService").ApiInfoPage & { short_description?: string })[],
 *   initialMeta: import("@/services/pagesApiService").OtherServicesPaginationMeta | null,
 *   loadError?: string,
 * }} props
 */
export default function OtherServicesPageClient({
  initialPages,
  initialMeta,
  loadError: initialLoadError = "",
}) {
  const [pages, setPages] = useState(initialPages ?? []);
  const [meta, setMeta] = useState(initialMeta ?? null);
  const [page, setPage] = useState(initialMeta?.current_page ?? 1);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(initialLoadError);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPool, setSearchPool] = useState(/** @type {typeof pages | null} */ (null));
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchRetryKey, setSearchRetryKey] = useState(0);

  const loadPage = useCallback(async (nextPage) => {
    setLoading(true);
    setLoadError("");
    try {
      const result = await fetchOtherServicesPage(nextPage);
      setPages(result.pages);
      setMeta(result.meta);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Could not load other services."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!normalizeSearchQuery(searchQuery)) {
      setSearchPool(null);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    setSearchLoading(true);
    setSearchError(null);

    fetchAllOtherServices()
      .then((result) => {
        if (cancelled) return;
        setSearchPool(result.pages);
      })
      .catch((err) => {
        if (cancelled) return;
        setSearchPool([]);
        setSearchError(getApiErrorMessage(err, "Could not search services."));
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchQuery, searchRetryKey]);

  const searchActive = Boolean(normalizeSearchQuery(searchQuery));

  const filteredPages = useMemo(() => {
    if (!searchActive || !searchPool) return [];
    return searchPool.filter((item) =>
      matchesListSearch(
        searchQuery,
        item.title,
        item.full_title || item.short_description || item.description
      )
    );
  }, [searchActive, searchPool, searchQuery]);

  const visiblePages = searchActive ? filteredPages : pages;
  const lastPage = meta?.last_page ?? 1;
  const currentPage = meta?.current_page ?? page;
  const listLoading = loading || (searchActive && searchLoading);

  function handlePageChange(nextPage) {
    if (nextPage === page || nextPage < 1 || nextPage > lastPage) return;
    setPage(nextPage);
    loadPage(nextPage);
    document.getElementById("other-services-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <section
          className="home1-other-services-hero"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${SERVICES_PAGE_CONTAINER} relative z-10`}>
            <div className="mx-auto max-w-3xl text-center mt-5">
              <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                Informative guides
              </p>
              <h1 className="text-white text-[28px] sm:text-[40px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight">
                Our services
              </h1>
              <p className="mt-4 text-white/80 text-[15px] sm:text-[16px] leading-relaxed">
                Explore specialist electrical services — clear guides without pricing. Book fixed-price work
                separately on our main services page.
              </p>
            </div>
          </div>
        </section>

        <section id="other-services-list" className="py-10 sm:py-14 lg:py-16 bg-[#f8fafc]">
          <div className={SERVICES_PAGE_CONTAINER}>
            <ListSearchBar
              id="other-services-list-search"
              label="Search other services"
              placeholder="Search guides by title or description…"
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {searchActive ? (
              <p className="home1-list-search-results" aria-live="polite">
                {searchLoading
                  ? "Searching services…"
                  : `${filteredPages.length} result${filteredPages.length === 1 ? "" : "s"} for “${searchQuery.trim()}”`}
              </p>
            ) : null}

            {/* {!searchActive && meta?.total ? (
              <p className="home1-list-search-results" aria-live="polite">
                Showing {meta.from}–{meta.to} of {meta.total} services
              </p>
            ) : null} */}

            {loadError ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-5 text-[#9f1239]">
                <h2 className="text-[16px] font-extrabold">Could not load services</h2>
                <p className="mt-1 text-[14px]">{loadError}</p>
              </div>
            ) : null}

            {searchError ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-5 text-[#9f1239] mb-6">
                <h2 className="text-[16px] font-extrabold">Search unavailable</h2>
                <p className="mt-1 text-[14px]">{searchError}</p>
                <button
                  type="button"
                  onClick={() => setSearchRetryKey((key) => key + 1)}
                  className="mt-3 text-[13px] font-bold underline"
                >
                  Try again
                </button>
              </div>
            ) : null}

            {!loadError && !searchActive && pages.length === 0 && !loading ? (
              <p className="text-center text-[var(--home1-muted)] py-12">No services available right now.</p>
            ) : null}

            {!loadError && searchActive && !searchLoading && filteredPages.length === 0 ? (
              <p className="text-center text-[var(--home1-muted)] py-12">
                No services found for &ldquo;{searchQuery.trim()}&rdquo;. Try another search term.
              </p>
            ) : null}

            {listLoading ? (
              <div className="flex justify-center py-16" role="status" aria-live="polite">
                <ListSpinner />
                <span className="sr-only">Loading services…</span>
              </div>
            ) : null}

            {!listLoading && !loadError && visiblePages.length > 0 ? (
              <>
                <ul className="home1-other-services-grid p-0 m-0">
                  {visiblePages.map((item) => (
                    <li key={item.slug}>
                      <OtherServiceCard page={item} />
                    </li>
                  ))}
                </ul>

                {!searchActive ? (
                  <div className="mt-8 sm:mt-10">
                    <BlogPagination
                      currentPage={currentPage}
                      lastPage={lastPage}
                      loading={loading}
                      onPageChange={handlePageChange}
                      ariaLabel="Other services pagination"
                    />
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
