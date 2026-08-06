import { NEARBY_SETTLEMENT_PINS } from "@/data/locationCoordinates";
import { haversineKm } from "@/lib/geo/haversine";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";

/**
 * Closest named settlements from the local East Midlands pin set.
 * Always available (no external API) and accurate by map distance.
 *
 * @param {{ lat: number, lng: number, excludeName?: string, limit?: number, maxKm?: number }} input
 * @returns {{ name: string, placeId: string, lat: number, lng: number, km: number }[]}
 */
export function nearbyFromKnownPins(input) {
  const lat = Number(input.lat);
  const lng = Number(input.lng);
  const limit = Math.max(1, Math.min(input.limit ?? 8, 20));
  const maxKm = Math.max(2, Math.min(input.maxKm ?? 18, 40));
  const exclude = normalizeLocationName(input.excludeName ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  /** @type {Map<string, { name: string, placeId: string, lat: number, lng: number, km: number }>} */
  const byKey = new Map();

  for (const pin of NEARBY_SETTLEMENT_PINS) {
    const name = String(pin.name ?? "").trim();
    if (!name || /City Centre$/i.test(name)) continue;

    const key = normalizeLocationName(name);
    if (!key || (exclude && key === exclude)) continue;
    if (exclude && exclude.startsWith("attenboro") && key === "attenborough") continue;

    const km = haversineKm({ lat, lng }, { lat: pin.lat, lng: pin.lng });
    if (!Number.isFinite(km) || km < 0.25 || km > maxKm) continue;

    const existing = byKey.get(key);
    if (existing && existing.km <= km) continue;

    byKey.set(key, {
      name,
      placeId: `pin:${key}`,
      lat: pin.lat,
      lng: pin.lng,
      km,
    });
  }

  return Array.from(byKey.values())
    .sort((a, b) => a.km - b.km || a.name.localeCompare(b.name))
    .slice(0, limit);
}
