/** @returns {string | null} */
export function getApiBaseUrl() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!base) return null;
  return base.replace(/\/$/, "");
}

/** Site origin for `/public/api/*` routes (strips trailing `/api` from env base). */
export function getPublicApiOrigin() {
  const apiBase = getApiBaseUrl();
  if (!apiBase) return null;
  return apiBase.replace(/\/api\/?$/i, "");
}

/**
 * Server-side request to Laravel public API (`/public/api/...`).
 * @param {string} method
 * @param {string} publicPath
 * @param {{ body?: Record<string, unknown>, authorization?: string | null }} [options]
 */
export async function upstreamPublicJsonRequest(method, publicPath, options = {}) {
  const origin = getPublicApiOrigin();
  if (!origin) {
    return {
      ok: false,
      status: 500,
      data: { message: "API base URL is not configured." },
    };
  }

  const path = publicPath.startsWith("/") ? publicPath : `/${publicPath}`;
  const { body, authorization } = options;

  const headers = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(authorization ? { Authorization: authorization } : {}),
  };

  try {
    const upstream = await fetch(`${origin}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
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
      data:
        data ??
        (upstream.ok ? { success: true } : { message: `Request failed (${upstream.status})` }),
    };
  } catch {
    return {
      ok: false,
      status: 502,
      data: { message: "Unable to reach the server. Please try again." },
    };
  }
}

/**
 * Server-side request to Laravel API (no browser CSRF).
 * @param {string} method
 * @param {string} upstreamPath
 * @param {{ body?: Record<string, unknown>, authorization?: string | null }} [options]
 */
export async function upstreamJsonRequest(method, upstreamPath, options = {}) {
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      data: { message: "API base URL is not configured." },
    };
  }

  const path = upstreamPath.startsWith("/") ? upstreamPath : `/${upstreamPath}`;
  const { body, authorization } = options;

  const headers = {
    Accept: "application/json",
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(authorization ? { Authorization: authorization } : {}),
  };

  try {
    const upstream = await fetch(`${apiBase}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
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
      data:
        data ??
        (upstream.ok ? { success: true } : { message: `Request failed (${upstream.status})` }),
    };
  } catch {
    return {
      ok: false,
      status: 502,
      data: { message: "Unable to reach the server. Please try again." },
    };
  }
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

  return upstreamJsonRequest("POST", upstreamPath, { body });
}
