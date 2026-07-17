const DEFAULT_SITE_URL = "https://www.urgentelectrical.services";

/** Laravel API base, e.g. `https://example.com/api` */
export function getApiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Site origin derived from `NEXT_PUBLIC_API_BASE_URL` (strips trailing `/api`). */
export function getSiteUrlFromApiBase() {
  const apiBase = getApiBaseUrl();
  if (!apiBase) return null;
  return apiBase.replace(/\/api\/?$/i, "");
}

/**
 * Public Next.js site origin — canonical URLs, metadata, sitemap, JSON-LD.
 * `NEXT_PUBLIC_SITE_URL` → API-derived origin → production default.
 */
export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return getSiteUrlFromApiBase() ?? DEFAULT_SITE_URL;
}

/**
 * Laravel / CMS origin for `/public/api/*` routes and relative media paths.
 * Prefers API-derived origin so assets match the backend host.
 */
export function getApiSiteOrigin() {
  return getSiteUrlFromApiBase() ?? getSiteUrl();
}

/** @deprecated Use `getApiSiteOrigin` */
export const getPublicSiteOrigin = getApiSiteOrigin;

/**
 * @param {string} [path]
 * @param {string} [origin]
 */
export function absoluteUrl(path = "", origin = getSiteUrl()) {
  const trimmed = String(path ?? "").trim();
  if (!trimmed) return origin;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${origin}${trimmed}`;
  return `${origin}/${trimmed.replace(/^\/+/, "")}`;
}

/** Absolute URL on the public Next.js site. */
export function absoluteSiteUrl(path = "") {
  return absoluteUrl(path, getSiteUrl());
}

/** Absolute URL for CMS / API-hosted assets and public Laravel routes. */
export function absoluteCmsUrl(path = "") {
  return absoluteUrl(path, getApiSiteOrigin());
}

export const OG_IMAGE_PATH = "/featured/emergency-24.jpg";

export function getOgImageUrl() {
  return absoluteSiteUrl(OG_IMAGE_PATH);
}
