"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import ServicesLoadError from "@/components/services/ServicesLoadError";
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

function LocationCardSkeleton() {
  return (
    <li className="home1-locations-area-item" aria-hidden="true">
      <div className="home1-locations-area-card home1-locations-area-card--skeleton">
        <span className="home1-locations-area-icon" />
        <span className="home1-locations-area-body">
          <span className="ue-skeleton home1-locations-area-name-skeleton" />
          <span className="ue-skeleton home1-locations-area-cta-skeleton" />
        </span>
      </div>
    </li>
  );
}

export default function LocationsAreasList() {
  const dispatch = useAppDispatch();
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
          className="text-center text-[24px] sm:text-[30px] lg:text-[34px] font-extrabold tracking-tight text-[#111827] mb-8 sm:mb-10"
        >
          We proudly serve the following areas
        </h2>

        {status === "failed" && locations.length === 0 ? (
          <ServicesLoadError message={error} onRetry={() => dispatch(fetchLocations({ page: 1 }))} />
        ) : null}

        {initialLoading ? (
          <ul className="home1-locations-areas-grid list-none p-0 m-0" aria-busy="true" aria-label="Loading locations">
            {Array.from({ length: 10 }, (_, index) => (
              <LocationCardSkeleton key={index} />
            ))}
          </ul>
        ) : null}

        {locations.length > 0 ? (
          <>
            <ul className="home1-locations-areas-grid list-none p-0 m-0">
              {locations.map((location) => (
                <li key={location.slug} className="home1-locations-area-item">
                  <Link href={location.href} className="home1-locations-area-card">
                    <span className="home1-locations-area-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                      </svg>
                    </span>
                    <span className="home1-locations-area-body">
                      <span className="home1-locations-area-name">{location.areaName}</span>
                      <span className="home1-locations-area-cta">View local electricians →</span>
                    </span>
                  </Link>
                </li>
              ))}

              {loadingMore
                ? Array.from({ length: 4 }, (_, index) => <LocationCardSkeleton key={`more-${index}`} />)
                : null}
            </ul>

            {loadMoreError ? (
              <p className="text-center text-[#b91c1c] text-sm mt-4" role="alert">
                {loadMoreError}
              </p>
            ) : null}

            {hasMore ? (
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
          </>
        ) : null}

        {!initialLoading && status !== "failed" && locations.length === 0 ? (
          <p className="text-center text-[#64748b] py-8">No areas found.</p>
        ) : null}
      </div>
    </section>
  );
}
