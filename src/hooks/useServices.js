"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { buildServiceCategoryFilters } from "@/lib/services/buildServiceCategory";
import {
  selectBookableServices,
  selectBookingOptions,
  selectFeaturedFromApi,
  selectServiceCategories,
  selectServicesStatus,
} from "@/store/selectors/servicesSelectors";

export function useBookableServices() {
  const bookable = useAppSelector(selectBookableServices);
  const status = useAppSelector(selectServicesStatus);
  const error = useAppSelector((s) => s.services.error);
  const loading = status === "loading" || status === "idle";
  const failed = status === "failed";

  return { bookable, loading, failed, error, status };
}

export function useBookingOptions() {
  const options = useAppSelector(selectBookingOptions);
  const status = useAppSelector(selectServicesStatus);
  const loading = status === "loading" || status === "idle";
  const failed = status === "failed";

  return { options, loading, failed, status };
}

export function useFeaturedServices({ limit } = {}) {
  const featured = useAppSelector(selectFeaturedFromApi);
  const status = useAppSelector(selectServicesStatus);

  const services = useMemo(() => {
    const list = featured.map((s) => ({
      id: s.id,
      name: s.name,
      price: s.price,
      priceExcVat: s.priceExcVat,
      priceIncVat: s.priceIncVat,
      color: s.color,
      image: s.image,
      tag: s.tag,
      href: s.href,
    }));
    return limit ? list.slice(0, limit) : list;
  }, [featured, limit]);

  return {
    services,
    loading: status === "loading" || status === "idle",
    failed: status === "failed",
    status,
  };
}

export function useServiceBySlug(slug) {
  const { bookable } = useBookableServices();
  return useMemo(() => bookable.find((s) => s.slug === slug) ?? null, [bookable, slug]);
}

export function useServiceByName(name) {
  const { bookable } = useBookableServices();
  return useMemo(
    () => bookable.find((s) => s.name === name) ?? bookable[0] ?? null,
    [bookable, name]
  );
}

export function useServiceCategories() {
  const categories = useAppSelector(selectServiceCategories);
  const status = useAppSelector(selectServicesStatus);
  const filters = useMemo(() => buildServiceCategoryFilters(categories), [categories]);

  return {
    categories,
    filters,
    loading: status === "loading" || status === "idle",
    failed: status === "failed",
  };
}
