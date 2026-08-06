import { haversineKm } from "@/lib/geo/haversine";

/**
 * @returns {string}
 */
export function getGoogleMapsApiKey() {
  return (
    String(process.env.GOOGLE_MAPS_API_KEY ?? "").trim() ||
    String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim()
  );
}

/**
 * @param {string} address
 * @param {string} apiKey
 * @returns {Promise<{ lat: number, lng: number, label: string } | null>}
 */
export async function googleGeocodeAddress(address, apiKey) {
  const q = String(address ?? "").trim();
  if (!q || !apiKey) return null;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&region=uk&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 604800 } });
  if (!res.ok) return null;

  const data = await res.json();
  if (data?.status !== "OK" || !Array.isArray(data.results) || !data.results[0]) return null;

  const first = data.results[0];
  const lat = Number(first?.geometry?.location?.lat);
  const lng = Number(first?.geometry?.location?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return {
    lat,
    lng,
    label: String(first?.formatted_address ?? q),
  };
}

const AREA_TYPES = new Set([
  "locality",
  "sublocality",
  "sublocality_level_1",
  "sublocality_level_2",
  "sublocality_level_3",
  "neighborhood",
  "postal_town",
]);

/**
 * @param {Map<string, { name: string, placeId: string, lat: number, lng: number, km: number }>} byKey
 * @param {any[]} results
 * @param {{ lat: number, lng: number }} origin
 */
function ingestPlaceResults(byKey, results, origin) {
  for (const row of results) {
    const name = String(row?.name ?? "").trim();
    const placeId = String(row?.place_id ?? "").trim();
    const plat = Number(row?.geometry?.location?.lat);
    const plng = Number(row?.geometry?.location?.lng);
    if (!name || !Number.isFinite(plat) || !Number.isFinite(plng)) continue;

    const types = Array.isArray(row?.types) ? row.types.map(String) : [];
    // Only real area types — never cafes/hotels from loose text search.
    if (!types.some((t) => AREA_TYPES.has(t))) continue;

    const key = name.toLowerCase();
    if (byKey.has(key)) continue;

    const km = haversineKm(origin, { lat: plat, lng: plng });
    if (!Number.isFinite(km) || km < 0.2) continue;

    byKey.set(key, {
      name,
      placeId: placeId || key,
      lat: plat,
      lng: plng,
      km,
    });
  }
}

/**
 * Nearby localities/suburbs via Google Places Nearby Search.
 * @param {{ lat: number, lng: number, apiKey: string, limit?: number }} input
 * @returns {Promise<{ name: string, placeId: string, lat: number, lng: number, km: number }[]>}
 */
export async function googleNearbyLocalities(input) {
  const apiKey = String(input.apiKey ?? "").trim();
  const lat = Number(input.lat);
  const lng = Number(input.lng);
  const limit = Math.max(1, Math.min(input.limit ?? 8, 16));
  if (!apiKey || !Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const origin = { lat, lng };
  /** @type {Map<string, { name: string, placeId: string, lat: number, lng: number, km: number }>} */
  const byKey = new Map();

  const nearbyTypes = ["locality", "sublocality", "neighborhood", "postal_town"];
  for (const type of nearbyTypes) {
    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=${lat},${lng}` +
      `&radius=15000` +
      `&type=${encodeURIComponent(type)}` +
      `&key=${encodeURIComponent(apiKey)}`;

    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.status !== "OK" && data?.status !== "ZERO_RESULTS") continue;
      ingestPlaceResults(byKey, Array.isArray(data?.results) ? data.results : [], origin);
    } catch {
      /* try next type */
    }

    if (byKey.size >= limit * 2) break;
  }

  return Array.from(byKey.values())
    .sort((a, b) => a.km - b.km || a.name.localeCompare(b.name))
    .slice(0, limit);
}
