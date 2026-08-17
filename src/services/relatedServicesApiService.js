import { RELATED_SERVICES_API_PATH } from "@/constants/relatedServicesApi";
import { SERVICES_API_PATH } from "@/constants/servicesApi";
import { buildBookableServicesFromApi } from "@/lib/services/buildBookableService";
import {
  resolveServiceApiSlugCandidates,
  resolveServiceDetailSlug,
} from "@/lib/services/resolveServiceDetailSlug";
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
 * Prefer real service slug candidates first (pages marketing slugs often 400).
 * Never invent slugs — only reorder API/resolution candidates.
 * @param {string} slug
 */
function relatedLookupCandidates(slug) {
  const trimmed = String(slug ?? "").trim();
  if (!trimmed) return [];

  const resolved = resolveServiceDetailSlug(trimmed);
  const all = resolveServiceApiSlugCandidates(trimmed);
  const ordered = [];
  const seen = new Set();

  for (const candidate of [resolved, ...all]) {
    const key = String(candidate ?? "").trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    ordered.push(key);
  }

  return ordered;
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
 * Confirm the slug is a live bookable service (avoids sidebar 404s).
 * @param {string} slug
 */
async function liveServiceSlugExists(slug) {
  const trimmed = String(slug ?? "").trim();
  if (!trimmed) return false;

  try {
    await apiRequest(`${SERVICES_API_PATH}/${encodeURIComponent(trimmed)}`, { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

/**
 * Keep only API rows that have a real slug and exist on GET /services/{slug}.
 * @param {import("@/services/servicesApiService").ApiService[]} raw
 */
async function filterLiveRelatedApiServices(raw) {
  const withSlug = (Array.isArray(raw) ? raw : []).filter((item) => {
    const slug = String(item?.slug ?? "").trim();
    if (!slug) return false;
    // CRM / placeholder rows from related-services are not public service pages.
    if (/^crm-/i.test(slug)) return false;
    const display = String(item?.service_display_name ?? "").trim();
    if (display === ".") return false;
    return true;
  });

  const checks = await Promise.all(
    withSlug.map(async (item) => {
      const slug = String(item.slug).trim();
      const ok = await liveServiceSlugExists(slug);
      return ok ? item : null;
    })
  );

  return checks.filter(Boolean);
}

/**
 * Related bookable services for a service/page slug.
 * Uses API slugs only — drops entries that would 404 on /services/{slug}.
 * @param {string} slug
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 * @param {{ excludeSlug?: string, limit?: number }} [options]
 */
export async function fetchRelatedServices(slug, categoryMap = {}, options = {}) {
  const { excludeSlug = "", limit = 8 } = options;
  const exclude = new Set(relatedLookupCandidates(excludeSlug || slug));

  for (const candidate of relatedLookupCandidates(slug)) {
    try {
      const raw = await fetchRelatedServicesRaw(candidate);
      if (!raw.length) continue;

      const liveRaw = await filterLiveRelatedApiServices(raw);
      if (!liveRaw.length) continue;

      const related = buildBookableServicesFromApi(liveRaw, categoryMap).filter((service) => {
        const serviceSlug = String(service.slug ?? "").trim();
        if (!serviceSlug) return false;
        if (exclude.has(serviceSlug)) return false;
        // href must use the API slug only
        return service.href === `/services/${serviceSlug}`;
      });

      if (related.length) return related.slice(0, limit);
    } catch {
      /* try next slug candidate */
    }
  }

  return [];
}

/**
 * Sidebar link shape for informative /pages routes — API slugs only, no dummy links.
 * @param {string} slug
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 */
export async function fetchRelatedServiceLinks(slug, categoryMap = {}) {
  const services = await fetchRelatedServices(slug, categoryMap);
  return services.map((service) => {
    const apiSlug = String(service.slug ?? "").trim();
    return {
      slug: apiSlug,
      label: service.name,
      href: `/services/${apiSlug}`,
    };
  });
}
