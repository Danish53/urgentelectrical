import {
  buildBookableServicesFromApi,
  DETAIL_SLUG_ALIASES,
  resolveServiceSlugFromApi,
} from "@/lib/services/buildBookableService";
import { buildBookableServiceFromDetailApi } from "@/lib/services/buildBookableServiceFromDetail";
import { getServiceCategories } from "@/lib/services/getServiceCategories";
import {
  resolveServiceApiSlugCandidates,
  resolveServiceDetailSlug,
} from "@/lib/services/resolveServiceDetailSlug";
import { serviceSlug } from "@/lib/slugs";
import { fetchServiceBySlug, fetchServicesList } from "@/services/servicesApiService";
import { fetchRelatedServices } from "@/services/relatedServicesApiService";

const RELATED_FETCH_TIMEOUT_MS = 2500;

/**
 * Fetch bookable services (server or client). Returns [] if API fails.
 */
export async function getBookableServices() {
  try {
    const [{ services: apiList }, { categoryMap }] = await Promise.all([
      fetchServicesList(),
      getServiceCategories(),
    ]);
    if (apiList.length > 0) {
      return buildBookableServicesFromApi(apiList, categoryMap);
    }
  } catch {
    /* build/SSR: no static fallback */
  }
  return [];
}

export { getServiceCategories };

export function getServiceBySlugFromList(slug, list) {
  return list.find((s) => s.slug === slug) ?? null;
}

export function getRelatedServicesFromList(service, list, limit = 8) {
  return list
    .filter((s) => {
      if (s.slug === service.slug) return false;
      if (service.serviceCategoryId != null && s.serviceCategoryId != null) {
        return s.serviceCategoryId === service.serviceCategoryId;
      }
      return s.category === service.category;
    })
    .slice(0, limit);
}

export function getAllSlugsFromList(list) {
  return list.map((s) => s.slug);
}

/**
 * When the URL slug was generated from title (legacy) but the API uses a different slug.
 * @param {string} requestedSlug
 * @param {import("@/services/servicesApiService").ApiService[]} apiList
 */
function resolveSlugForDetailRequest(requestedSlug, apiList) {
  const normalized = requestedSlug.trim();
  if (!normalized) return null;

  const alias = DETAIL_SLUG_ALIASES[normalized];

  const match = apiList.find((item) => {
    const apiSlug = resolveServiceSlugFromApi(item);
    const generated = serviceSlug(String(item.title ?? "").trim() || "Electrical service");
    return (
      apiSlug === normalized ||
      generated === normalized ||
      (alias && (apiSlug === alias || generated === alias))
    );
  });

  return match ? resolveServiceSlugFromApi(match) : null;
}

/**
 * @param {import("@/lib/services/buildBookableServiceFromDetail").ReturnType<typeof buildBookableServiceFromDetailApi>} service
 * @param {Awaited<ReturnType<typeof getServiceCategories>>["categoryMap"]} categoryMap
 */
async function fetchRelatedWithTimeout(service, categoryMap) {
  try {
    const related = await Promise.race([
      fetchRelatedServices(service.slug, categoryMap, {
        excludeSlug: service.slug,
        limit: 8,
      }),
      new Promise((resolve) => {
        setTimeout(() => resolve([]), RELATED_FETCH_TIMEOUT_MS);
      }),
    ]);
    return Array.isArray(related) ? related : [];
  } catch {
    return [];
  }
}

async function loadServiceDetail(slug) {
  const [{ categoryMap }, api] = await Promise.all([getServiceCategories(), fetchServiceBySlug(slug)]);
  const service = buildBookableServiceFromDetailApi(api, categoryMap);
  const related = await fetchRelatedWithTimeout(service, categoryMap);

  return { service, related };
}

function uniqueSlugCandidates(slug) {
  const normalized = String(slug ?? "").trim();
  if (!normalized) return [];

  const fromResolver = resolveServiceApiSlugCandidates(normalized);
  const detailSlug = resolveServiceDetailSlug(normalized);
  const merged = [...fromResolver, normalized];

  if (detailSlug && detailSlug !== normalized) {
    merged.push(detailSlug, ...resolveServiceApiSlugCandidates(detailSlug));
  }

  return merged.filter((value, index, list) => value && list.indexOf(value) === index);
}

/** Fetch one service by slug from GET /services/{slug}. */
export async function getServiceDetailBySlug(slug) {
  const normalized = String(slug ?? "").trim();
  if (!normalized) return null;

  for (const candidate of uniqueSlugCandidates(normalized)) {
    try {
      return await loadServiceDetail(candidate);
    } catch {
      continue;
    }
  }

  try {
    const { services: apiList } = await fetchServicesList();
    const resolved = resolveSlugForDetailRequest(normalized, apiList);
    if (resolved) {
      return await loadServiceDetail(resolved);
    }
  } catch {
    /* no match */
  }

  return null;
}
