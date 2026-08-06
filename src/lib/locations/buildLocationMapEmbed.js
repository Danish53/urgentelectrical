import { NEARBY_SETTLEMENT_PINS } from "@/data/locationCoordinates";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";

/**
 * @param {unknown} value
 * @returns {number | null}
 */
function toCoord(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number.parseFloat(value.replace(/,/g, "."));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * @param {Record<string, unknown> | null | undefined} root
 * @returns {{ lat: number, lng: number } | null}
 */
export function readLocationCoordinates(root) {
  if (!root || typeof root !== "object") return null;

  const nested =
    root.coordinates && typeof root.coordinates === "object" && !Array.isArray(root.coordinates)
      ? /** @type {Record<string, unknown>} */ (root.coordinates)
      : null;

  const lat = toCoord(
    root.latitude ?? root.lat ?? root.map_lat ?? nested?.latitude ?? nested?.lat
  );
  const lng = toCoord(
    root.longitude ??
      root.lng ??
      root.lon ??
      root.map_lng ??
      nested?.longitude ??
      nested?.lng ??
      nested?.lon
  );

  if (lat == null || lng == null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

/**
 * @param {string} name
 * @returns {{ lat: number, lng: number } | null}
 */
function findKnownPin(name) {
  const normalized = normalizeLocationName(name);
  if (!normalized) return null;
  const lookup = normalized.startsWith("attenboro") ? "attenborough" : normalized;

  for (const pin of NEARBY_SETTLEMENT_PINS) {
    const pinName = normalizeLocationName(pin.name.replace(/\s+City\s+Centre$/i, ""));
    if (pinName === lookup) return { lat: pin.lat, lng: pin.lng };
  }
  return null;
}

/**
 * Human place label for Google Maps (never slug-like strings).
 * @param {{ name?: string, cityName?: string, slug?: string }} input
 */
export function buildLocationMapQuery(input = {}) {
  const rawName = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();
  const slug = String(input.slug ?? "").trim();

  let place = rawName
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  const looksLikeSlug =
    Boolean(place) &&
    (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(place) ||
      (slug && place.toLowerCase() === slug.toLowerCase()));

  if (looksLikeSlug) {
    place = place
      .replace(/^electrician[s]?-/i, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  }

  // Drop marketing prefixes like "Electricians Derby"
  place = place.replace(/^electricians?\s+/i, "").trim() || place;

  if (!place && cityName) place = cityName;
  if (!place) return "East Midlands, UK";

  const parts = [place];
  if (cityName && normalizeLocationName(cityName) !== normalizeLocationName(place)) {
    parts.push(cityName);
  }
  parts.push("UK");
  return parts.join(", ");
}

/**
 * Resolve map coordinates for the opened location only.
 * @param {{
 *   name?: string,
 *   cityName?: string,
 *   slug?: string,
 *   lat?: number | null,
 *   lng?: number | null,
 * }} input
 * @returns {{ lat: number, lng: number, query: string } | null}
 */
export function resolveLocationMapPoint(input = {}) {
  const placeName = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();
  const query = buildLocationMapQuery({
    name: placeName,
    cityName,
    slug: input.slug,
  });

  const fromInput =
    input.lat != null && input.lng != null
      ? { lat: Number(input.lat), lng: Number(input.lng) }
      : null;

  const knownPlace = findKnownPin(placeName);
  const openedIsCity =
    Boolean(placeName) &&
    Boolean(cityName) &&
    normalizeLocationName(placeName) === normalizeLocationName(cityName);
  const knownCity = openedIsCity ? findKnownPin(cityName) : null;
  const coords = fromInput || knownPlace || knownCity;

  if (!coords) return { lat: null, lng: null, query };
  return { lat: coords.lat, lng: coords.lng, query };
}

/**
 * Google Maps embed URL pinned on the opened location only.
 * Never falls back to the parent city pin (e.g. Arnold must not show Nottingham).
 *
 * @param {{
 *   name?: string,
 *   cityName?: string,
 *   slug?: string,
 *   lat?: number | null,
 *   lng?: number | null,
 *   zoom?: number,
 * }} input
 */
export function buildLocationMapEmbed(input = {}) {
  const zoom = Number.isFinite(input.zoom) ? Number(input.zoom) : 14;
  const point = resolveLocationMapPoint(input);

  if (point?.lat != null && point?.lng != null) {
    return `https://maps.google.com/maps?q=${point.lat},${point.lng}&hl=en&z=${zoom}&output=embed`;
  }

  const query = point?.query || buildLocationMapQuery(input);
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=${zoom}&output=embed`;
}
