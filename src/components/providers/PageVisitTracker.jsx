"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { stripTitleBrand } from "@/lib/seo/documentTitle";
import { trackPageVisit } from "@/services/trackPageVisitApiService";

/**
 * @param {string} pathname
 */
function humanizePath(pathname) {
  if (!pathname || pathname === "/") return "Home";
  return pathname
    .replace(/^\//, "")
    .split("/")
    .filter(Boolean)
    .map((segment) =>
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase())
    )
    .join(" - ");
}

/**
 * @param {string} pathname
 */
function resolveDisplayName(pathname) {
  const fromDoc = stripTitleBrand(document.title);
  if (fromDoc && !/^urgent electrical$/i.test(fromDoc)) {
    return fromDoc;
  }

  const meta = document.querySelector('meta[name="title"]')?.getAttribute("content");
  const fromMeta = stripTitleBrand(meta);
  if (fromMeta) return fromMeta;

  return humanizePath(pathname);
}

/**
 * Fires POST /track-page-visit once per client route (pathname) load.
 * Mounted globally from AppProviders so every page is covered.
 */
export default function PageVisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    // Relative path only (no query/hash) — matches API contract examples.
    const url = pathname.split("?")[0].split("#")[0] || "/";

    let cancelled = false;
    // Allow Next.js metadata / document.title to settle after client navigations.
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      void trackPageVisit({
        url,
        display_name: resolveDisplayName(url),
      });
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
