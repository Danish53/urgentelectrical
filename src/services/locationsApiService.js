import { LOCATIONS_API_PATH } from "@/constants/locationsApi";
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
