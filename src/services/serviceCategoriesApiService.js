import { SERVICE_CATEGORIES_API_PATH } from "@/constants/servicesApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";

/**
 * @typedef {object} ApiServiceCategory
 * @property {number} id
 * @property {string | null} slug
 * @property {string} category_name
 * @property {string | null} image
 * @property {string | null} description
 */

/**
 * @param {unknown} payload
 * @returns {ApiServiceCategory[]}
 */
export function parseServiceCategoriesResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.status === true && Array.isArray(record.data)) {
    return /** @type {ApiServiceCategory[]} */ (record.data);
  }

  if (Array.isArray(record.data)) {
    return /** @type {ApiServiceCategory[]} */ (record.data);
  }

  if (Array.isArray(payload)) {
    return /** @type {ApiServiceCategory[]} */ (payload);
  }

  return [];
}

/** GET /service-categories */
export async function fetchServiceCategories() {
  const payload = await apiRequest(SERVICE_CATEGORIES_API_PATH, { method: "GET" });
  const categories = parseServiceCategoriesResponse(payload);

  if (!categories.length) {
    throw new ApiError("No service categories returned from server.", { status: 0, data: payload });
  }

  return categories;
}
