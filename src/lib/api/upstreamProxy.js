/** @returns {string | null} */
export function getApiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/**
 * Server-side POST to Laravel API (no browser CSRF).
 * @param {string} upstreamPath - e.g. `/auth/login`
 * @param {Record<string, unknown>} body
 */
export async function upstreamJsonPost(upstreamPath, body) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      data: { message: "API base URL is not configured." },
    };
  }

  const path = upstreamPath.startsWith("/") ? upstreamPath : `/${upstreamPath}`;

  try {
    const upstream = await fetch(`${apiBase}${path}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    return {
      ok: upstream.ok,
      status: upstream.status,
      data: data ?? (upstream.ok ? { success: true } : { message: `Request failed (${upstream.status})` }),
    };
  } catch {
    return {
      ok: false,
      status: 502,
      data: { message: "Unable to reach the server. Please try again." },
    };
  }
}
