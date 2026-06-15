import { MENU_API } from "@/constants/menuApi";
import { getFallbackNavGroups, getSiteOrigin, parseNavMenuResponse } from "@/lib/menu/mapNavMenu";

/** GET /public/api/menu */
export async function fetchNavMenu() {
  const url = `${getSiteOrigin()}${MENU_API.list}`;
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

  const groups = parseNavMenuResponse(payload);
  if (!groups.length) {
    return getFallbackNavGroups();
  }

  return groups;
}
