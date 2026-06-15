"use client";

import { useEffect, useState } from "react";
import { TESTIMONIALS } from "@/data/testimonials";
import { fetchTestimonials } from "@/services/testimonialsApiService";

/**
 * @param {{ limit?: number }} [options]
 */
export function useTestimonials(options = {}) {
  const { limit } = options;
  const fallback = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

  const [testimonials, setTestimonials] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const staticFallback = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;

    async function load() {
      try {
        const data = await fetchTestimonials();
        if (cancelled) return;
        setTestimonials(limit ? data.slice(0, limit) : data);
      } catch {
        if (!cancelled) setTestimonials(staticFallback);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { testimonials, loading };
}
