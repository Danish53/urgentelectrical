"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CTAHome1 from "@/components/home1/CTAHome1";
import ListSearchBar from "@/components/common/ListSearchBar";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { matchesListSearch, normalizeSearchQuery } from "@/lib/listSearch";
import { getPageImageUrl } from "@/services/pagesApiService";

/**
 * @param {{
 *   page: import("@/services/pagesApiService").ApiInfoPage & { short_description?: string },
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
      <div className="home1-other-service-card-media">
        {imageUrl ? (
          <img src={imageUrl} alt={page.title} width={640} height={360} loading="lazy" />
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

/**
 * @param {{
 *   pages: (import("@/services/pagesApiService").ApiInfoPage & { short_description?: string })[],
 *   loadError?: string,
 * }} props
 */
const INITIAL_VISIBLE = 4;

export default function OtherServicesPageClient({ pages, loadError = "" }) {
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPages = useMemo(() => {
    if (!normalizeSearchQuery(searchQuery)) return pages;

    return pages.filter((page) =>
      matchesListSearch(
        searchQuery,
        page.title,
        page.short_description || page.description
      )
    );
  }, [pages, searchQuery]);

  const searchActive = Boolean(normalizeSearchQuery(searchQuery));
  const visible = searchActive
    ? filteredPages
    : showAll
      ? pages
      : pages.slice(0, INITIAL_VISIBLE);
  const hasMore = !searchActive && pages.length > INITIAL_VISIBLE && !showAll;

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

        <section className="py-10 sm:py-14 lg:py-16 bg-[#f8fafc]">
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
                {filteredPages.length} result{filteredPages.length === 1 ? "" : "s"} for &ldquo;
                {searchQuery.trim()}&rdquo;
              </p>
            ) : null}

            {loadError ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-5 text-[#9f1239]">
                <h2 className="text-[16px] font-extrabold">Could not load services</h2>
                <p className="mt-1 text-[14px]">{loadError}</p>
              </div>
            ) : null}

            {!loadError && pages.length === 0 ? (
              <p className="text-center text-[var(--home1-muted)] py-12">No services available right now.</p>
            ) : null}

            {!loadError && pages.length > 0 && searchActive && filteredPages.length === 0 ? (
              <p className="text-center text-[var(--home1-muted)] py-12">
                No services found for &ldquo;{searchQuery.trim()}&rdquo;. Try another search term.
              </p>
            ) : null}

            {!loadError && visible.length > 0 ? (
              <>
                <ul className="home1-other-services-grid p-0 m-0">
                  {visible.map((page) => (
                    <li key={page.id || page.slug}>
                      <OtherServiceCard page={page} />
                    </li>
                  ))}
                </ul>
                {hasMore ? (
                  <div className="flex justify-center mt-8 sm:mt-10">
                    <button
                      type="button"
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center justify-center rounded-full bg-[#d3231f] px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#b71c1c]"
                    >
                      See more services
                    </button>
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
