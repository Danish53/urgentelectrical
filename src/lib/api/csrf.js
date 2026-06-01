/** Laravel Sanctum SPA — CSRF cookie before stateful POST requests */

let csrfCookiePromise = null;

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

/** Fetch `/sanctum/csrf-cookie` so `XSRF-TOKEN` is set (browser only). */
export async function ensureCsrfCookie() {
  if (typeof window === "undefined") return;

  const origin = getAppOrigin();
  if (!origin) {
    throw new Error("API base URL is not configured.");
  }

  if (!csrfCookiePromise) {
    csrfCookiePromise = fetch(`${origin}/sanctum/csrf-cookie`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Could not initialize secure session (CSRF).");
      }
    });
  }

  try {
    await csrfCookiePromise;
  } catch (error) {
    csrfCookiePromise = null;
    throw error;
  }
}

export function clearCsrfCookieCache() {
  csrfCookiePromise = null;
}
