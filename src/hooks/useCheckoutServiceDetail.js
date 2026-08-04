"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectServiceCategoryMap } from "@/store/selectors/servicesSelectors";
import { buildBookableServiceFromDetailApi } from "@/lib/services/buildBookableServiceFromDetail";
import { normalizeServiceSchedules } from "@/lib/schedules";
import { fetchServiceBySlug } from "@/services/servicesApiService";

export function useCheckoutServiceDetail(slug) {
  const categoryMap = useAppSelector(selectServiceCategoryMap);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [failed, setFailed] = useState(false);
  const [trackedSlug, setTrackedSlug] = useState(slug);

  if (slug !== trackedSlug) {
    setTrackedSlug(slug);
    if (!slug) {
      setService(null);
      setLoading(false);
      setFailed(false);
    } else {
      setLoading(true);
      setFailed(false);
    }
  }

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    fetchServiceBySlug(slug)
      .then((api) => {
        if (cancelled) return;
        setService(buildBookableServiceFromDetailApi(api, categoryMap));
      })
      .catch(() => {
        if (!cancelled) {
          setService(null);
          setFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, categoryMap]);

  const schedules = useMemo(
    () => normalizeServiceSchedules(service?.schedules),
    [service?.schedules]
  );

  return { service, schedules, loading, failed };
}
