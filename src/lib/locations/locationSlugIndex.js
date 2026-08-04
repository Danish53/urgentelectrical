import { unstable_cache } from "next/cache";
import { AREA_LOCATION_SLUG_OVERRIDES } from "@/data/areas";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";
import { fetchLocationsPage } from "@/services/locationsApiService";

const MAX_PAGES = 150;
const PAGE_CONCURRENCY = 4;

/**
 * @typedef {{
 *   byName: Record<string, string>,
 *   slugs: string[],
 * }} LocationSlugIndex
 */

/**
 * @param {string} name
 * @param {string} slug
 * @param {Map<string, string>} byName
 */
function indexName(name, slug, byName) {
  const key = normalizeLocationName(name);
  if (!key || !slug) return;

  const existing = byName.get(key);
  if (!existing) {
    byName.set(key, slug);
    return;
  }

  // Prefer shorter CMS slug when both match the same display name.
  if (slug.length < existing.length) {
    byName.set(key, slug);
  }
}

/**
 * @returns {Promise<LocationSlugIndex>}
 */
async function buildLocationSlugIndex() {
  /** @type {Map<string, string>} */
  const byName = new Map();
  /** @type {Set<string>} */
  const slugSet = new Set();

  let lastPage = 1;
  try {
    const first = await fetchLocationsPage(1);
    lastPage = Math.max(1, Math.min(first.pagination?.lastPage ?? 1, MAX_PAGES));
    for (const loc of first.locations) {
      const slug = String(loc.slug ?? "").trim();
      if (!slug) continue;
      slugSet.add(slug);
      indexName(loc.areaName, slug, byName);
      indexName(String(loc.areaName ?? "").split(",")[0], slug, byName);
      indexName(slug.replace(/^electrician-/i, "").replace(/-/g, " "), slug, byName);
    }
  } catch {
    return { byName: {}, slugs: [] };
  }

  for (let start = 2; start <= lastPage; start += PAGE_CONCURRENCY) {
    const end = Math.min(start + PAGE_CONCURRENCY - 1, lastPage);
    const pages = [];
    for (let page = start; page <= end; page += 1) pages.push(page);

    const settled = await Promise.allSettled(pages.map((page) => fetchLocationsPage(page)));
    for (const result of settled) {
      if (result.status !== "fulfilled") continue;
      for (const loc of result.value.locations) {
        const slug = String(loc.slug ?? "").trim();
        if (!slug) continue;
        slugSet.add(slug);
        indexName(loc.areaName, slug, byName);
        indexName(String(loc.areaName ?? "").split(",")[0], slug, byName);
        indexName(slug.replace(/^electrician-/i, "").replace(/-/g, " "), slug, byName);
      }
    }
  }

  // Explicit overrides always win when they point at a live slug.
  for (const [label, override] of Object.entries(AREA_LOCATION_SLUG_OVERRIDES)) {
    if (typeof override !== "string" || !override.trim()) continue;
    const slug = override.trim();
    if (slugSet.size && !slugSet.has(slug)) continue;
    indexName(label, slug, byName);
    indexName(label.replace(/\s+city\s+centre$/i, ""), slug, byName);
  }

  return {
    byName: Object.fromEntries(byName),
    slugs: Array.from(slugSet),
  };
}

/**
 * Cached CMS location name → slug map (1 hour).
 * @returns {Promise<LocationSlugIndex>}
 */
export const getLocationSlugIndex = unstable_cache(
  buildLocationSlugIndex,
  ["location-slug-index-v1"],
  { revalidate: 3600 }
);

/**
 * Resolve a display area name to a published CMS location slug.
 * Returns "" when no live page exists (caller should link to /locations).
 *
 * @param {string} areaName
 * @param {LocationSlugIndex | null | undefined} index
 * @returns {string}
 */
export function lookupLocationSlug(areaName, index) {
  const name = String(areaName ?? "").trim();
  if (!name) return "";

  if (Object.prototype.hasOwnProperty.call(AREA_LOCATION_SLUG_OVERRIDES, name)) {
    const override = AREA_LOCATION_SLUG_OVERRIDES[name];
    if (typeof override !== "string" || !override.trim()) return "";
    // Curated overrides are trusted even before the CMS index finishes loading.
    return override.trim();
  }

  if (!index?.byName) return "";

  const key = normalizeLocationName(name);
  if (key && index.byName[key]) return index.byName[key];

  const shortKey = normalizeLocationName(name.split(",")[0]);
  if (shortKey && index.byName[shortKey]) return index.byName[shortKey];

  const withoutCentre = normalizeLocationName(name.replace(/\s+city\s+centre$/i, ""));
  if (withoutCentre && index.byName[withoutCentre]) return index.byName[withoutCentre];

  return "";
}

/**
 * @param {string} areaName
 * @param {LocationSlugIndex | null | undefined} index
 * @returns {string}
 */
export function lookupLocationHref(areaName, index) {
  const slug = lookupLocationSlug(areaName, index);
  return slug ? `/locations/${slug}` : "/locations";
}

/**
 * @param {string[]} areaNames
 * @param {LocationSlugIndex | null | undefined} [index]
 * @returns {Promise<{ name: string, href: string, slug: string }[]>}
 */
export async function resolveAreaLocationLinks(areaNames, index) {
  const resolvedIndex = index ?? (await getLocationSlugIndex());
  const names = Array.isArray(areaNames) ? areaNames : [];

  return names
    .map((name) => {
      const label = String(name ?? "").trim();
      if (!label) return null;
      const slug = lookupLocationSlug(label, resolvedIndex);
      return {
        name: label,
        slug,
        href: slug ? `/locations/${slug}` : "/locations",
      };
    })
    .filter(Boolean);
}
