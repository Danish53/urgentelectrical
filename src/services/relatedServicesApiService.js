import { RELATED_SERVICES_API_PATH } from "@/constants/relatedServicesApi";
import { buildBookableServicesFromApi } from "@/lib/services/buildBookableService";
import { resolveServiceApiSlugCandidates } from "@/lib/services/resolveServiceDetailSlug";
import { parseServicesListResponse } from "@/services/servicesApiService";
import { apiRequest } from "@/lib/api/client";

/**
 * @param {unknown} payload
 * @returns {import("@/services/servicesApiService").ApiService[]}
 */
export function parseRelatedServicesResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);
  const list = parseServicesListResponse(payload);

  if (list?.length) {
    return list.filter((item) => item.is_active !== 0);
  }

  if (Array.isArray(record.data)) {
    return record.data
      .filter((item) => item && typeof item === "object")
      .filter((item) => /** @type {{ is_active?: number }} */ (item).is_active !== 0)
      .map((item) => /** @type {import("@/services/servicesApiService").ApiService} */ (item));
  }

  return [];
}

/**
 * @param {string} slug
 */
async function fetchRelatedServicesRaw(slug) {
  const encoded = encodeURIComponent(String(slug ?? "").trim());
  if (!encoded) return [];

  const payload = await apiRequest(`${RELATED_SERVICES_API_PATH}/${encoded}`, { method: "GET" });
  return parseRelatedServicesResponse(payload);
}

/**
 * Related bookable services for a service/page slug.
 * Tries resolved API slug variants; returns [] when the endpoint has no matches.
 * @param {string} slug
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 * @param {{ excludeSlug?: string, limit?: number }} [options]
 */
export async function fetchRelatedServices(slug, categoryMap = {}, options = {}) {
  const { excludeSlug = "", limit = 8 } = options;
  const exclude = new Set(
    resolveServiceApiSlugCandidates(excludeSlug || slug).map((s) => s.trim()).filter(Boolean)
  );

  for (const candidate of resolveServiceApiSlugCandidates(slug)) {
    try {
      const raw = await fetchRelatedServicesRaw(candidate);
      if (!raw.length) continue;

      const related = buildBookableServicesFromApi(raw, categoryMap).filter(
        (service) => !exclude.has(service.slug)
      );

      if (related.length) return related.slice(0, limit);
    } catch {
      /* try next slug candidate */
    }
  }

  return [];
}

/**
 * Sidebar link shape for informative /pages routes.
 * @param {string} slug
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 */
export async function fetchRelatedServiceLinks(slug, categoryMap = {}) {
  const services = await fetchRelatedServices(slug, categoryMap);
  return services.map((service) => ({
    slug: service.slug,
    label: service.name,
    href: service.href,
  }));
}
