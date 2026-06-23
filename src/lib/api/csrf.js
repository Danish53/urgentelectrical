/** Laravel Sanctum SPA — CSRF cookie before stateful POST requests */

import { fetchCookieSession, clearCookieSessionCache } from "@/services/cookieApiService";
import { getApiSiteOrigin } from "@/lib/siteUrl";

/** @returns {string} */
export function getAppOrigin() {
  return getApiSiteOrigin();
}

/** @returns {string | null} */
export function getXsrfTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

/** Fetch `/api/cookie` so session / `XSRF-TOKEN` is ready (browser only). */
export async function ensureCsrfCookie() {
  if (typeof window === "undefined") return;
  await fetchCookieSession();
}

export function clearCsrfCookieCache() {
  clearCookieSessionCache();
}
