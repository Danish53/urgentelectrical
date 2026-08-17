import { SERVICES_SIMPLE_LIST_API_PATH } from "@/constants/servicesApi";
import { ApiError } from "@/lib/api/errors";
import { apiRequest } from "@/lib/api/client";

/**
 * @typedef {{ title: string, slug: string }} SimpleService
 */

/**
 * @param {unknown} payload
 * @returns {SimpleService[] | null}
 */
export function parseSimpleServicesListResponse(payload) {
  if (!payload || typeof payload !== "object") return null;

  const record = /** @type {Record<string, unknown>} */ (payload);
  const raw = Array.isArray(record.data) ? record.data : null;
  if (!raw) return null;

  const list = raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = /** @type {Record<string, unknown>} */ (item);
      const title = String(row.title ?? "").trim();
      const slug = String(row.slug ?? "").trim();
      if (!title || !slug) return null;
      return { title, slug };
    })
    .filter(Boolean);

  return list.length ? /** @type {SimpleService[]} */ (list) : null;
}

/**
 * @param {Pick<RequestInit, "cache"> & { next?: { revalidate?: number, tags?: string[] } }} [options]
 * @returns {Promise<SimpleService[]>}
 */
export async function fetchSimpleServicesList(options = {}) {
  const payload = await apiRequest(SERVICES_SIMPLE_LIST_API_PATH, { method: "GET", ...options });
  const list = parseSimpleServicesListResponse(payload);

  if (!list?.length) {
    throw new ApiError("Invalid simple services response from server.", { status: 0, data: payload });
  }

  return list;
}
