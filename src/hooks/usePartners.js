"use client";

import { useEffect, useState } from "react";
import { getFallbackPartners } from "@/lib/partners/mapPartner";
import { fetchPartners } from "@/services/partnersApiService";

export function usePartners() {
  const fallback = getFallbackPartners();
  const [partners, setPartners] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchPartners();
        if (!cancelled) setPartners(data.length ? data : fallback);
      } catch {
        if (!cancelled) setPartners(fallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { partners, loading };
}
