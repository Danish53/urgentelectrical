import { slugify } from "@/lib/slugs";
import { SERVICE_API_SLUG_OVERRIDES } from "@/lib/services/resolveServiceDetailSlug";

/**
 * @param {Record<string, unknown>} api
 */
export function pickServiceSlugFromOrderApi(api) {
  const direct = api.service_slug ?? api.slug;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const service = api.service;
  if (service && typeof service === "object") {
    const row = /** @type {Record<string, unknown>} */ (service);
    const nested = row.slug ?? row.service_slug;
    if (typeof nested === "string" && nested.trim()) return nested.trim();
  }

  const items = api.order_items ?? api.items ?? api.line_items ?? api.services;
  if (Array.isArray(items) && items.length > 0) {
    const first = items[0];
    if (first && typeof first === "object") {
      const row = /** @type {Record<string, unknown>} */ (first);
      const slug = row.service_slug ?? row.slug;
      if (typeof slug === "string" && slug.trim()) return slug.trim();
    }
  }

  return "";
}

/**
 * Service detail URL for re-booking — never links straight to checkout.
 *
 * @param {{ serviceSlug?: string, serviceName?: string, raw?: Record<string, unknown> } | null | undefined} order
 */
export function getOrderServiceDetailHref(order) {
  let slug = String(order?.serviceSlug ?? "").trim();

  if (!slug && order?.raw && typeof order.raw === "object") {
    slug = pickServiceSlugFromOrderApi(order.raw);
  }

  if (!slug && order?.serviceName) {
    slug = slugify(order.serviceName);
  }

  if (slug) {
    const apiSlug = SERVICE_API_SLUG_OVERRIDES[slug] ?? slug;
    return `/services/${encodeURIComponent(apiSlug)}`;
  }

  return "/services";
}
