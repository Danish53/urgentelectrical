"use client";

import { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices, useServiceCategories } from "@/hooks/useServices";
import ServicesGridSkeleton from "@/components/skeletons/ServicesGridSkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import ListSearchBar from "@/components/common/ListSearchBar";
import CategoryTabsSlider from "@/components/common/CategoryTabsSlider";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { matchesListSearch, normalizeSearchQuery } from "@/lib/listSearch";
import SectionHeader from "@/components/home1/SectionHeader";
import ServiceCard from "./ServiceCard";

export default function ServicesCatalog() {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { bookable, loading, failed, error } = useBookableServices();
  const { filters: categoryFilters } = useServiceCategories();
  const totalCount = useAppSelector((s) => s.services.meta?.total ?? bookable.length);

  const filtered = useMemo(() => {
    const byCategory =
      active === "all" ? bookable : bookable.filter((service) => service.category === active);

    if (!normalizeSearchQuery(searchQuery)) return byCategory;

    return byCategory.filter((service) =>
      matchesListSearch(searchQuery, service.name, service.description)
    );
  }, [active, bookable, searchQuery]);

  const hashCategoryId = useMemo(() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    return categoryFilters.find((c) => c.id === hash)?.id ?? null;
  }, [categoryFilters]);

  if (hashCategoryId && active !== hashCategoryId) {
    setActive(hashCategoryId);
  }

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;
    const matchCat = categoryFilters.find((c) => c.id === hash);
    if (!matchCat) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [categoryFilters]);

  const searchActive = Boolean(normalizeSearchQuery(searchQuery));

  return (
    <section
      id="services-catalog"
      className="py-10 sm:py-16 lg:py-20 bg-white overflow-x-clip scroll-mt-28 relative z-[1]"
      aria-labelledby="services-catalog-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <SectionHeader
          id="services-catalog-heading"
          eyebrow="Our Services"
          title="Book electrical services online"
          description={
            totalCount > 0
              ? `${totalCount} fixed-price services from our live catalogue — transparent pricing with NICEIC approved engineers.`
              : "Transparent pricing with NICEIC approved engineers — select a service for full details."
          }
          align="center"
        />

        <ListSearchBar
          id="services-list-search"
          label="Search services"
          placeholder="Search services by title or description…"
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {searchActive ? (
          <p className="home1-list-search-results" aria-live="polite">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{searchQuery.trim()}&rdquo;
          </p>
        ) : null}

        <CategoryTabsSlider
          categories={categoryFilters}
          active={active}
          onChange={setActive}
          layoutId="services-tab-pill"
          ariaLabel="Filter services by category"
        />

        {loading ? (
          <ServicesGridSkeleton count={6} />
        ) : failed ? (
          <ServicesLoadError message={error} onRetry={() => dispatch(fetchServices())} />
        ) : filtered.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-14">
            {searchActive
              ? `No services found for "${searchQuery.trim()}". Try another search term.`
              : "No services in this category."}
          </p>
        ) : (
          <ul
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0"
          >
            {filtered.map((service, i) => (
              <li key={service.id} className="min-w-0">
                <ServiceCard service={service} imagePriority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
