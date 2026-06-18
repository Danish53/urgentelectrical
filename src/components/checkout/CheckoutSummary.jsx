"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatMoney } from "@/components/checkout/checkoutUtils";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { getApiErrorMessage } from "@/lib/api/errors";
import { parseApplyCouponResponse } from "@/lib/checkout/parseCouponResponse";
import { formatGbpDisplay, getDisplayPrice, getVatSuffix } from "@/lib/pricing";
import { applyCoupon as applyCouponApi } from "@/services/checkoutApiService";

const TRAVEL_CHARGE_INFO =
  "No travel fee within 20 miles. For locations outside this radius, a travel charge will be added automatically based on distance.";

function TravelChargeInfoTooltip() {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const tipRef = useRef(null);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    function handlePointerDown(event) {
      const target = event.target;
      if (
        buttonRef.current?.contains(target) ||
        tipRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    function handleReposition() {
      updatePosition();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updatePosition]);

  const tooltip =
    open && typeof document !== "undefined"
      ? createPortal(
          <span
            ref={tipRef}
            id="checkout-travel-charge-tooltip"
            role="tooltip"
            className="home1-checkout-travel-info-tip home1-checkout-travel-info-tip--portal"
            style={{ top: coords.top, left: coords.left }}
          >
            {TRAVEL_CHARGE_INFO}
          </span>,
          document.body
        )
      : null;

  return (
    <>
      <span className="home1-checkout-travel-info">
        <button
          ref={buttonRef}
          type="button"
          className="home1-checkout-travel-info-btn"
          aria-label="Travel charge information"
          aria-expanded={open}
          aria-controls="checkout-travel-charge-tooltip"
          onClick={() => {
            setOpen((value) => {
              const next = !value;
              if (next) {
                requestAnimationFrame(updatePosition);
              }
              return next;
            });
          }}
        >
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="home1-checkout-travel-info-icon">
            <circle cx="10" cy="10" r="8.25" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M10 9.25v4.5M10 6.75h.01"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </span>
      {tooltip}
    </>
  );
}

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
 *   deliveryFeeLoading?: boolean,
 *   deliveryFeeResolved?: boolean,
 *   deliveryFeeOutOfRange?: boolean,
 *   deliveryFeeError?: string,
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
  deliveryFeeLoading = false,
  deliveryFeeResolved = false,
  deliveryFeeOutOfRange = false,
  deliveryFeeError = "",
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

  const travelPrice =
    deliveryFeeLoading
      ? "calculating..."
      : deliveryFeeError
        ? "0"
        : deliveryFeeOutOfRange
          ? "Unavailable"
          : !deliveryFeeResolved && postcode
            ? "0"
            : formatMoney(incVat ? lineItems.travel.amountInc : lineItems.travel.amountExc);

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
              <span className="home1-checkout-summary-line-label home1-checkout-summary-line-label--with-info">
                <span>{lineItems.travel.label}</span>
                <TravelChargeInfoTooltip />
              </span>
              <span
                className={`home1-checkout-summary-line-price${
                  deliveryFeeOutOfRange || deliveryFeeError ? " is-muted" : ""
                }`}
              >
                {travelPrice}
              </span>
            </li>
            {deliveryFeeError ? (
              <li className="home1-checkout-summary-line-note">
                <span className="home1-checkout-summary-delivery-error" role="alert">
                  {deliveryFeeError}
                </span>
              </li>
            ) : null}
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
