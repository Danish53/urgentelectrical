/**
 * @param {string} name
 */
export function normalizeLocationName(name) {
  return String(name ?? "")
    .toLowerCase()
    .replace(/\s+city\s+centre$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} name
 */
export function guessLocationSlug(name) {
  return normalizeLocationName(name).replace(/\s+/g, "-");
}

/**
 * @param {string} pinName
 * @param {Array<{ areaName: string, slug: string }>} locations
 * @returns {string} Live slug when matched; otherwise "" (do not invent 404 URLs)
 */
export function resolveLocationSlugForPin(pinName, locations) {
  const normalizedPin = normalizeLocationName(pinName);
  if (!normalizedPin) return "";

  for (const location of locations) {
    const normalizedArea = normalizeLocationName(location.areaName);
    if (normalizedArea === normalizedPin) {
      return location.slug;
    }
  }

  for (const location of locations) {
    const normalizedArea = normalizeLocationName(location.areaName);
    if (normalizedArea.includes(normalizedPin) || normalizedPin.includes(normalizedArea)) {
      return location.slug;
    }
  }

  return "";
}
