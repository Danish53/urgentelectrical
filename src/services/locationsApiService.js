import { LOCATIONS_API_PATH, LOCATIONS_SEARCH_API_PATH } from "@/constants/locationsApi";
import { LOCATION_AREAS_BY_REGION } from "@/data/locationsPage";
import { ApiError } from "@/lib/api/errors";
import { parseLocationsListPayload } from "@/lib/locations/parseLocationsList";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";
import { apiRequest } from "@/lib/api/client";

/**
 * @param {number} page
 */
function locationsPathForPage(page) {
  return page <= 1 ? LOCATIONS_API_PATH : `${LOCATIONS_API_PATH}?page=${page}`;
}

/**
 * @param {number} [page]
 */
export async function fetchLocationsPage(page = 1) {
  const safePage = Math.max(1, Math.floor(page));
  const payload = await apiRequest(locationsPathForPage(safePage), { method: "GET" });
  const parsed = parseLocationsListPayload(payload);

  if (!parsed.locations.length && safePage === 1) {
    throw new ApiError("No locations returned from server.", { status: 0, data: payload });
  }

  return parsed;
}

/**
 * GET /locations/search?query=
 * @param {string} query
 */
export async function fetchLocationsSearch(query) {
  const trimmed = String(query ?? "").trim();
  if (!trimmed) {
    return { locations: [], pagination: null };
  }

  const path = `${LOCATIONS_SEARCH_API_PATH}?query=${encodeURIComponent(trimmed)}`;
  const payload = await apiRequest(path, { method: "GET" });
  return parseLocationsListPayload(payload);
}

/**
 * @param {string | null | undefined} citySlug
 * @param {string | null | undefined} cityName
 */
function regionIdFromCity(citySlug, cityName) {
  const slug = String(citySlug ?? "").trim().toLowerCase();
  if (slug && Object.prototype.hasOwnProperty.call(LOCATION_AREAS_BY_REGION, slug)) {
    return slug;
  }

  const haystack = `${citySlug ?? ""} ${cityName ?? ""}`.toLowerCase();
  if (/\bnottingham/.test(haystack)) return "nottingham";
  if (/\bderby/.test(haystack)) return "derby";
  if (/\bleicester/.test(haystack)) return "leicester";
  if (/\blincoln/.test(haystack)) return "lincoln";
  return "nottingham";
}

/**
 * @param {string} a
 * @param {string} b
 */
function locationNamesMatch(a, b) {
  const left = normalizeLocationName(a);
  const right = normalizeLocationName(b);
  return Boolean(left && right && left === right);
}

/**
 * Live CMS locations near the opened area (same city / region).
 * @param {{
 *   cityName?: string | null,
 *   citySlug?: string | null,
 *   currentSlug: string,
 *   currentName?: string | null,
 *   limit?: number,
 * }} options
 * @returns {Promise<{ name: string, slug: string, href: string }[]>}
 */
export async function fetchRelatedLocationsForCity(options) {
  const currentSlug = String(options.currentSlug ?? "").trim();
  const currentName = String(options.currentName ?? "").trim();
  const limit = Math.max(1, Math.min(options.limit ?? 8, 16));
  const cityName = String(options.cityName ?? "").trim();
  const citySlug = String(options.citySlug ?? "").trim();
  const regionId = regionIdFromCity(citySlug, cityName);

  /** @type {Map<string, { name: string, slug: string, href: string }>} */
  const bySlug = new Map();

  /**
   * @param {{ areaName?: string, name?: string, slug?: string, href?: string } | null | undefined} loc
   */
  function addLocation(loc) {
    const slug = String(loc?.slug ?? "").trim();
    if (!slug || slug === currentSlug || bySlug.has(slug)) return;

    const name = String(loc?.areaName ?? loc?.name ?? "").trim();
    if (!name) return;
    if (currentName && locationNamesMatch(name, currentName)) return;

    bySlug.set(slug, {
      name,
      slug,
      href: loc.href || `/locations/${slug}`,
    });
  }

  const cityQuery = cityName || citySlug;
  if (cityQuery) {
    try {
      const { locations } = await fetchLocationsSearch(cityQuery);
      locations.forEach(addLocation);
    } catch {
      /* fall through to region fill */
    }
  }

  if (bySlug.size < limit) {
    const candidates = (LOCATION_AREAS_BY_REGION[regionId] ?? []).filter(
      (areaName) => !currentName || !locationNamesMatch(areaName, currentName),
    );
    // Only search enough candidates to fill remaining slots (avoid flooding SSR).
    const toSearch = candidates.slice(0, Math.max((limit - bySlug.size) * 2, limit));

    for (let i = 0; i < toSearch.length && bySlug.size < limit; i += 4) {
      const batch = toSearch.slice(i, i + 4);
      const results = await Promise.all(
        batch.map(async (areaName) => {
          try {
            const { locations } = await fetchLocationsSearch(areaName);
            return (
              locations.find((loc) => locationNamesMatch(loc.areaName, areaName)) ||
              locations.find((loc) =>
                locationNamesMatch(
                  loc.areaName,
                  areaName.replace(/\s+city\s+centre$/i, "").trim(),
                ),
              ) ||
              null
            );
          } catch {
            return null;
          }
        }),
      );
      results.forEach(addLocation);
    }
  }

  return Array.from(bySlug.values()).slice(0, limit);
}

/**
 * @param {unknown} payload
 */
export function parseLocationDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && record.data && typeof record.data === "object") {
    return record.data;
  }

  if (record.slug && record.area_name) {
    return record;
  }

  return null;
}

/**
 * @param {string} slug
 */
export async function fetchLocationBySlug(slug) {
  const trimmed = slug.trim();
  if (!trimmed) {
    throw new ApiError("Location not found.", { status: 404 });
  }

  const payload = await apiRequest(`${LOCATIONS_API_PATH}/${encodeURIComponent(trimmed)}`, {
    method: "GET",
  });
  const detail = parseLocationDetailResponse(payload);

  if (!detail) {
    throw new ApiError("Invalid location detail response from server.", { status: 0, data: payload });
  }

  return detail;
}
