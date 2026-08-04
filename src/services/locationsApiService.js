import { LOCATIONS_API_PATH, LOCATIONS_SEARCH_API_PATH } from "@/constants/locationsApi";
import { LOCATION_AREAS_BY_REGION } from "@/data/locationsPage";
import { ApiError } from "@/lib/api/errors";
import { parseLocationsListPayload } from "@/lib/locations/parseLocationsList";
import { normalizeLocationName } from "@/lib/locations/resolveLocationSlug";
import { apiRequest } from "@/lib/api/client";

/**
 * @param {number} page
 */
function locationsPathForPage(page) {
  return page <= 1 ? LOCATIONS_API_PATH : `${LOCATIONS_API_PATH}?page=${page}`;
}

/**
 * @param {number} [page]
 */
export async function fetchLocationsPage(page = 1) {
  const safePage = Math.max(1, Math.floor(page));
  const payload = await apiRequest(locationsPathForPage(safePage), { method: "GET" });
  const parsed = parseLocationsListPayload(payload);

  if (!parsed.locations.length && safePage === 1) {
    throw new ApiError("No locations returned from server.", { status: 0, data: payload });
  }

  return parsed;
}

/**
 * GET /locations/search?query=
 * @param {string} query
 */
export async function fetchLocationsSearch(query) {
  const trimmed = String(query ?? "").trim();
  if (!trimmed) {
    return { locations: [], pagination: null };
  }

  const path = `${LOCATIONS_SEARCH_API_PATH}?query=${encodeURIComponent(trimmed)}`;
  const payload = await apiRequest(path, { method: "GET" });
  return parseLocationsListPayload(payload);
}

/**
 * @param {string | null | undefined} citySlug
 * @param {string | null | undefined} cityName
 */
function regionIdFromCity(citySlug, cityName) {
  const slug = String(citySlug ?? "").trim().toLowerCase();
  if (slug && Object.prototype.hasOwnProperty.call(LOCATION_AREAS_BY_REGION, slug)) {
    return slug;
  }

  const haystack = `${citySlug ?? ""} ${cityName ?? ""}`.toLowerCase();
  if (/\bnottingham/.test(haystack)) return "nottingham";
  if (/\bderby/.test(haystack)) return "derby";
  if (/\bleicester/.test(haystack)) return "leicester";
  if (/\blincoln/.test(haystack)) return "lincoln";
  return "nottingham";
}

/**
 * @param {string} a
 * @param {string} b
 */
function locationNamesMatch(a, b) {
  const left = normalizeLocationName(a);
  const right = normalizeLocationName(b);
  return Boolean(left && right && left === right);
}

const NEARBY_STOP_TOKENS = new Set([
  "electrician",
  "electricians",
  "nottinghamshire",
  "derbyshire",
  "leicestershire",
  "lincolnshire",
  "nottingham",
  "derby",
  "leicester",
  "lincoln",
  "east",
  "midlands",
  "united",
  "kingdom",
  "england",
  "the",
  "and",
  "near",
  "city",
  "centre",
  "center",
]);

/**
 * Build local search seeds from area name + slug so nearby is place-specific
 * (e.g. Alma / electrician-alma-selston-nottinghamshire → Selston).
 * @param {{ slug?: string | null, name?: string | null, cityName?: string | null }} input
 * @returns {string[]}
 */
export function buildNearbySearchSeeds(input) {
  const slug = String(input.slug ?? "")
    .trim()
    .toLowerCase()
    .replace(/^electrician-/, "");
  const name = String(input.name ?? "").trim();
  const cityName = String(input.cityName ?? "").trim();

  const cityTokens = new Set(
    normalizeLocationName(cityName)
      .split(/\s+/)
      .filter(Boolean)
  );

  /** @type {string[]} */
  const seeds = [];
  /** @type {Set<string>} */
  const seen = new Set();

  /**
   * @param {string} value
   */
  function pushSeed(value) {
    const trimmed = String(value ?? "").replace(/\s+/g, " ").trim();
    if (!trimmed || trimmed.length < 3) return;
    const key = normalizeLocationName(trimmed);
    if (!key || seen.has(key)) return;
    if (cityTokens.has(key) && key === normalizeLocationName(cityName)) return;
    seen.add(key);
    seeds.push(trimmed);
  }

  const slugTokens = slug
    .split("-")
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !NEARBY_STOP_TOKENS.has(t) && !cityTokens.has(t));

  // Parent locality often comes after the hamlet in CMS slugs (alma-selston-...).
  if (slugTokens.length > 1) {
    pushSeed(slugTokens.slice(1).join(" "));
    for (let i = 1; i < slugTokens.length; i += 1) {
      pushSeed(slugTokens[i]);
    }
  }

  if (name) {
    const shortName = name.split(",")[0].trim();
    pushSeed(shortName);
    const parts = shortName.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      pushSeed(parts.slice(1).join(" "));
    }
  }

  for (const token of slugTokens) {
    pushSeed(token.replace(/\b\w/g, (c) => c.toUpperCase()));
  }

  return seeds;
}

/**
 * Nearby areas for the opened location detail (locality-first, not city-wide related).
 * @param {{
 *   cityName?: string | null,
 *   citySlug?: string | null,
 *   currentSlug: string,
 *   currentName?: string | null,
 *   limit?: number,
 * }} options
 * @returns {Promise<{ name: string, slug: string, href: string }[]>}
 */
export async function fetchNearbyLocationsForArea(options) {
  const currentSlug = String(options.currentSlug ?? "").trim();
  const currentName = String(options.currentName ?? "").trim();
  const limit = Math.max(1, Math.min(options.limit ?? 8, 16));
  const cityName = String(options.cityName ?? "").trim();
  const citySlug = String(options.citySlug ?? "").trim();
  const regionId = regionIdFromCity(citySlug, cityName);
  const seeds = buildNearbySearchSeeds({
    slug: currentSlug,
    name: currentName,
    cityName,
  });

  /** @type {Map<string, { name: string, slug: string, href: string, score: number }>} */
  const bySlug = new Map();
  const seedKeys = seeds.map((s) => normalizeLocationName(s)).filter(Boolean);

  /**
   * @param {{ areaName?: string, name?: string, slug?: string, href?: string } | null | undefined} loc
   * @param {number} baseScore
   */
  function addLocation(loc, baseScore = 0) {
    const slug = String(loc?.slug ?? "").trim();
    if (!slug || slug === currentSlug) return;

    const name = String(loc?.areaName ?? loc?.name ?? "").trim();
    if (!name) return;
    if (currentName && locationNamesMatch(name, currentName)) return;

    const haystack = normalizeLocationName(`${name} ${slug}`);
    let score = baseScore;
    for (const seed of seedKeys) {
      if (seed && haystack.includes(seed)) score += 10;
    }

    const existing = bySlug.get(slug);
    if (existing && existing.score >= score) return;

    bySlug.set(slug, {
      name,
      slug,
      href: loc.href || `/locations/${slug}`,
      score,
    });
  }

  for (const seed of seeds) {
    try {
      const { locations } = await fetchLocationsSearch(seed);
      locations.forEach((loc) => addLocation(loc, 20));
    } catch {
      /* try next seed */
    }
    if (bySlug.size >= limit) break;
  }

  // Soft fill from the same city only when locality search returned almost nothing.
  if (bySlug.size < 3 && cityName) {
    try {
      const { locations } = await fetchLocationsSearch(cityName);
      locations.forEach((loc) => addLocation(loc, 1));
    } catch {
      /* ignore */
    }
  }

  if (bySlug.size < limit) {
    const candidates = (LOCATION_AREAS_BY_REGION[regionId] ?? []).filter(
      (areaName) => !currentName || !locationNamesMatch(areaName, currentName),
    );
    const toSearch = candidates.slice(0, Math.max((limit - bySlug.size) * 2, limit));

    for (let i = 0; i < toSearch.length && bySlug.size < limit; i += 4) {
      const batch = toSearch.slice(i, i + 4);
      const results = await Promise.all(
        batch.map(async (areaName) => {
          try {
            const { locations } = await fetchLocationsSearch(areaName);
            return (
              locations.find((loc) => locationNamesMatch(loc.areaName, areaName)) ||
              locations.find((loc) =>
                locationNamesMatch(
                  loc.areaName,
                  areaName.replace(/\s+city\s+centre$/i, "").trim(),
                ),
              ) ||
              null
            );
          } catch {
            return null;
          }
        }),
      );
      results.forEach((loc) => addLocation(loc, 0));
    }
  }

  return Array.from(bySlug.values())
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, limit)
    .map(({ name, slug, href }) => ({ name, slug, href }));
}

/** @deprecated Use fetchNearbyLocationsForArea */
export async function fetchRelatedLocationsForCity(options) {
  return fetchNearbyLocationsForArea(options);
}

/**
 * @param {unknown} payload
 */
export function parseLocationDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && record.data && typeof record.data === "object") {
    return record.data;
  }

  if (record.slug && record.area_name) {
    return record;
  }

  return null;
}

/**
 * @param {string} slug
 */
export async function fetchLocationBySlug(slug) {
  const trimmed = slug.trim();
  if (!trimmed) {
    throw new ApiError("Location not found.", { status: 404 });
  }

  const payload = await apiRequest(`${LOCATIONS_API_PATH}/${encodeURIComponent(trimmed)}`, {
    method: "GET",
  });
  const detail = parseLocationDetailResponse(payload);

  if (!detail) {
    throw new ApiError("Invalid location detail response from server.", { status: 0, data: payload });
  }

  return detail;
}
