"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import {
  getLocationsForFilter,
  LOCATION_FILTERS,
  LOCATIONS_INITIAL_VISIBLE,
} from "@/data/locationsPage";
import { slugify } from "@/lib/slugs";

export default function LocationsAreasList() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const allForFilter = useMemo(() => getLocationsForFilter(activeFilter), [activeFilter]);

  const visible = showAll ? allForFilter : allForFilter.slice(0, LOCATIONS_INITIAL_VISIBLE);
  const hasMore = allForFilter.length > LOCATIONS_INITIAL_VISIBLE && !showAll;

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

        <div
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10"
          role="tablist"
          aria-label="Filter areas by region"
        >
          {LOCATION_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveFilter(filter.id);
                  setShowAll(false);
                }}
                className={`px-5 py-2.5 rounded-lg text-[13px] sm:text-[14px] font-bold transition-colors ${
                  isActive
                    ? "bg-[#d3231f] text-white shadow-[0_4px_14px_rgba(211,35,31,0.35)]"
                    : "bg-white text-[#111827] border border-[#d5d8dc] hover:border-[#d3231f] hover:text-[#d3231f]"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <ul className="home1-locations-areas-grid list-none p-0 m-0">
          {visible.map((area) => (
            <li key={`${activeFilter}-${area}`} className="home1-locations-area-item">
              <Link
                href={`/locations/${slugify(area)}`}
                className="home1-locations-area-link"
              >
                <span className="home1-locations-area-marker" aria-hidden="true" />
                <span>{area}</span>
              </Link>
            </li>
          ))}
        </ul>

        {allForFilter.length === 0 && (
          <p className="text-center text-[#64748b] py-8">No areas listed for this filter.</p>
        )}

        {hasMore && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center rounded-full bg-[#d3231f] px-10 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#b71c1c]"
            >
              See more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
