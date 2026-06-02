import { ApiError } from "@/lib/api/errors";
import { getAuthToken } from "@/lib/auth/tokenStorage";

/**
 * @param {boolean} withJsonBody
 */
function buildSameOriginHeaders(withJsonBody) {
  const headers = { Accept: "application/json" };
  if (withJsonBody) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * @param {Response} response
 */
async function parseSameOriginResponse(response) {
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
      (data?.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : null) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}

/**
 * Browser POST to a same-origin Next.js API route (proxies to Laravel).
 * @param {string} path - e.g. `/api/auth/login`
 * @param {Record<string, unknown>} body
 */
export async function sameOriginJsonPost(path, body) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      headers: buildSameOriginHeaders(true),
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  return parseSameOriginResponse(response);
}

/** Authenticated GET via same-origin proxy */
export async function sameOriginAuthGet(path) {
  let response;
  try {
    response = await fetch(path, {
      method: "GET",
      headers: buildSameOriginHeaders(false),
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  return parseSameOriginResponse(response);
}

/** Authenticated POST via same-origin proxy */
export async function sameOriginAuthPost(path, body) {
  return sameOriginJsonPost(path, body);
}

/**
 * Authenticated write via same-origin proxy (PUT, DELETE, …)
 * @param {string} path
 * @param {string} method
 * @param {Record<string, unknown> | undefined} [body]
 */
export async function sameOriginAuthRequest(path, method, body) {
  const withBody = body !== undefined && method !== "GET" && method !== "HEAD";
  let response;
  try {
    response = await fetch(path, {
      method,
      headers: buildSameOriginHeaders(withBody),
      ...(withBody ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  return parseSameOriginResponse(response);
}
