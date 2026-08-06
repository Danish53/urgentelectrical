import { unstable_cache } from "next/cache";
import { LOCATIONS_API_PATH } from "@/constants/locationsApi";
import { LOCATION_MAP_PINS, NEARBY_SETTLEMENT_PINS } from "@/data/locationCoordinates";
import { apiRequest } from "@/lib/api/client";
import { readLocationCoordinates } from "@/lib/locations/buildLocationMapEmbed";
import { geocodeLocationLabel } from "@/lib/locations/geocodeLocation";
import { parseLocationsListPayload } from "@/lib/locations/parseLocationsList";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";

const MAX_PAGES = 150;
const PAGE_CONCURRENCY = 4;

/**
 * @typedef {{
 *   name: string,
 *   slug: string,
 *   href: string,
 *   lat: number | null,
 *   lng: number | null,
 * }} LocationGeoItem
 */

/**
 * @typedef {{
 *   items: LocationGeoItem[],
 * }} LocationGeoIndex
 */

/**
 * @param {number} page
 */
async function fetchLocationsPageForIndex(page = 1) {
  const safePage = Math.max(1, Math.floor(page));
  const path =
    safePage <= 1 ? LOCATIONS_API_PATH : `${LOCATIONS_API_PATH}?page=${safePage}`;
  const payload = await apiRequest(path, { method: "GET" });
  return parseLocationsListPayload(payload);
}

/**
 * Exact hub pin match only (no loose substring matching).
 * @param {string} name
 * @returns {{ lat: number, lng: number } | null}
 */
function findKnownPin(name) {
  const normalized = normalizeLocationName(name);
  if (!normalized) return null;

  // CMS slug typo: attenborouogh
  const lookup = normalized.startsWith("attenboro") ? "attenborough" : normalized;

  const pinSets = [LOCATION_MAP_PINS, NEARBY_SETTLEMENT_PINS];
  for (const pins of pinSets) {
    for (const pin of pins) {
      const pinName = normalizeLocationName(pin.name.replace(/\s+City\s+Centre$/i, ""));
      if (pinName === lookup) return { lat: pin.lat, lng: pin.lng };
    }
  }
  return null;
}

/**
 * City hint from labels like "Arnold, Nottingham".
 * @param {string} name
 * @returns {string}
 */
export function cityHintFromAreaName(name) {
  const raw = String(name ?? "").trim();
  if (!raw.includes(",")) return "";
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

/**
 * Short place label without trailing city.
 * @param {string} name
 */
export function shortAreaName(name) {
  const raw = String(name ?? "").trim();
  return raw.split(",")[0].trim() || raw;
}

/**
 * @returns {Promise<LocationGeoIndex>}
 */
async function buildLocationGeoIndex() {
  /** @type {Map<string, LocationGeoItem>} */
  const bySlug = new Map();

  /**
   * @param {{ areaName?: string, slug?: string, href?: string, lat?: number | null, lng?: number | null }} loc
   */
  function add(loc) {
    const slug = String(loc.slug ?? "").trim();
    const name = String(loc.areaName ?? "").trim();
    if (!slug || !name) return;

    const pin = findKnownPin(name) || findKnownPin(shortAreaName(name));
    const lat = loc.lat ?? pin?.lat ?? null;
    const lng = loc.lng ?? pin?.lng ?? null;

    const existing = bySlug.get(slug);
    if (existing) {
      if ((existing.lat == null || existing.lng == null) && lat != null && lng != null) {
        bySlug.set(slug, { ...existing, lat, lng });
      }
      return;
    }

    bySlug.set(slug, {
      name,
      slug,
      href: loc.href || `/locations/${slug}`,
      lat,
      lng,
    });
  }

  let lastPage = 1;
  try {
    const first = await fetchLocationsPageForIndex(1);
    lastPage = Math.max(1, Math.min(first.pagination?.lastPage ?? 1, MAX_PAGES));
    first.locations.forEach(add);
  } catch {
    return { items: [] };
  }

  for (let start = 2; start <= lastPage; start += PAGE_CONCURRENCY) {
    const end = Math.min(start + PAGE_CONCURRENCY - 1, lastPage);
    const pages = [];
    for (let page = start; page <= end; page += 1) pages.push(page);

    const settled = await Promise.allSettled(
      pages.map((page) => fetchLocationsPageForIndex(page))
    );
    for (const result of settled) {
      if (result.status !== "fulfilled") continue;
      result.value.locations.forEach(add);
    }
  }

  return { items: Array.from(bySlug.values()) };
}

/**
 * Cached CMS locations with optional coordinates (1 hour).
 * @returns {Promise<LocationGeoIndex>}
 */
export const getLocationGeoIndex = unstable_cache(
  buildLocationGeoIndex,
  ["location-geo-index-v3"],
  { revalidate: 3600 }
);

/**
 * Resolve coordinates for the opened map location.
 * Prefer CMS coords, then Nominatim (same place query the map uses), then hub pin.
 *
 * @param {{
 *   name?: string | null,
 *   cityName?: string | null,
 *   slug?: string | null,
 *   apiData?: Record<string, unknown> | null,
 *   lat?: number | null,
 *   lng?: number | null,
 * }} input
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function resolveOpenedLocationCoords(input = {}) {
  const fromInput =
    typeof input.lat === "number" &&
    typeof input.lng === "number" &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
      ? { lat: input.lat, lng: input.lng }
      : null;
  if (fromInput) return fromInput;

  const fromApi = readLocationCoordinates(input.apiData ?? null);
  if (fromApi) return fromApi;

  const name = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();

  // Prefer curated pins before slow/blocked geocoders (e.g. Attenborough).
  const earlyPin =
    findKnownPin(name) ||
    findKnownPin(shortAreaName(name)) ||
    findKnownPin(String(input.slug ?? "").replace(/^electrician-/i, "").replace(/-/g, " "));
  if (earlyPin) return earlyPin;

  // Geocode the opened place first so nearby matches the map pin / search query.
  const geocoded = await geocodeLocationLabel({
    name: shortAreaName(name) || name,
    cityName,
    slug: input.slug,
  });
  if (geocoded) return geocoded;

  // CMS slug typos (e.g. attenborouogh) — try cleaned slug tokens.
  const slugLabel = String(input.slug ?? "")
    .replace(/^electrician-/i, "")
    .replace(/-/g, " ")
    .trim();
  if (slugLabel && normalizeLocationName(slugLabel) !== normalizeLocationName(name)) {
    const fromSlug = await geocodeLocationLabel({
      name: shortAreaName(slugLabel),
      cityName,
      slug: input.slug,
      quick: true,
    });
    if (fromSlug) return fromSlug;
  }

  // Common misspelling for Attenborough CMS slug.
  if (/attenboro/i.test(`${name} ${input.slug ?? ""}`)) {
    const attenborough = await geocodeLocationLabel({
      name: "Attenborough",
      cityName: cityName || "Nottingham",
      quick: true,
    });
    if (attenborough) return attenborough;
    const pinAttenborough = findKnownPin("Attenborough");
    if (pinAttenborough) return pinAttenborough;
  }

  const pin = findKnownPin(name) || findKnownPin(shortAreaName(name));
  if (pin) return pin;

  if (cityName && normalizeLocationName(cityName) === normalizeLocationName(name)) {
    return findKnownPin(cityName);
  }

  return null;
}

/**
 * Ensure a geo index item has coordinates (geocode that area itself).
 * @param {LocationGeoItem} item
 * @returns {Promise<LocationGeoItem>}
 */
export async function ensureGeoItemCoords(item) {
  if (item.lat != null && item.lng != null) return item;

  const pin = findKnownPin(item.name) || findKnownPin(shortAreaName(item.name));
  if (pin) return { ...item, lat: pin.lat, lng: pin.lng };

  const geocoded = await geocodeLocationLabel({
    name: shortAreaName(item.name),
    cityName: cityHintFromAreaName(item.name),
    slug: item.slug,
    quick: true,
  });
  if (!geocoded) return item;
  return { ...item, lat: geocoded.lat, lng: geocoded.lng };
}
