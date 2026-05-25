import { buildBookableServicesFromApi } from "@/lib/services/buildBookableService";
import { fetchServicesList } from "@/services/servicesApiService";

/**
 * Fetch bookable services (server or client). Returns [] if API fails.
 */
export async function getBookableServices() {
  try {
    const { services: apiList } = await fetchServicesList();
    if (apiList.length > 0) {
      return buildBookableServicesFromApi(apiList);
    }
  } catch {
    /* build/SSR: no static fallback */
  }
  return [];
}

export function getServiceBySlugFromList(slug, list) {
  return list.find((s) => s.slug === slug) ?? null;
}

export function getRelatedServicesFromList(service, list, limit = 3) {
  const same = list.filter((s) => s.slug !== service.slug && s.category === service.category);
  const other = list.filter((s) => s.slug !== service.slug && s.category !== service.category);
  return [...same, ...other].slice(0, limit);
}

export function getAllSlugsFromList(list) {
  return list.map((s) => s.slug);
}
