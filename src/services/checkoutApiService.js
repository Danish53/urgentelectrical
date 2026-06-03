import { CHECKOUT_PROXY } from "@/constants/checkoutApi";
import { ApiError } from "@/lib/api/errors";
import { getAuthToken } from "@/lib/auth/tokenStorage";

function buildCheckoutHeaders(withJsonBody) {
  const headers = { Accept: "application/json" };
  if (withJsonBody) headers["Content-Type"] = "application/json";
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function checkoutFetch(path, options = {}) {
  const { method = "GET", body } = options;
  let response;

  try {
    response = await fetch(path, {
      method,
      headers: buildCheckoutHeaders(body !== undefined),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
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
      (data?.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : null) ||
      `Request failed (${response.status})`;
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}

/**
 * @param {Record<string, unknown>} payload
 */
export async function validateOrderData(payload) {
  return checkoutFetch(CHECKOUT_PROXY.validateOrderData, {
    method: "POST",
    body: payload,
  });
}

/**
 * @param {number} amount
 */
export async function createPaymentIntent(amount) {
  return checkoutFetch(CHECKOUT_PROXY.createPaymentIntent, {
    method: "POST",
    body: { amount },
  });
}

/**
 * @param {string} paymentIntentId
 */
export async function checkPaymentStatus(paymentIntentId) {
  return checkoutFetch(CHECKOUT_PROXY.checkPaymentStatus, {
    method: "POST",
    body: { payment_intent_id: paymentIntentId },
  });
}
