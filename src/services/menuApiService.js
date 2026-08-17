import { parseNavMenuResponse } from "@/lib/menu/mapNavMenu";
import { getApiBaseUrl } from "@/lib/siteUrl";

/** @type {ReturnType<typeof parseNavMenuResponse> | null} */
let cachedNavMenu = null;

/** @type {Promise<ReturnType<typeof parseNavMenuResponse>> | null} */
let navMenuInflight = null;

/** Cached menu from a prior fetch this session (client-side). */
export function getCachedNavMenu() {
  return cachedNavMenu;
}

async function requestNavMenu() {
  const base = getApiBaseUrl();
  if (!base) {
    throw new Error("Unable to reach the menu API.");
  }
  const url = `${base}/menu`;
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("Unable to reach the menu API.");
  }

  let payload = null;
  const text = await response.text();

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new Error("Invalid menu API response.");
    }
  }

  if (!response.ok) {
    throw new Error("Menu API request failed.");
  }

  return parseNavMenuResponse(payload);
}

/** GET /api/menu — deduped and cached for the browser session. */
export async function fetchNavMenu() {
  if (cachedNavMenu) return cachedNavMenu;
  if (navMenuInflight) return navMenuInflight;

  navMenuInflight = requestNavMenu()
    .then((groups) => {
      cachedNavMenu = groups;
      return groups;
    })
    .finally(() => {
      navMenuInflight = null;
    });

  return navMenuInflight;
}
