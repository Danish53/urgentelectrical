import { ApiError } from "@/lib/api/errors";

/** Same-origin route — proxies to Laravel `/api/contact-us` without browser CSRF issues. */
const CONTACT_SUBMIT_PATH = "/api/contact-us";

/**
 * @param {{ first_name: string, last_name: string, email: string, comment: string }} payload
 */
export async function submitContact(payload) {
  let response;
  try {
    response = await fetch(CONTACT_SUBMIT_PATH, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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

/** @param {unknown} data */
export function parseContactResponseMessage(data) {
  if (!data || typeof data !== "object") return null;
  if (typeof data.message === "string" && data.message.trim()) return data.message.trim();
  if (data.data && typeof data.data.message === "string" && data.data.message.trim()) {
    return data.data.message.trim();
  }
  return null;
}
