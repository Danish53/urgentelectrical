import { ApiError } from "@/lib/api/errors";

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
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
      (data?.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : null) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
