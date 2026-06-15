"use client";

import { useState } from "react";
import { formatMoney } from "@/components/checkout/checkoutUtils";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { getApiErrorMessage } from "@/lib/api/errors";
import { parseApplyCouponResponse } from "@/lib/checkout/parseCouponResponse";
import { formatGbpDisplay, getDisplayPrice, getVatSuffix } from "@/lib/pricing";
import { applyCoupon as applyCouponApi } from "@/services/checkoutApiService";

/**
 * @param {{
 *   service: Record<string, unknown> | null,
 *   variantLabel?: string | null,
 *   lineItems: { totalInc: string, service: { label: string, amountInc: string, amountExc: string }, travel: { label: string, amountInc: string, amountExc: string } },
 *   selectedDate?: Date | null,
 *   selectedTime?: string | null,
 *   postcode?: string,
 *   serviceApiId?: number | string | null,
 *   variantApiId?: number | string | null,
 *   appliedCoupon?: { code: string, discountAmount: number, discountValue?: number | null, discountType?: string | null, message?: string } | null,
 *   onCouponApplied?: (coupon: { code: string, discountAmount: number, discountValue: number | null, discountType: string | null, message: string }) => void,
 *   onCouponRemoved?: () => void,
 * }} props
 */
export default function CheckoutSummary({
  service,
  variantLabel,
  lineItems,
  selectedDate,
  selectedTime,
  postcode,
  serviceApiId,
  variantApiId,
  appliedCoupon = null,
  onCouponApplied,
  onCouponRemoved,
}) {
  const { incVat } = useVatPreference();
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code ?? "");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(appliedCoupon?.message ?? "");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = parseFloat(lineItems.totalInc) || 0;
  const discount = appliedCoupon?.discountAmount ?? 0;
  const totalAfterDiscount = Math.max(0, subtotal - discount);
  const vatLabel = getVatSuffix(incVat);
  const priceExc = service?.priceExcVat ?? service?.price;
  const displayPrice = priceExc != null ? getDisplayPrice(priceExc, incVat) : null;

  async function handleApplyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      setCouponSuccess("");
      return;
    }

    if (!serviceApiId) {
      setCouponError("Service is not available for coupons yet.");
      setCouponSuccess("");
      return;
    }

    setApplyingCoupon(true);
    setCouponError("");
    setCouponSuccess("");

    try {
      const payload = {
        service_id: Number(serviceApiId),
        coupon_code: code,
      };
      if (variantApiId != null && variantApiId !== "") {
        payload.variant_id = Number(variantApiId);
      }

      const data = await applyCouponApi(payload);
      const parsed = parseApplyCouponResponse(data, subtotal);

      if (!parsed.success) {
        setCouponError("This coupon could not be applied.");
        onCouponRemoved?.();
        return;
      }

      const applied = {
        code: parsed.couponCode || code,
        discountAmount: parsed.discountAmount,
        discountValue: parsed.discountValue,
        discountType: parsed.discountType,
        message: parsed.message,
      };

      onCouponApplied?.(applied);
      setCouponCode(applied.code);
      setCouponSuccess(applied.message);
    } catch (err) {
      onCouponRemoved?.();
      setCouponError(getApiErrorMessage(err, "Invalid coupon code."));
      setCouponSuccess("");
    } finally {
      setApplyingCoupon(false);
    }
  }

  function handleRemoveCoupon() {
    onCouponRemoved?.();
    setCouponCode("");
    setCouponError("");
    setCouponSuccess("");
  }

  return (
    <aside className="home1-checkout-summary" aria-label="Booking summary">
      <div className="home1-checkout-summary-card">
        <header className="home1-checkout-summary-head">
          <p className="home1-checkout-summary-eyebrow">Your booking</p>
          <h2 className="home1-checkout-summary-title">Order summary</h2>
        </header>

        <div className="home1-checkout-summary-body">
          {service ? (
            <div className="home1-checkout-summary-service">
              <p className="home1-checkout-summary-service-label">Service</p>
              <p className="home1-checkout-summary-service-name">{service.name}</p>
              {service.categoryLabel ? (
                <p className="home1-checkout-summary-service-meta">{service.categoryLabel}</p>
              ) : null}
              {variantLabel ? (
                <p className="home1-checkout-summary-service-variant">
                  Option: <strong>{variantLabel}</strong>
                </p>
              ) : null}
              {displayPrice != null ? (
                <p className="home1-checkout-summary-service-price">
                  {formatGbpDisplay(displayPrice)} <span>{vatLabel}</span>
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="home1-checkout-summary-coupon">
            <label htmlFor="checkout-coupon" className="home1-checkout-summary-coupon-label">
              Coupon code
            </label>
            <div className="home1-checkout-summary-coupon-row">
              <input
                id="checkout-coupon"
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value);
                  setCouponError("");
                }}
                placeholder="e.g. QWE"
                className="home1-checkout-summary-coupon-input"
                disabled={Boolean(appliedCoupon) || applyingCoupon}
                autoComplete="off"
              />
              {appliedCoupon ? (
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="home1-checkout-summary-coupon-btn is-remove"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="home1-checkout-summary-coupon-btn"
                  disabled={applyingCoupon}
                  aria-busy={applyingCoupon}
                >
                  {applyingCoupon ? (
                    <>
                      <ButtonSpinner className="h-3.5 w-3.5 text-white" />
                      <span>Applying…</span>
                    </>
                  ) : (
                    "Apply"
                  )}
                </button>
              )}
            </div>
            {couponError ? (
              <p className="home1-checkout-summary-coupon-msg is-error" role="alert">
                {couponError}
              </p>
            ) : null}
            {couponSuccess ? (
              <p className="home1-checkout-summary-coupon-msg is-success" role="status">
                {couponSuccess}
              </p>
            ) : null}
          </div>

          <ul className="home1-checkout-summary-lines list-none p-0 m-0">
            <li>
              <span className="home1-checkout-summary-line-label">{lineItems.service.label}</span>
              <span className="home1-checkout-summary-line-price">
                {formatMoney(incVat ? lineItems.service.amountInc : lineItems.service.amountExc)}
              </span>
            </li>
            <li>
              <span className="home1-checkout-summary-line-label">{lineItems.travel.label}</span>
              <span className="home1-checkout-summary-line-price">
                {formatMoney(incVat ? lineItems.travel.amountInc : lineItems.travel.amountExc)}
              </span>
            </li>
            {discount > 0 ? (
              <li className="home1-checkout-summary-line-discount">
                <span className="home1-checkout-summary-line-label">
                  Discount ({appliedCoupon?.code})
                </span>
                <span className="home1-checkout-summary-line-price">−{formatMoney(discount)}</span>
              </li>
            ) : null}
          </ul>

          <div className="home1-checkout-summary-total">
            <span>Total{incVat ? " Inc. VAT" : " Exc. VAT"}</span>
            <strong>{formatMoney(totalAfterDiscount.toFixed(2))}</strong>
          </div>

          {(selectedDate || selectedTime || postcode) ? (
            <dl className="home1-checkout-summary-meta">
              {postcode ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Postcode</dt>
                  <dd>{postcode}</dd>
                </div>
              ) : null}
              {selectedDate ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Visit date</dt>
                  <dd>
                    {selectedDate.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              ) : null}
              {selectedTime ? (
                <div className="home1-checkout-summary-meta-row">
                  <dt>Time slot</dt>
                  <dd>{selectedTime}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="home1-checkout-summary-hint">
              Select date and time in step 1 to see visit details here.
            </p>
          )}

          <ul className="home1-checkout-summary-trust list-none p-0 m-0">
            <li>NICEIC approved</li>
            <li>Fixed transparent pricing</li>
            <li>Secure booking</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
