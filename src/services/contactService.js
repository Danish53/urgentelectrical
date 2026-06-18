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

/**
 * Map home page callback form fields to contact-us API payload.
 * @param {{ name: string, phone: string, email: string, service?: string, message?: string }} fields
 */
export function buildContactPayloadFromCallbackForm({ name, phone, email, service = "", message = "" }) {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.length > 1 ? parts.slice(1).join(" ") : "—";

  const commentLines = [
    service ? `Service: ${String(service).trim()}` : "",
    phone ? `Phone: ${String(phone).trim()}` : "",
    message ? `Message: ${String(message).trim()}` : "",
  ].filter(Boolean);

  return {
    first_name,
    last_name,
    email: String(email).trim(),
    comment: commentLines.join("\n") || "Callback request from home page.",
  };
}
