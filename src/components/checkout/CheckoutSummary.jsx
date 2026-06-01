"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/components/checkout/checkoutUtils";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { formatGbpDisplay, getDisplayPrice, getVatSuffix } from "@/lib/pricing";

const COUPONS = {
  URGENT10: { type: "percent", value: 10, label: "10% off" },
  SAVE20: { type: "fixed", value: 20, label: "£20 off" },
};

export default function CheckoutSummary({
  service,
  variantLabel,
  lineItems,
  selectedDate,
  selectedTime,
  postcode,
}) {
  const { incVat } = useVatPreference();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = parseFloat(lineItems.totalInc);
  const discount = useMemo(() => {
    if (!couponApplied) return 0;
    const c = COUPONS[couponApplied];
    if (!c) return 0;
    if (c.type === "percent") return Math.min(subtotal, (subtotal * c.value) / 100);
    return Math.min(subtotal, c.value);
  }, [couponApplied, subtotal]);

  const totalAfterDiscount = Math.max(0, subtotal - discount);
  const vatLabel = getVatSuffix(incVat);
  const priceExc = service?.priceExcVat ?? service?.price;
  const displayPrice = priceExc != null ? getDisplayPrice(priceExc, incVat) : null;

  function applyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      setCouponSuccess("");
      return;
    }
    if (!COUPONS[code]) {
      setCouponApplied(null);
      setCouponError("Invalid coupon code.");
      setCouponSuccess("");
      return;
    }
    setCouponApplied(code);
    setCouponError("");
    setCouponSuccess(`Coupon applied: ${COUPONS[code].label}`);
  }

  function removeCoupon() {
    setCouponApplied(null);
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
                placeholder="e.g. URGENT10"
                className="home1-checkout-summary-coupon-input"
                disabled={Boolean(couponApplied)}
                autoComplete="off"
              />
              {couponApplied ? (
                <button type="button" onClick={removeCoupon} className="home1-checkout-summary-coupon-btn is-remove">
                  Remove
                </button>
              ) : (
                <button type="button" onClick={applyCoupon} className="home1-checkout-summary-coupon-btn">
                  Apply
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
                <span className="home1-checkout-summary-line-label">Discount ({couponApplied})</span>
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
            <p className="home1-checkout-summary-hint">Select date and time in step 1 to see visit details here.</p>
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
