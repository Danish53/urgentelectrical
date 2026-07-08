import { SERVICES_API_PATH } from "@/constants/servicesApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";

/**
 * @typedef {object} ApiService
 * @property {number} id
 * @property {number} service_category_id
 * @property {string} title
 * @property {string | null | undefined} [service_display_name]
 * @property {string} price
 * @property {string | null} description
 * @property {string | null} image
 * @property {string | null} [slug]
 */

/**
 * @typedef {object} ServicesPaginationMeta
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number} total
 */

/**
 * @typedef {object} ServicesListResult
 * @property {ApiService[]} services
 * @property {ServicesPaginationMeta | null} meta
 * @property {Record<string, string | null> | null} links
 */

/**
 * Laravel-style: `{ data: [...], links?, meta? }`, legacy `{ status, data }`, or bare array.
 * @param {unknown} payload
 * @returns {ServicesListResult | null}
 */
export function parseServicesApiPayload(payload) {
  if (Array.isArray(payload)) {
    return { services: payload, meta: null, links: null };
  }

  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);
  const services = Array.isArray(record.data) ? record.data : null;
  if (!services) return null;

  const meta =
    record.meta && typeof record.meta === "object"
      ? /** @type {ServicesPaginationMeta} */ (record.meta)
      : null;
  const links =
    record.links && typeof record.links === "object"
      ? /** @type {Record<string, string | null>} */ (record.links)
      : null;

  return { services, meta, links };
}

/** @param {unknown} payload @returns {ApiService[] | null} */
export function parseServicesListResponse(payload) {
  return parseServicesApiPayload(payload)?.services ?? null;
}

function servicesPathForPage(page) {
  return page <= 1 ? SERVICES_API_PATH : `${SERVICES_API_PATH}?page=${page}`;
}

/**
 * Fetches all pages when the API returns Laravel pagination (`meta.last_page`).
 * @returns {Promise<ServicesListResult>}
 */
export async function fetchServicesList() {
  /** @type {ApiService[]} */
  const all = [];
  let meta = null;
  let links = null;
  let page = 1;
  let lastPage = 1;

  do {
    const payload = await apiRequest(servicesPathForPage(page), { method: "GET" });
    const parsed = parseServicesApiPayload(payload);

    if (!parsed?.services) {
      throw new ApiError("Invalid services response from server.", { status: 0, data: payload });
    }

    all.push(...parsed.services);
    meta = parsed.meta ?? meta;
    links = parsed.links ?? links;
    lastPage = Math.max(1, Number(parsed.meta?.last_page) || 1);
    page += 1;
  } while (page <= lastPage);

  if (!all.length) {
    throw new ApiError("No services returned from server.", { status: 0, data: { data: all, meta } });
  }

  return { services: all, meta, links };
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
export function parseServiceDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.status === true && record.data && typeof record.data === "object") {
    return /** @type {Record<string, unknown>} */ (record.data);
  }

  if (record.data && typeof record.data === "object" && "id" in record.data) {
    return /** @type {Record<string, unknown>} */ (record.data);
  }

  if ("id" in record && "title" in record) {
    return record;
  }

  return null;
}

/**
 * GET /services/{slug} — full detail (variants, long_description, schedules).
 * @param {string} slug
 */
export async function fetchServiceBySlug(slug) {
  const encoded = encodeURIComponent(slug);
  const payload = await apiRequest(`${SERVICES_API_PATH}/${encoded}`, { method: "GET" });
  const data = parseServiceDetailResponse(payload);

  if (!data) {
    throw new ApiError("Invalid service detail response from server.", { status: 0, data: payload });
  }

  return data;
}
