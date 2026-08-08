import { unstable_cache } from "next/cache";
import { buildLocationMapQuery } from "@/lib/locations/buildLocationMapEmbed";
import { geocodeLocationLabel } from "@/lib/locations/geocodeLocation";
import {
  getGoogleMapsApiKey,
  googleGeocodeAddress,
  googleNearbyLocalities,
} from "@/lib/locations/googleMapsNearby";
import { getLocationSlugIndex, lookupLocationSlug } from "@/lib/locations/locationSlugIndex";
import { resolveOpenedLocationCoords, shortAreaName } from "@/lib/locations/locationGeoIndex";
import { nearbyFromKnownPins } from "@/lib/locations/nearbyFromKnownPins";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";
import { overpassNearbyPlaces } from "@/lib/locations/overpassNearby";

/**
 * @param {string} name
 */
function slugifyNearby(name) {
  return (
    String(name ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "nearby"
  );
}

/**
 * @param {{ name: string, placeId: string, lat: number, lng: number, km: number }[]} places
 * @param {{ name: string, placeId: string, lat: number, lng: number, km: number }[]} extra
 */
function mergePlaces(places, extra) {
  const seen = new Set(places.map((p) => normalizeLocationName(p.name)));
  const out = [...places];
  for (const row of extra) {
    const key = normalizeLocationName(row.name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

/**
 * @param {{
 *   currentSlug: string,
 *   currentName: string,
 *   cityName: string,
 *   lat: number | null,
 *   lng: number | null,
 *   apiData?: Record<string, unknown> | null,
 *   limit: number,
 * }} input
 */
async function computeAccurateNearby(input) {
  const currentSlug = String(input.currentSlug ?? "").trim();
  const currentName = String(input.currentName ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();
  const limit = Math.max(1, Math.min(input.limit ?? 9, 12));
  const shortName = shortAreaName(currentName) || currentName;
  const currentKey = normalizeLocationName(shortName);

  const apiKey = getGoogleMapsApiKey();
  const mapQuery = buildLocationMapQuery({
    name: shortName,
    cityName,
    slug: currentSlug,
  });

  /** @type {{ lat: number, lng: number } | null} */
  let origin = null;

  if (
    typeof input.lat === "number" &&
    typeof input.lng === "number" &&
    Number.isFinite(input.lat) &&
    Number.isFinite(input.lng)
  ) {
    origin = { lat: input.lat, lng: input.lng };
  }

  // Prefer free pin / CMS resolution before billed Google Geocoding.
  if (!origin) {
    origin = await resolveOpenedLocationCoords({
      name: shortName,
      cityName,
      slug: currentSlug,
      apiData: input.apiData ?? null,
      lat: input.lat,
      lng: input.lng,
    });
  }

  if (!origin && apiKey) {
    const g = await googleGeocodeAddress(mapQuery, apiKey);
    if (g) origin = { lat: g.lat, lng: g.lng };
  }

  if (!origin) {
    origin = await geocodeLocationLabel({
      name: shortName,
      cityName,
      slug: currentSlug,
    });
  }

  if (!origin) return [];

  // 1) Free accurate pins first (most East Midlands pages need no Places bill).
  /** @type {{ name: string, placeId: string, lat: number, lng: number, km: number }[]} */
  let places = nearbyFromKnownPins({
    lat: origin.lat,
    lng: origin.lng,
    excludeName: shortName,
    limit: limit + 10,
    maxKm: 16,
  });

  // 2) Google Places only if pins are short — max 1 Nearby Search per page.
  if (apiKey && places.length < limit) {
    const googlePlaces = await googleNearbyLocalities({
      lat: origin.lat,
      lng: origin.lng,
      apiKey,
      limit: limit + 4,
    });
    places = mergePlaces(places, googlePlaces);
  }

  // 3) Free OSM fill if still short.
  if (places.length < limit) {
    try {
      const osm = await Promise.race([
        overpassNearbyPlaces({
          lat: origin.lat,
          lng: origin.lng,
          radiusM: 15000,
          limit: limit + 8,
        }),
        new Promise((resolve) => setTimeout(() => resolve([]), 9000)),
      ]);
      places = mergePlaces(places, Array.isArray(osm) ? osm : []);
    } catch {
      /* keep whatever we have */
    }
  }

  places = places
    .filter((p) => {
      const key = normalizeLocationName(p.name);
      if (!key) return false;
      if (currentKey && key === currentKey) return false;
      if (currentKey && key.includes(currentKey) && Math.abs(key.length - currentKey.length) < 3) {
        return false;
      }
      return true;
    })
    .sort((a, b) => a.km - b.km || a.name.localeCompare(b.name));

  const index = await getLocationSlugIndex();

  /** @type {{ name: string, slug: string, href: string, hasCmsPage: boolean }[]} */
  const out = [];
  const seenOut = new Set();

  for (const place of places) {
    if (out.length >= limit) break;
    const key = normalizeLocationName(place.name);
    if (!key || seenOut.has(key)) continue;
    seenOut.add(key);

    const cmsSlug =
      lookupLocationSlug(place.name, index) ||
      lookupLocationSlug(shortAreaName(place.name), index);
    if (cmsSlug && cmsSlug === currentSlug) continue;

    out.push({
      name: place.name,
      slug: cmsSlug || `nearby-${slugifyNearby(place.name)}`,
      href: cmsSlug ? `/locations/${cmsSlug}` : "/locations",
      hasCmsPage: Boolean(cmsSlug),
    });
  }

  return out;
}

/**
 * Nearby areas for location detail — map distance, 9 closest.
 * Bill control: pins first; Google Places at most once; long cache.
 *
 * @param {{
 *   currentSlug: string,
 *   currentName?: string | null,
 *   cityName?: string | null,
 *   lat?: number | null,
 *   lng?: number | null,
 *   apiData?: Record<string, unknown> | null,
 *   limit?: number,
 * }} options
 */
export async function fetchAccurateNearbyAreas(options) {
  const currentSlug = String(options.currentSlug ?? "").trim();
  const currentName = String(options.currentName ?? "").trim();
  const cityName = String(options.cityName ?? "").trim();
  const limit = Math.max(1, Math.min(options.limit ?? 9, 12));
  const lat =
    typeof options.lat === "number" && Number.isFinite(options.lat) ? options.lat : null;
  const lng =
    typeof options.lng === "number" && Number.isFinite(options.lng) ? options.lng : null;

  if (!currentSlug) return [];

  const run = () =>
    computeAccurateNearby({
      currentSlug,
      currentName,
      cityName,
      lat,
      lng,
      apiData: options.apiData ?? null,
      limit,
    });

  const latKey = lat != null ? lat.toFixed(3) : "x";
  const lngKey = lng != null ? lng.toFixed(3) : "x";
  const cached = unstable_cache(run, ["accurate-nearby-v4", currentSlug, String(limit), latKey, lngKey], {
    revalidate: 604800, // 7 days — avoid re-billing the same area
  });

  return cached();
}
