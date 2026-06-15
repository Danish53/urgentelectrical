import { COOKIE_PROXY } from "@/constants/cookieApi";

let cookieSessionPromise = null;

/**
 * Bootstrap Laravel session / CSRF cookies via same-origin proxy.
 * @returns {Promise<Record<string, unknown>>}
 */
export async function fetchCookieSession() {
  if (typeof window === "undefined") {
    return {};
  }

  if (!cookieSessionPromise) {
    cookieSessionPromise = fetch(COOKIE_PROXY.get, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "same-origin",
      cache: "no-store",
    }).then(async (response) => {
      const text = await response.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "Could not initialize cookie session.";
        throw new Error(message);
      }

      return data;
    });
  }

  try {
    return await cookieSessionPromise;
  } catch (error) {
    cookieSessionPromise = null;
    throw error;
  }
}

export function clearCookieSessionCache() {
  cookieSessionPromise = null;
}
