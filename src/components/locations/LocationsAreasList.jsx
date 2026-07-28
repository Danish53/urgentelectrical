"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchLocationsSearch } from "@/services/locationsApiService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectLocationsError,
  selectLocationsList,
  selectLocationsPagination,
  selectLocationsStatus,
} from "@/store/selectors/locationsSelectors";
import { fetchLocations, hydrateLocations } from "@/store/slices/locationsSlice";
import { LocationAreaCard, LocationAreaCardSkeleton } from "@/components/locations/LocationAreaCard";

const SEARCH_DEBOUNCE_MS = 350;

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * @param {number} current
 * @param {number} last
 */
function buildPageWindow(current, last) {
  const pages = new Set([1, last, current, current - 1, current + 1, current - 2, current + 2]);
  return [...pages].filter((p) => p >= 1 && p <= last).sort((a, b) => a - b);
}

/**
 * @param {{
 *   initialLocations?: import("@/lib/locations/parseLocationsList").LocationListItem[],
 *   initialPagination?: import("@/lib/locations/parseLocationsList").LocationsPagination | null,
 * }} props
 */
export default function LocationsAreasList({
  initialLocations = [],
  initialPagination = null,
}) {
  const dispatch = useAppDispatch();
  const searchId = useId();
  const hydratedRef = useRef(false);
  const searchRequestId = useRef(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  /** @type {[import("@/lib/locations/parseLocationsList").LocationListItem[], Function]} */
  const [searchResults, setSearchResults] = useState([]);
  /** @type {["idle" | "loading" | "succeeded" | "failed", Function]} */
  const [searchStatus, setSearchStatus] = useState("idle");
  const [searchError, setSearchError] = useState("");

  const locations = useAppSelector(selectLocationsList);
  const pagination = useAppSelector(selectLocationsPagination);
  const status = useAppSelector(selectLocationsStatus);
  const error = useAppSelector(selectLocationsError);

  // Prefer Redux after hydrate; fall back to SSR props so crawlers see real <a> links.
  const browseLocations = locations.length ? locations : initialLocations;
  const displayPagination = pagination ?? initialPagination;

  const isSearching = Boolean(debouncedQuery.trim());
  const initialLoading =
    !isSearching && (status === "loading" || status === "idle") && browseLocations.length === 0;
  const searchLoading = isSearching && searchStatus === "loading";
  const currentPage = displayPagination?.currentPage ?? 1;
  const lastPage = displayPagination?.lastPage ?? 1;

  const displayLocations = isSearching ? searchResults : browseLocations;

  const showSearchEmpty =
    isSearching &&
    !searchLoading &&
    searchStatus === "succeeded" &&
    searchResults.length === 0;

  const pageWindow = useMemo(() => buildPageWindow(currentPage, lastPage), [currentPage, lastPage]);

  useEffect(() => {
    if (hydratedRef.current) return;

    if (initialLocations.length || initialPagination) {
      hydratedRef.current = true;
      dispatch(
        hydrateLocations({
          locations: initialLocations,
          pagination: initialPagination,
        })
      );
      return;
    }

    if (status === "idle") {
      hydratedRef.current = true;
      dispatch(fetchLocations({ page: 1 }));
    }
  }, [dispatch, initialLocations, initialPagination, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const query = debouncedQuery.trim();
    if (!query) {
      searchRequestId.current += 1;
      setSearchResults([]);
      setSearchStatus("idle");
      setSearchError("");
      return;
    }

    const requestId = ++searchRequestId.current;
    setSearchStatus("loading");
    setSearchError("");

    fetchLocationsSearch(query)
      .then((result) => {
        if (requestId !== searchRequestId.current) return;
        setSearchResults(result.locations);
        setSearchStatus("succeeded");
      })
      .catch((err) => {
        if (requestId !== searchRequestId.current) return;
        setSearchResults([]);
        setSearchStatus("failed");
        setSearchError(getApiErrorMessage(err, "Could not search locations."));
      });
  }, [debouncedQuery]);

  const showSearchBox =
    !initialLoading && (status !== "failed" || browseLocations.length > 0 || isSearching);

  return (
    <section
      className="home1-locations-areas bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="locations-areas-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <h2
          id="locations-areas-heading"
          className="text-center text-[24px] sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[#111827] mb-6 sm:mb-8"
        >
          We proudly serve the following areas
        </h2>

        {showSearchBox ? (
          <div className="home1-locations-areas-search-wrap">
            <label htmlFor={searchId} className="sr-only">
              Search areas
            </label>
            <div className="home1-locations-areas-search">
              <IconSearch className="home1-locations-areas-search__icon" />
              <input
                id={searchId}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search areas…"
                className="home1-locations-areas-search__input"
                autoComplete="off"
              />
            </div>
          </div>
        ) : null}

        {showSearchEmpty ? (
          <p className="home1-locations-areas-search-empty" role="status">
            No areas match &ldquo;{debouncedQuery}&rdquo;. Try a different search.
          </p>
        ) : null}

        {isSearching && searchStatus === "failed" ? (
          <ServicesLoadError
            message={searchError}
            onRetry={() => {
              const q = debouncedQuery.trim();
              if (!q) return;
              setSearchStatus("loading");
              setSearchError("");
              const requestId = ++searchRequestId.current;
              fetchLocationsSearch(q)
                .then((result) => {
                  if (requestId !== searchRequestId.current) return;
                  setSearchResults(result.locations);
                  setSearchStatus("succeeded");
                })
                .catch((err) => {
                  if (requestId !== searchRequestId.current) return;
                  setSearchResults([]);
                  setSearchStatus("failed");
                  setSearchError(getApiErrorMessage(err, "Could not search locations."));
                });
            }}
          />
        ) : null}

        {status === "failed" && browseLocations.length === 0 && !isSearching ? (
          <ServicesLoadError message={error} onRetry={() => dispatch(fetchLocations({ page: 1 }))} />
        ) : null}

        {initialLoading || searchLoading ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0" aria-busy="true" aria-label="Loading locations">
            {Array.from({ length: 10 }, (_, index) => (
              <LocationAreaCardSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {!initialLoading && !searchLoading && displayLocations.length > 0 ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0">
            {displayLocations.map((location) => (
              <LocationAreaCard key={location.slug} location={location} />
            ))}
          </ul>
        ) : null}

        {!isSearching && lastPage > 1 && !initialLoading && status !== "failed" ? (
          <nav
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Location pages"
          >
            {currentPage > 1 ? (
              <Link
                href={currentPage === 2 ? "/locations" : `/locations?page=${currentPage - 1}`}
                className="inline-flex items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#d3231f] hover:text-[#d3231f]"
              >
                Previous
              </Link>
            ) : null}

            {pageWindow.map((page, index) => {
              const prev = pageWindow[index - 1];
              const showEllipsis = prev != null && page - prev > 1;
              const href = page === 1 ? "/locations" : `/locations?page=${page}`;
              const isActive = page === currentPage;
              return (
                <span key={page} className="inline-flex items-center gap-2">
                  {showEllipsis ? (
                    <span className="text-[#94a3b8] text-sm" aria-hidden="true">
                      …
                    </span>
                  ) : null}
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={
                      isActive
                        ? "inline-flex min-w-9 items-center justify-center rounded-full bg-[#d3231f] px-3 py-2 text-[13px] font-bold text-white"
                        : "inline-flex min-w-9 items-center justify-center rounded-full border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] font-semibold text-[#111827] transition-colors hover:border-[#d3231f] hover:text-[#d3231f]"
                    }
                  >
                    {page}
                  </Link>
                </span>
              );
            })}

            {currentPage < lastPage ? (
              <Link
                href={`/locations?page=${currentPage + 1}`}
                className="inline-flex items-center justify-center rounded-full bg-[#d3231f] px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#b71c1c]"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}

        {!initialLoading &&
        !searchLoading &&
        !isSearching &&
        status !== "failed" &&
        browseLocations.length === 0 ? (
          <p className="text-center text-[#64748b] py-8">No areas found.</p>
        ) : null}
      </div>
    </section>
  );
}
