import { slugify } from "@/lib/slugs";
import { guessLocationSlug } from "@/lib/locations/resolveLocationSlug";

/**
 * Display labels for "Areas we cover" on other-service detail pages.
 * Keys that need a different CMS location slug go in AREA_LOCATION_SLUG_OVERRIDES.
 */
export const SERVICE_AREAS = [
  "Nottingham City Centre",
  "Arnold",
  "Beeston",
  "West Bridgford",
  "Hucknall",
  "Gedling",
  "Carlton",
  "Mapperley",
  "Long Eaton",
  "Stapleford",
  "Ilkeston",
  "Eastwood",
];

/**
 * Static display name → CMS `/locations/{slug}` when slugify(name) does not match API.
 * Confirmed against portal locations API.
 */
export const AREA_LOCATION_SLUG_OVERRIDES = {
  "Nottingham City Centre": "nottingham",
  /**
   * Portal currently has no "Long Eaton" location row (`/locations/long-eaton` 404).
   * Use the nearest live CMS area until Long Eaton is published, or replace with the real slug.
   */
  "Long Eaton": "breaston",
};

/**
 * @param {string} areaName
 * @returns {string}
 */
export function getAreaLocationSlug(areaName) {
  const name = String(areaName ?? "").trim();
  if (!name) return "";

  const override = AREA_LOCATION_SLUG_OVERRIDES[name];
  if (override) return override;

  // Strips trailing "City Centre" so "Nottingham City Centre" → "nottingham"
  const guessed = guessLocationSlug(name);
  if (guessed) return guessed;

  return slugify(name);
}

/**
 * @param {string} areaName
 * @returns {string}
 */
export function getAreaLocationHref(areaName) {
  const slug = getAreaLocationSlug(areaName);
  return slug ? `/locations/${slug}` : "/locations";
}
