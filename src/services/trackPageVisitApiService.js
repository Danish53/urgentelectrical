/** Same-origin Next proxy — avoids browser CSRF on Laravel POST */
const TRACK_PAGE_VISIT_PROXY_PATH = "/api/track-page-visit";

/**
 * Record one page visit. Server dedupes by IP+URL (repeats still count as 1 unique).
 * Failures are ignored so tracking never breaks the UI.
 *
 * @param {{ url: string, display_name: string }} payload
 * @returns {Promise<boolean>}
 */
export async function trackPageVisit(payload) {
  const url = String(payload?.url ?? "").trim();
  const displayName = String(payload?.display_name ?? "").trim();
  if (!url || !displayName) return false;

  // Contract: relative path only, no domain.
  if (/^https?:\/\//i.test(url)) return false;

  try {
    const response = await fetch(TRACK_PAGE_VISIT_PROXY_PATH, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url.startsWith("/") ? url : `/${url}`,
        display_name: displayName,
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
