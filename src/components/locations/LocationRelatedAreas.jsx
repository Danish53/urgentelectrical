"use client";

import { useEffect } from "react";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { LocationAreaCard, LocationAreaCardSkeleton } from "@/components/locations/LocationAreaCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectLocationsList,
  selectLocationsLoadMoreError,
  selectLocationsLoadingMore,
  selectLocationsPagination,
  selectLocationsStatus,
} from "@/store/selectors/locationsSelectors";
import { fetchLocations, loadMoreLocations } from "@/store/slices/locationsSlice";

/**
 * @param {{ currentSlug: string }} props
 */
export default function LocationRelatedAreas({ currentSlug }) {
  const dispatch = useAppDispatch();
  const locations = useAppSelector(selectLocationsList);
  const pagination = useAppSelector(selectLocationsPagination);
  const status = useAppSelector(selectLocationsStatus);
  const loadingMore = useAppSelector(selectLocationsLoadingMore);
  const loadMoreError = useAppSelector(selectLocationsLoadMoreError);

  const initialLoading = (status === "loading" || status === "idle") && locations.length === 0;
  const currentPage = pagination?.currentPage ?? 1;
  const lastPage = pagination?.lastPage ?? 1;
  const hasMore = currentPage < lastPage;
  const relatedLocations = locations.filter((location) => location.slug !== currentSlug);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchLocations({ page: 1 }));
    }
  }, [dispatch, status]);

  function handleSeeMore() {
    if (loadingMore || !hasMore) return;
    dispatch(loadMoreLocations());
  }

  if (!initialLoading && status !== "failed" && relatedLocations.length === 0 && !hasMore) {
    return null;
  }

  return (
    <section
      className="home1-locations-areas bg-white py-12 sm:py-16 lg:py-20"
      aria-labelledby="location-related-areas-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <h2
          id="location-related-areas-heading"
          className="text-center text-[24px] sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[#111827] mb-8 sm:mb-10"
        >
          We proudly serve the following areas
        </h2>

        {initialLoading ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0" aria-busy="true" aria-label="Loading locations">
            {Array.from({ length: 6 }, (_, index) => (
              <LocationAreaCardSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {relatedLocations.length > 0 ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0">
            {relatedLocations.map((location) => (
              <LocationAreaCard key={location.slug} location={location} />
            ))}
            {loadingMore
              ? Array.from({ length: 3 }, (_, index) => <LocationAreaCardSkeleton key={`more-${index}`} />)
              : null}
          </ul>
        ) : null}

        {loadMoreError ? (
          <p className="text-center text-[#b91c1c] text-sm mt-4" role="alert">
            {loadMoreError}
          </p>
        ) : null}

        {hasMore && !initialLoading ? (
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
      </div>
    </section>
  );
}
