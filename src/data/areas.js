import { slugify } from "@/lib/slugs";
import { guessLocationSlug } from "@/lib/locations/resolveLocationSlug";

/**
 * Display labels for "Areas we cover" on service / other-service detail pages.
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
 * Static display name → CMS `/locations/{slug}`.
 * Use `null` when the portal has no published location row (avoid inventing a 404 slug).
 */
export const AREA_LOCATION_SLUG_OVERRIDES = {
  "Nottingham City Centre": "nottingham",
  "Derby City Centre": "derby",
  "Leicester City Centre": "leicester",
  Arnold: "electrician-arnold-nottingham",
  "Long Eaton": null,
  Sandiacre: null,
  Spondon: null,
  Mickleover: null,
};

/**
 * @param {string} areaName
 * @returns {string} CMS slug, or "" when no live location page exists
 */
export function getAreaLocationSlug(areaName) {
  const name = String(areaName ?? "").trim();
  if (!name) return "";

  if (Object.prototype.hasOwnProperty.call(AREA_LOCATION_SLUG_OVERRIDES, name)) {
    const override = AREA_LOCATION_SLUG_OVERRIDES[name];
    return typeof override === "string" && override.trim() ? override.trim() : "";
  }

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
