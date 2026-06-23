import { getApiErrorMessage } from "@/lib/api/errors";

/**
 * @typedef {'out_of_range' | 'invalid_postcode' | 'api_error'} DeliveryFeeErrorCode
 */

/**
 * @typedef {{ ok: true, fee: number } | { ok: false, code: DeliveryFeeErrorCode, message: string }} DeliveryFeeResult
 */

/**
 * @param {unknown} data
 * @returns {boolean}
 */
export function isDeliveryFeeOutOfRange(data) {
  if (!data || typeof data !== "object") return false;
  const root = /** @type {Record<string, unknown>} */ (data);
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? /** @type {Record<string, unknown>} */ (root.data)
      : null;
  return Boolean(root.out_of_range || nested?.out_of_range);
}

/**
 * Ex-VAT delivery fee from calculate-delivery-fee API (`data.delivery_fee`).
 * Checkout adds 20% VAT for Inc. VAT display and payment totals.
 * @param {unknown} data
 * @returns {number}
 */
export function parseDeliveryFeeResponse(data) {
  if (!data || typeof data !== "object") return 0;

  const root = /** @type {Record<string, unknown>} */ (data);
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? /** @type {Record<string, unknown>} */ (root.data)
      : root;

  const raw =
    nested.delivery_fee ??
    nested.deliveryFee ??
    nested.fee ??
    nested.amount ??
    root.delivery_fee ??
    root.deliveryFee ??
    root.fee ??
    0;

  const normalized = String(raw).replace(/,/g, ".").replace(/[^0-9.-]/g, "");
  const value = parseFloat(normalized);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

/**
 * @param {unknown} data
 * @returns {string}
 */
function readDeliveryFeeApiMessage(data) {
  if (!data || typeof data !== "object") return "";
  const root = /** @type {Record<string, unknown>} */ (data);
  const nested =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? /** @type {Record<string, unknown>} */ (root.data)
      : null;

  const candidates = [root.error, root.message, nested?.error, nested?.message];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      const text = value.trim();
      if (!/<!doctype|<html/i.test(text)) return text;
    }
  }
  return "";
}

/**
 * @param {unknown} data
 * @returns {DeliveryFeeResult}
 */
export function parseDeliveryFeeResult(data) {
  const apiMessage = readDeliveryFeeApiMessage(data);
  if (apiMessage) {
    const code = /invalid postcode/i.test(apiMessage) ? "invalid_postcode" : "api_error";
    return { ok: false, code, message: apiMessage };
  }

  if (isDeliveryFeeOutOfRange(data)) {
    const root = /** @type {Record<string, unknown>} */ (data ?? {});
    const nested =
      root.data && typeof root.data === "object" && !Array.isArray(root.data)
        ? /** @type {Record<string, unknown>} */ (root.data)
        : null;
    const distance = Number(root.distance ?? nested?.distance);
    const message =
      Number.isFinite(distance) && distance > 0
        ? `This postcode is outside our service area (${distance.toFixed(1)} miles). Please use a different billing postcode or call us on 0115 778 0622.`
        : "This postcode is outside our service area. Please use a different billing postcode or call us on 0115 778 0622.";

    return { ok: false, code: "out_of_range", message };
  }

  if (!data || typeof data !== "object") {
    return {
      ok: false,
      code: "api_error",
      message: "Could not calculate delivery fee for this postcode.",
    };
  }

  return { ok: true, fee: parseDeliveryFeeResponse(data) };
}

/**
 * @param {unknown} error
 * @param {string} [fallback]
 * @returns {string}
 */
export function getDeliveryFeeApiErrorMessage(
  error,
  fallback = "Could not calculate delivery fee for this postcode."
) {
  if (!error || typeof error !== "object") return fallback;

  const record = /** @type {Record<string, unknown>} */ (error);
  const data = record.data ?? error;

  if (data && typeof data === "object") {
    const payload = /** @type {Record<string, unknown>} */ (data);
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error.trim();
    }
  }

  return getApiErrorMessage(error, fallback);
}
