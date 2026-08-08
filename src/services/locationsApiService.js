import { LOCATIONS_API_PATH, LOCATIONS_SEARCH_API_PATH } from "@/constants/locationsApi";
import { ApiError } from "@/lib/api/errors";
import { parseLocationsListPayload } from "@/lib/locations/parseLocationsList";
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
 * Nearby areas for the opened location — accurate geographic neighbours.
 * Pins first; Google Places at most once when needed; OSM fill.
 *
 * @param {{
 *   cityName?: string | null,
 *   citySlug?: string | null,
 *   currentSlug: string,
 *   currentName?: string | null,
 *   limit?: number,
 *   lat?: number | null,
 *   lng?: number | null,
 *   apiData?: Record<string, unknown> | null,
 * }} options
 * @returns {Promise<{ name: string, slug: string, href: string, hasCmsPage?: boolean }[]>}
 */
export async function fetchNearbyLocationsForArea(options) {
  const { fetchAccurateNearbyAreas } = await import("@/lib/locations/resolveNearbyAreas");
  return fetchAccurateNearbyAreas(options);
}

/** @deprecated Use fetchNearbyLocationsForArea */
export async function fetchRelatedLocationsForCity(options) {
  return fetchNearbyLocationsForArea(options);
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
