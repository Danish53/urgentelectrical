"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { matchesLocationSearch } from "@/lib/locations/matchesLocationSearch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectLocationsError,
  selectLocationsList,
  selectLocationsLoadMoreError,
  selectLocationsLoadingMore,
  selectLocationsPagination,
  selectLocationsStatus,
} from "@/store/selectors/locationsSelectors";
import { fetchLocations, loadMoreLocations } from "@/store/slices/locationsSlice";
import { LocationAreaCard, LocationAreaCardSkeleton } from "@/components/locations/LocationAreaCard";

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LocationsAreasList() {
  const dispatch = useAppDispatch();
  const searchId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const locations = useAppSelector(selectLocationsList);
  const pagination = useAppSelector(selectLocationsPagination);
  const status = useAppSelector(selectLocationsStatus);
  const error = useAppSelector(selectLocationsError);
  const loadingMore = useAppSelector(selectLocationsLoadingMore);
  const loadMoreError = useAppSelector(selectLocationsLoadMoreError);

  const initialLoading = (status === "loading" || status === "idle") && locations.length === 0;
  const currentPage = pagination?.currentPage ?? 1;
  const lastPage = pagination?.lastPage ?? 1;
  const hasMore = currentPage < lastPage;

  const filteredLocations = useMemo(
    () => locations.filter((location) => matchesLocationSearch(location, searchQuery)),
    [locations, searchQuery]
  );

  const showSearchEmpty =
    !initialLoading && status !== "failed" && locations.length > 0 && searchQuery.trim() && filteredLocations.length === 0;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLocations({ page: 1 }));
    }
  }, [dispatch, status]);

  function handleSeeMore() {
    if (loadingMore || !hasMore) return;
    dispatch(loadMoreLocations());
  }

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

        {!initialLoading && status !== "failed" && locations.length > 0 ? (
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
            No areas match &ldquo;{searchQuery.trim()}&rdquo; in the loaded list.
            {hasMore ? " Load more areas or try a different search." : " Try a different search."}
          </p>
        ) : null}

        {status === "failed" && locations.length === 0 ? (
          <ServicesLoadError message={error} onRetry={() => dispatch(fetchLocations({ page: 1 }))} />
        ) : null}

        {initialLoading ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0" aria-busy="true" aria-label="Loading locations">
            {Array.from({ length: 10 }, (_, index) => (
              <LocationAreaCardSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {filteredLocations.length > 0 ? (
          <>
            <ul className="home1-locations-areas-grid list-none p-0 m-0">
              {filteredLocations.map((location) => (
                <LocationAreaCard key={location.slug} location={location} />
              ))}

              {loadingMore && !searchQuery.trim()
                ? Array.from({ length: 4 }, (_, index) => <LocationAreaCardSkeleton key={`more-${index}`} />)
                : null}
            </ul>

            {loadMoreError ? (
              <p className="text-center text-[#b91c1c] text-sm mt-4" role="alert">
                {loadMoreError}
              </p>
            ) : null}
          </>
        ) : null}

        {hasMore && !initialLoading && !searchQuery.trim() && status !== "failed" && locations.length > 0 ? (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={handleSeeMore}
              disabled={loadingMore}
              className="inline-flex items-center justify-center rounded-full bg-[#d3231f] px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#b71c1c] disabled:opacity-70 disabled:cursor-wait"
            >
              {loadingMore ? "Loading…" : "See more"}
            </button>
          </div>
        ) : null}

        {!initialLoading && status !== "failed" && locations.length === 0 ? (
          <p className="text-center text-[#64748b] py-8">No areas found.</p>
        ) : null}
      </div>
    </section>
  );
}
