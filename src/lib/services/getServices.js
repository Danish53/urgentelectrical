import {
  buildBookableServicesFromApi,
  DETAIL_SLUG_ALIASES,
  resolveServiceSlugFromApi,
} from "@/lib/services/buildBookableService";
import { buildBookableServiceFromDetailApi } from "@/lib/services/buildBookableServiceFromDetail";
import { getServiceCategories } from "@/lib/services/getServiceCategories";
import { resolveServiceDetailSlug } from "@/lib/services/resolveServiceDetailSlug";
import { serviceSlug } from "@/lib/slugs";
import { fetchServiceBySlug, fetchServicesList } from "@/services/servicesApiService";

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

async function loadServiceDetail(slug) {
  const [{ categoryMap }, api] = await Promise.all([getServiceCategories(), fetchServiceBySlug(slug)]);
  const service = buildBookableServiceFromDetailApi(api, categoryMap);
  const all = await getBookableServices();
  const related = getRelatedServicesFromList(service, all, 8);
  return { service, related };
}

/** Fetch one service by slug from GET /services/{slug}. */
export async function getServiceDetailBySlug(slug) {
  const normalized = String(slug ?? "").trim();
  if (!normalized) return null;

  try {
    return await loadServiceDetail(normalized);
  } catch {
    /* fall through — try resolving legacy / title-based slugs */
  }

  try {
    const { services: apiList } = await fetchServicesList();
    const resolved = resolveSlugForDetailRequest(normalized, apiList);
    if (resolved && resolved !== normalized) {
      return await loadServiceDetail(resolved);
    }
  } catch {
    /* no match */
  }

  const detailSlug = resolveServiceDetailSlug(normalized);
  if (detailSlug && detailSlug !== normalized) {
    try {
      return await loadServiceDetail(detailSlug);
    } catch {
      /* no match */
    }
  }

  return null;
}
