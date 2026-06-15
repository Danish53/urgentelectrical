/** Laravel Sanctum SPA — CSRF cookie before stateful POST requests */

import { fetchCookieSession, clearCookieSessionCache } from "@/services/cookieApiService";

/** @returns {string} */
export function getAppOrigin() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "");
  if (!base) return "";
  return base.replace(/\/api\/?$/i, "");
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
