/**
 * @param {import("@/lib/locations/parseLocationsList").LocationListItem} location
 * @param {string} query
 */
export function matchesLocationSearch(location, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [location.areaName, location.mainTitle, location.slug]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}
