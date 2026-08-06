import { haversineKm } from "@/lib/geo/haversine";

/**
 * Nearby towns/villages/suburbs from OpenStreetMap Overpass (no API key).
 * Accurate geographic neighbours for the opened map point.
 *
 * @param {{ lat: number, lng: number, radiusM?: number, limit?: number }} input
 * @returns {Promise<{ name: string, placeId: string, lat: number, lng: number, km: number }[]>}
 */
export async function overpassNearbyPlaces(input) {
  const lat = Number(input.lat);
  const lng = Number(input.lng);
  const radiusM = Math.max(1000, Math.min(input.radiusM ?? 12000, 25000));
  const limit = Math.max(1, Math.min(input.limit ?? 8, 20));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const query = `
[out:json][timeout:25];
(
  node["place"~"^(city|town|village|suburb|hamlet|neighbourhood|neighborhood)$"](around:${radiusM},${lat},${lng});
  way["place"~"^(city|town|village|suburb|hamlet)$"](around:${radiusM},${lat},${lng});
);
out center ${Math.max(limit * 4, 40)};
`.trim();

  const endpoints = [
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
  ];

  /** @type {any} */
  let data = null;
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "application/json",
          "User-Agent": "UrgentElectricalWebsite/1.0 (nearby areas; contact@urgentelectrical.services)",
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 86400 },
      });
      if (!res.ok) continue;
      const text = await res.text();
      if (!text || text.trimStart().startsWith("<")) continue;
      data = JSON.parse(text);
      if (data) break;
    } catch {
      /* try next endpoint */
    }
  }

  const elements = Array.isArray(data?.elements) ? data.elements : [];
  /** @type {Map<string, { name: string, placeId: string, lat: number, lng: number, km: number }>} */
  const byKey = new Map();

  for (const el of elements) {
    const name = String(el?.tags?.name ?? "").trim();
    if (!name) continue;

    const plat = Number(el?.lat ?? el?.center?.lat);
    const plng = Number(el?.lon ?? el?.center?.lon);
    if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;

    const key = name.toLowerCase();
    if (byKey.has(key)) continue;

    const km = haversineKm({ lat, lng }, { lat: plat, lng: plng });
    if (!Number.isFinite(km) || km < 0.15) continue; // skip the opened place itself

    byKey.set(key, {
      name,
      placeId: String(el?.id ?? key),
      lat: plat,
      lng: plng,
      km,
    });
  }

  return Array.from(byKey.values())
    .sort((a, b) => a.km - b.km || a.name.localeCompare(b.name))
    .slice(0, limit);
}
