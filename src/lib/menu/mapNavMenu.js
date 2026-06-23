import { NAV_GROUPS } from "@/components/navData";
import { getApiSiteOrigin } from "@/lib/siteUrl";

/** @returns {string} */
export function getSiteOrigin() {
  return getApiSiteOrigin();
}

/**
 * @param {unknown} child
 * @param {number} index
 */
function mapMenuChild(child, index) {
  const record = /** @type {Record<string, unknown>} */ (child ?? {});
  const slug = String(record.slug ?? "").trim();
  const label = String(record.title ?? record.name ?? "Page").trim() || "Page";

  return {
    label,
    slug: slug || null,
    href: slug ? `/pages/${slug}` : "/pages",
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

export function getFallbackNavGroups() {
  return NAV_GROUPS.map((group) => ({
    ...group,
    slug: group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    items: group.items.map((item, index) => ({
      ...item,
      key: item.slug ? `${item.slug}-${index}` : `fallback-${index}`,
    })),
  }));
}
