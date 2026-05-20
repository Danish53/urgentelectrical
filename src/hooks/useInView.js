"use client";

import { useEffect, useState } from "react";

/**
 * @param {React.RefObject<Element | null>} ref
 * @param {{ threshold?: number; once?: boolean; rootMargin?: string }} options
 */
export function useInView(ref, { threshold = 0.12, once = true, rootMargin = "0px 0px -6% 0px" } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold, once, rootMargin]);

  return inView;
}
