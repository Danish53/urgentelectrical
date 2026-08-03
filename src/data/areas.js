import { LOCATION_AREAS_BY_REGION, LOCATION_FILTERS } from "@/data/locationsPage";
import { slugify } from "@/lib/slugs";
import { guessLocationSlug } from "@/lib/locations/resolveLocationSlug";

/**
 * Display labels for "Areas we cover" on service / other-service detail pages.
 * Keys that need a different CMS location slug go in AREA_LOCATION_SLUG_OVERRIDES.
 * Prefer `resolveServiceAreasForPage()` for page-specific lists.
 */
export const SERVICE_AREAS = LOCATION_AREAS_BY_REGION.nottingham ?? [
  "Nottingham City Centre",
  "Arnold",
  "Beeston",
  "West Bridgford",
  "Hucknall",
  "Gedling",
  "Carlton",
  "Mapperley",
];

const REGION_LABELS = Object.fromEntries(
  LOCATION_FILTERS.filter((f) => f.id !== "all").map((f) => [f.id, f.label]),
);

const DEFAULT_REGION_ID = "nottingham";

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

/**
 * @param {unknown} value
 * @returns {string[]}
 */
function normalizeAreaNameList(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        const row = /** @type {Record<string, unknown>} */ (item);
        return String(
          row.area_display_name ??
            row.areaDisplayName ??
            row.area_name ??
            row.areaName ??
            row.name ??
            row.title ??
            row.label ??
            "",
        ).trim();
      }
      return "";
    })
    .filter(Boolean);
}

/**
 * @param {string} text
 * @returns {string | null}
 */
function regionIdFromText(text) {
  const haystack = String(text ?? "").toLowerCase();
  if (!haystack) return null;

  if (/\bnottingham(?:shire)?\b/.test(haystack)) return "nottingham";
  if (/\bderby(?:shire)?\b/.test(haystack)) return "derby";
  if (/\bleicester(?:shire)?\b/.test(haystack)) return "leicester";
  if (/\blincoln(?:shire)?\b/.test(haystack)) return "lincoln";
  return null;
}

/**
 * @param {string} name
 * @returns {string | null}
 */
function regionIdFromAreaName(name) {
  const needle = String(name ?? "").trim().toLowerCase();
  if (!needle) return null;

  for (const [regionId, areas] of Object.entries(LOCATION_AREAS_BY_REGION)) {
    if (areas.some((area) => area.toLowerCase() === needle)) return regionId;
  }
  return null;
}

/**
 * Resolve which location/region a page is assigned to, then return its service areas.
 *
 * Priority:
 * 1. Explicit CMS area list (`service_areas` / `areas` / `locations`)
 * 2. CMS location / city / region fields
 * 3. Infer from slug / title (e.g. …-nottingham)
 * 4. Default Nottingham
 *
 * @param {{
 *   serviceAreas?: unknown,
 *   areas?: unknown,
 *   locations?: unknown,
 *   location?: unknown,
 *   city?: unknown,
 *   region?: unknown,
 *   locationSlug?: unknown,
 *   citySlug?: unknown,
 *   slug?: string | null,
 *   title?: string | null,
 * }} [input]
 * @returns {{ areas: string[], regionId: string, regionLabel: string, subtitle: string }}
 */
export function resolveServiceAreasForPage(input = {}) {
  const explicit = normalizeAreaNameList(
    input.serviceAreas ?? input.areas ?? input.locations,
  );
  if (explicit.length) {
    const regionId =
      regionIdFromAreaName(explicit[0]) ||
      regionIdFromText(String(input.location ?? input.city ?? input.region ?? "")) ||
      regionIdFromText(`${input.slug ?? ""} ${input.title ?? ""}`) ||
      DEFAULT_REGION_ID;
    const regionLabel = REGION_LABELS[regionId] ?? "East Midlands";
    const subtitle =
      regionId === "nottingham"
        ? "Nottingham, Nottinghamshire & the East Midlands"
        : `${regionLabel} & the East Midlands`;
    return {
      areas: explicit,
      regionId,
      regionLabel,
      subtitle,
    };
  }

  const locationHint = [
    typeof input.location === "string" ? input.location : "",
    typeof input.city === "string" ? input.city : "",
    typeof input.region === "string" ? input.region : "",
    typeof input.locationSlug === "string" ? input.locationSlug : "",
    typeof input.citySlug === "string" ? input.citySlug : "",
    input.location && typeof input.location === "object"
      ? String(
          /** @type {Record<string, unknown>} */ (input.location).name ??
            /** @type {Record<string, unknown>} */ (input.location).slug ??
            "",
        )
      : "",
    input.city && typeof input.city === "object"
      ? String(
          /** @type {Record<string, unknown>} */ (input.city).name ??
            /** @type {Record<string, unknown>} */ (input.city).slug ??
            "",
        )
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const regionId =
    regionIdFromText(locationHint) ||
    regionIdFromAreaName(locationHint) ||
    regionIdFromText(`${input.slug ?? ""} ${input.title ?? ""}`) ||
    DEFAULT_REGION_ID;

  const areas = LOCATION_AREAS_BY_REGION[regionId] ?? LOCATION_AREAS_BY_REGION[DEFAULT_REGION_ID] ?? [];
  const regionLabel = REGION_LABELS[regionId] ?? "East Midlands";
  const subtitle =
    regionId === "nottingham"
      ? "Nottingham, Nottinghamshire & the East Midlands"
      : `${regionLabel} & the East Midlands`;

  return {
    areas,
    regionId,
    regionLabel,
    subtitle,
  };
}
