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
 * Inc-VAT delivery fee from calculate-delivery-fee API (`data.delivery_fee`).
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
