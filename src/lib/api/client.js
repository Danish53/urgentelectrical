import { ApiError } from "@/lib/api/errors";
import { getAuthToken } from "@/lib/auth/tokenStorage";
import { ensureCsrfCookie, getXsrfTokenFromCookie } from "@/lib/api/csrf";
import { SERVER_FETCH } from "@/lib/api/serverFetch";
import { getApiBaseUrl } from "@/lib/siteUrl";

function getBaseUrl() {
  const base = getApiBaseUrl();
  if (!base) {
    throw new ApiError(
      "API base URL is not configured. Set NEXT_PUBLIC_API_BASE_URL in .env.local.",
      { status: 0 }
    );
  }
  return base;
}

/**
 * @param {string} path - e.g. `/auth/login`
 * @param {RequestInit & { auth?: boolean, csrf?: boolean }} options
 */
export async function apiRequest(path, options = {}) {
  const {
    auth = false,
    csrf = false,
    headers: customHeaders,
    body,
    credentials,
    cache,
    next,
    ...rest
  } = options;
  const url = `${getBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const isServer = typeof window === "undefined";
  const fetchCache =
    cache !== undefined || next !== undefined
      ? cache
      : isServer
        ? SERVER_FETCH.cache
        : undefined;

  if (csrf) {
    await ensureCsrfCookie();
  }

  const headers = {
    Accept: "application/json",
    ...(csrf ? { "X-Requested-With": "XMLHttpRequest" } : {}),
    ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    ...customHeaders,
  };

  if (auth) {
    const token = getAuthToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (csrf) {
    const xsrf = getXsrfTokenFromCookie();
    if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;
  }

  let response;
  try {
    response = await fetch(url, {
      ...rest,
      ...(fetchCache !== undefined ? { cache: fetchCache } : {}),
      ...(next !== undefined ? { next } : {}),
      credentials: credentials ?? (csrf ? "include" : "same-origin"),
      headers,
      body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed (${response.status})`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
