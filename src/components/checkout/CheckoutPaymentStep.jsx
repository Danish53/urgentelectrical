"use client";

import { useState } from "react";
import { formatMoney } from "@/components/checkout/checkoutUtils";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function CheckoutPaymentStep({
  totalInc,
  clientSecret,
  paymentIntentId,
  onBack,
  onComplete,
  onCheckPaymentStatus,
  error,
  processing,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [localError, setLocalError] = useState("");
  const [loading, setLoading] = useState(false);

  const displayError = error || localError;
  const busy = loading || processing;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!stripe || !elements) {
      setLocalError("Payment is still loading. Please wait a moment.");
      return;
    }

    if (!clientSecret) {
      setLocalError("Payment session is not ready. Go back and try again.");
      return;
    }

    const card = elements.getElement(CardNumberElement);
    if (!card) {
      setLocalError("Enter your card details to continue.");
      return;
    }

    setLoading(true);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (stripeError) {
        setLocalError(stripeError.message ?? "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setLocalError("Payment was not completed. Please try again.");
        return;
      }

      const intentId = paymentIntent?.id ?? paymentIntentId;
      if (!intentId) {
        setLocalError("Payment could not be confirmed. Please contact support.");
        return;
      }

      if (onCheckPaymentStatus) {
        await onCheckPaymentStatus(intentId);
      }

      onComplete({ paymentIntentId: intentId });
    } catch (err) {
      setLocalError(err?.message ?? "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home1-checkout-step-panel">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 3 of 3</p>
        <h2 className="home1-checkout-step-title">Payment</h2>
        <p className="home1-checkout-step-lead">
          Total due today: <strong>{formatMoney(totalInc)}</strong> Inc. VAT
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="home1-checkout-card home1-checkout-form-card home1-checkout-form"
        noValidate
      >
        {displayError ? (
          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
            {displayError}
          </p>
        ) : null}

        <div>
          <label className="home1-checkout-label">CARD NUMBER *</label>
          <div className="stripe-field">
            <CardNumberElement options={stripeStyle} className="home1-checkout-input" />
          </div>
        </div>

        <div className="home1-checkout-form-grid mt-3">
          <div>
            <label className="home1-checkout-label">EXPIRY *</label>
            <div className="stripe-field">
              <CardExpiryElement options={stripeStyle} className="home1-checkout-input" />
            </div>
          </div>
          <div>
            <label className="home1-checkout-label">CVC *</label>
            <div className="stripe-field">
              <CardCvcElement options={stripeStyle} className="home1-checkout-input" />
            </div>
          </div>
        </div>

        <p className="home1-checkout-secure-note">
          Payments are processed securely. Your card details are encrypted in transit.
        </p>

        <div className="home1-checkout-step-actions">
          <button type="button" onClick={onBack} className="home1-checkout-back-btn" disabled={busy}>
            ← Back
          </button>
          <button
            type="submit"
            disabled={busy || !stripe || !clientSecret}
            className="home1-checkout-continue"
          >
            <span>{busy ? "Processing…" : `Pay ${formatMoney(totalInc)}`}</span>
            {!busy ? <span className="home1-checkout-continue-arrow" aria-hidden="true">→</span> : null}
          </button>
        </div>
      </form>
    </div>
  );
}

const stripeStyle = {
  style: {
    base: {
      fontSize: "14px",
      color: "#111",
      fontFamily: "Inter, sans-serif",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#ef4444" },
  },
};
