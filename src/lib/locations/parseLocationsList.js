/**
 * @typedef {{
 *   areaName: string,
 *   slug: string,
 *   mainTitle: string,
 *   href: string,
 * }} LocationListItem
 */

/**
 * @typedef {{
 *   currentPage: number,
 *   lastPage: number,
 *   total: number,
 *   perPage: number,
 *   from: number,
 *   to: number,
 * }} LocationsPagination
 */

/**
 * @param {Record<string, unknown>} row
 * @returns {LocationListItem | null}
 */
export function mapLocationListItem(row) {
  const areaName = String(row.area_name ?? row.areaName ?? "").trim();
  const slug = String(row.slug ?? "").trim();
  if (!areaName || !slug) return null;

  const mainTitle = String(row.main_title ?? row.mainTitle ?? `Emergency Electrician in ${areaName}`).trim();

  return {
    areaName,
    slug,
    mainTitle,
    href: `/locations/${slug}`,
  };
}

/**
 * @param {unknown} payload
 * @returns {{ locations: LocationListItem[], pagination: LocationsPagination | null }}
 */
export function parseLocationsListPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { locations: [], pagination: null };
  }

  const record = /** @type {Record<string, unknown>} */ (payload);
  const rows = Array.isArray(record.data) ? record.data : [];

  const locations = rows
    .map((row) => mapLocationListItem(/** @type {Record<string, unknown>} */ (row)))
    .filter(Boolean);

  const currentPage = Number(record.current_page);
  const lastPage = Number(record.last_page);

  if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) {
    return { locations, pagination: null };
  }

  const total = Number(record.total);
  const perPage = Number(record.per_page);
  const from = Number(record.from);
  const to = Number(record.to);
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : locations.length;
  const safeTotal = Number.isFinite(total) ? total : locations.length;
  const safeFrom = Number.isFinite(from) ? from : (currentPage - 1) * safePerPage + 1;
  const safeTo = Number.isFinite(to) ? to : safeFrom + Math.max(locations.length, 1) - 1;

  return {
    locations,
    pagination: {
      currentPage,
      lastPage,
      total: safeTotal,
      perPage: safePerPage,
      from: safeFrom,
      to: safeTo,
    },
  };
}
