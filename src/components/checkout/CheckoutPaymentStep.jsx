"use client";

import { formatMoney } from "@/components/checkout/checkoutUtils";

const labelClass = "home1-checkout-label";
const inputClass = "home1-checkout-input";

export default function CheckoutPaymentStep({
  totalInc,
  onBack,
  onComplete,
  error,
  processing,
}) {
  return (
    <div className="home1-checkout-step-panel">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 3 of 3</p>
        <h1 className="home1-checkout-step-title font-playfair">Payment</h1>
        <p className="home1-checkout-step-lead">
          Secure checkout — total due today: <strong>{formatMoney(totalInc)}</strong> Inc. VAT
        </p>
      </header>

      <form
        className="home1-checkout-card home1-checkout-form-card home1-checkout-form"
        onSubmit={(e) => {
          e.preventDefault();
          onComplete();
        }}
        noValidate
      >
        {error ? (
          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <div>
          <label htmlFor="checkout-card-name" className={labelClass}>
            Name on card<span className="text-[#d3231f]">*</span>
          </label>
          <input id="checkout-card-name" className={inputClass} autoComplete="cc-name" required />
        </div>

        <div>
          <label htmlFor="checkout-card-number" className={labelClass}>
            Card number<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="checkout-card-number"
            className={inputClass}
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            autoComplete="cc-number"
            required
          />
        </div>

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor="checkout-expiry" className={labelClass}>
              Expiry<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-expiry"
              className={inputClass}
              placeholder="MM / YY"
              autoComplete="cc-exp"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-cvc" className={labelClass}>
              CVC<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-cvc"
              className={inputClass}
              inputMode="numeric"
              placeholder="123"
              autoComplete="cc-csc"
              required
            />
          </div>
        </div>

        <p className="home1-checkout-secure-note">
          🔒 Payments are processed securely. Your card details are encrypted in transit.
        </p>

        <div className="home1-checkout-step-actions">
          <button type="button" onClick={onBack} className="home1-checkout-back-btn">
            ← Back
          </button>
          <button type="submit" className="home1-checkout-continue" disabled={processing}>
            <span>{processing ? "Processing…" : `Pay ${formatMoney(totalInc)}`}</span>
            {!processing ? <span className="home1-checkout-continue-arrow" aria-hidden="true">→</span> : null}
          </button>
        </div>
      </form>
    </div>
  );
}
