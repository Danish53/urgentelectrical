import { getApiSiteOrigin } from "@/lib/siteUrl";
import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import {
  resolveServiceDetailSlug,
  toPublicServiceSlug,
} from "@/lib/services/resolveServiceDetailSlug";

/** @returns {string} */
export function getSiteOrigin() {
  return getApiSiteOrigin();
}

/**
 * Bookable services live under /services; informative CMS pages under /pages.
 * @param {string} slug
 */
function hrefForMenuSlug(slug) {
  if (!slug) return "/pages";
  const detailKey = resolveServiceDetailSlug(slug);
  if (detailKey && SERVICE_DETAIL_EXTRA[detailKey]) {
    return `/services/${toPublicServiceSlug(detailKey)}`;
  }
  return `/pages/${slug}`;
}

/**
 * @param {Record<string, unknown>} record
 */
function pickMenuItemLabel(record) {
  const title = String(record.title ?? record.name ?? "Page").trim() || "Page";
  const displayName = record.page_display_name;

  if (displayName != null && String(displayName).trim()) {
    return String(displayName).trim();
  }

  return title;
}

/**
 * @param {unknown} child
 * @param {number} index
 */
function mapMenuChild(child, index) {
  const record = /** @type {Record<string, unknown>} */ (child ?? {});
  const slug = String(record.slug ?? "").trim();
  const label = pickMenuItemLabel(record);

  return {
    label,
    slug: slug || null,
    href: hrefForMenuSlug(slug),
    key: slug ? `${slug}-${index}` : `menu-item-${index}`,
  };
}

/**
 * @param {unknown} group
 * @param {number} groupIndex
 */
function mapMenuGroup(group, groupIndex) {
  const record = /** @type {Record<string, unknown>} */ (group ?? {});
  const label = String(record.title ?? record.name ?? "Menu").trim() || "Menu";
  const slug = String(record.slug ?? "").trim();
  const children = Array.isArray(record.children) ? record.children : [];

  return {
    label,
    slug: slug || `menu-group-${groupIndex}`,
    items: children.map((child, index) => mapMenuChild(child, index)),
  };
}

/**
 * @param {unknown} payload
 */
export function parseNavMenuResponse(payload) {
  if (!payload || typeof payload !== "object") return [];

  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && Array.isArray(record.data)) {
    return record.data.map((group, index) => mapMenuGroup(group, index));
  }

  if (Array.isArray(record.data)) {
    return record.data.map((group, index) => mapMenuGroup(group, index));
  }

  if (Array.isArray(payload)) {
    return payload.map((group, index) => mapMenuGroup(group, index));
  }

  return [];
}
