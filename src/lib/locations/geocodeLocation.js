import { unstable_cache } from "next/cache";
import { buildLocationMapQuery } from "@/lib/locations/buildLocationMapEmbed";

/**
 * @param {string} query
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
async function nominatimSearch(query) {
  const q = String(query ?? "").trim();
  if (!q) return null;

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=gb&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "UrgentElectricalWebsite/1.0 (nearby areas; contact@urgentelectrical.services)",
    },
    next: { revalidate: 604800 },
  });

  if (!res.ok) return null;
  const rows = await res.json();
  const first = Array.isArray(rows) ? rows[0] : null;
  const lat = Number.parseFloat(first?.lat);
  const lng = Number.parseFloat(first?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

/**
 * Cached geocode for a UK place label (1 week).
 * @param {string} query
 */
export const geocodeUkPlace = unstable_cache(
  async (query) => nominatimSearch(query),
  ["geocode-uk-place-v1"],
  { revalidate: 604800 }
);

/**
 * Progressive geocode attempts for a location label.
 * @param {{ name?: string | null, cityName?: string | null, slug?: string | null, quick?: boolean }} input
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
export async function geocodeLocationLabel(input = {}) {
  const name = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();
  const slug = String(input.slug ?? "").trim();
  const quick = Boolean(input.quick);

  /** @type {string[]} */
  const candidates = [];
  const push = (value) => {
    const v = String(value ?? "").trim();
    if (v && !candidates.includes(v)) candidates.push(v);
  };

  if (quick) {
    if (name && cityName) push(`${name}, ${cityName}, UK`);
    if (name) push(`${name}, UK`);
  } else {
    push(buildLocationMapQuery({ name, cityName, slug }));
    if (name) {
      push(`${name}, UK`);
      if (cityName) push(`${name}, ${cityName}, UK`);
    }
  }

  const list = candidates.slice(0, quick ? 2 : 4);
  for (let i = 0; i < list.length; i += 1) {
    const hit = await geocodeUkPlace(list[i]);
    if (hit) return hit;
    if (i < list.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, quick ? 50 : 150));
    }
  }

  return null;
}
