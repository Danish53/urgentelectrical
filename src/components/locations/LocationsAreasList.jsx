"use client";

import { useEffect, useId, useRef, useState } from "react";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchLocationsSearch } from "@/services/locationsApiService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectLocationsError,
  selectLocationsList,
  selectLocationsLoadMoreError,
  selectLocationsLoadingMore,
  selectLocationsPagination,
  selectLocationsStatus,
} from "@/store/selectors/locationsSelectors";
import { fetchLocations, hydrateLocations, loadMoreLocations } from "@/store/slices/locationsSlice";
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
  const loadingMore = useAppSelector(selectLocationsLoadingMore);
  const loadMoreError = useAppSelector(selectLocationsLoadMoreError);

  // Prefer Redux after hydrate; fall back to SSR props so crawlers see real <a> links.
  const browseLocations = locations.length ? locations : initialLocations;
  const displayPagination = pagination ?? initialPagination;

  const isSearching = Boolean(debouncedQuery.trim());
  const initialLoading =
    !isSearching && (status === "loading" || status === "idle") && browseLocations.length === 0;
  const searchLoading = isSearching && searchStatus === "loading";
  const currentPage = displayPagination?.currentPage ?? 1;
  const lastPage = displayPagination?.lastPage ?? 1;
  const hasMore = !isSearching && currentPage < lastPage;

  const displayLocations = isSearching ? searchResults : browseLocations;

  const showSearchEmpty =
    isSearching &&
    !searchLoading &&
    searchStatus === "succeeded" &&
    searchResults.length === 0;

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

        {!isSearching && hasMore && !initialLoading && status !== "failed" ? (
          <div className="mt-8 sm:mt-10 flex flex-col items-center gap-3">
            {loadMoreError ? (
              <p className="text-center text-sm font-medium text-[#b71c1c]" role="alert">
                {loadMoreError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => dispatch(loadMoreLocations())}
              disabled={loadingMore}
              className="inline-flex items-center justify-center rounded-full bg-[#d3231f] px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#b71c1c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
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
