/**
 * @param {unknown} data
 * @param {number} [subtotal]
 */
export function parseApplyCouponResponse(data, subtotal = 0) {
  const payload = /** @type {Record<string, unknown>} */ (data ?? {});
  const root = /** @type {Record<string, unknown>} */ (payload.data ?? payload);

  const discountType = root.discount_type ?? root.discountType ?? payload.discount_type ?? null;
  const discountValueRaw =
    root.discount_value ?? root.discountValue ?? payload.discount_value ?? null;
  const discountValue =
    discountValueRaw != null && discountValueRaw !== "" ? Number(discountValueRaw) : null;

  let discountAmount =
    Number(
      root.discount_amount ??
        root.discountAmount ??
        root.discount ??
        payload.discount_amount ??
        payload.discount ??
        0,
    ) || 0;

  if (discountAmount <= 0 && discountValue != null && discountType && subtotal > 0) {
    const type = String(discountType).toLowerCase();
    if (type === "percent" || type === "percentage") {
      discountAmount = Math.min(subtotal, (subtotal * discountValue) / 100);
    } else if (type === "fixed" || type === "amount") {
      discountAmount = Math.min(subtotal, discountValue);
    }
  }

  const couponCode = String(
    root.coupon_code ?? root.couponCode ?? payload.coupon_code ?? "",
  )
    .trim()
    .toUpperCase();

  const message =
    typeof payload.message === "string"
      ? payload.message
      : typeof root.message === "string"
        ? root.message
        : couponCode
          ? `Coupon ${couponCode} applied.`
          : "Coupon applied.";

  return {
    couponCode,
    discountAmount: Math.max(0, discountAmount),
    discountValue,
    discountType: discountType != null ? String(discountType) : null,
    message,
    success:
      payload.status === "success" ||
      payload.success === true ||
      discountAmount > 0 ||
      discountValue != null,
  };
}
