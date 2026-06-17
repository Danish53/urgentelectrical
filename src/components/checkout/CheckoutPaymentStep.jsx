"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatMoney } from "@/components/checkout/checkoutUtils";
import {
  formatPaymentIntentForLog,
  logPaymentIntentDebug,
} from "@/lib/checkout/logPaymentIntentDebug";
import { CHECKOUT_PAYMENT_METHOD_ORDER } from "@/lib/checkout/buildCreatePaymentIntentPayload";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

function getCheckoutReturnUrl() {
  if (typeof window === "undefined") return "/checkout";
  const url = new URL(window.location.href);
  url.searchParams.delete("payment_intent");
  url.searchParams.delete("payment_intent_client_secret");
  url.searchParams.delete("redirect_status");
  return url.toString();
}

function TermsAgreement({ checked, onChange }) {
  return (
    <label className="home1-checkout-payment-terms">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="home1-checkout-payment-terms-checkbox"
      />
      <span>
        I agree to Urgent Electrical&apos;s{" "}
        <Link href="/policies" target="_blank" rel="noopener noreferrer">
          Terms &amp; Conditions
        </Link>
      </span>
    </label>
  );
}

export default function CheckoutPaymentStep({
  totalInc,
  clientSecret,
  paymentIntentId,
  billingName = "",
  billingEmail = "",
  billingPhone = "",
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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [stripeElementReady, setStripeElementReady] = useState(false);
  const [allowedMethods, setAllowedMethods] = useState(null);

  const displayError = error || localError;
  const busy = loading || processing;

  const paymentElementOptions = useMemo(
    () => ({
      layout: {
        type: "tabs",
        defaultCollapsed: false,
      },
      paymentMethodOrder: CHECKOUT_PAYMENT_METHOD_ORDER,
      defaultValues: {
        billingDetails: {
          name: billingName || undefined,
          email: billingEmail || undefined,
          phone: billingPhone || undefined,
          address: {
            country: "GB",
          },
        },
      },
      fields: {
        billingDetails: {
          name: "never",
          email: "never",
          phone: "never",
          address: {
            country: "auto",
          },
        },
      },
    }),
    [billingName, billingEmail, billingPhone]
  );

  useEffect(() => {
    logPaymentIntentDebug("Step 3 props", {
      paymentIntentId,
      hasClientSecret: Boolean(clientSecret),
      clientSecretPreview: clientSecret ? `${clientSecret.slice(0, 24)}…` : null,
    });
  }, [paymentIntentId, clientSecret]);

  async function finalizePayment(intentId) {
    if (!intentId) {
      setLocalError("Payment could not be confirmed. Please contact support.");
      return;
    }

    if (onCheckPaymentStatus) {
      await onCheckPaymentStatus(intentId);
    }

    onComplete({ paymentIntentId: intentId });
  }

  async function confirmStripePaymentFlow() {
    if (!termsAccepted) {
      setLocalError("Please agree to the Terms & Conditions to continue.");
      return;
    }

    const paymentElement = elements?.getElement(PaymentElement);
    if (!paymentElement) {
      setLocalError("Payment methods could not load. Please refresh and try again.");
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setLocalError(submitError.message ?? "Could not start payment.");
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: getCheckoutReturnUrl(),
        payment_method_data: {
          billing_details: {
            name: billingName || undefined,
            email: billingEmail || undefined,
            phone: billingPhone || undefined,
          },
        },
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setLocalError(stripeError.message ?? "Payment failed. Please try again.");
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      await finalizePayment(paymentIntent.id ?? paymentIntentId);
    }
  }

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

    setLoading(true);

    try {
      await confirmStripePaymentFlow();
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
        className="home1-checkout-card home1-checkout-form-card home1-checkout-form home1-checkout-payment-form"
        noValidate
      >
        {displayError ? (
          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
            {displayError}
          </p>
        ) : null}

        <div className="home1-checkout-payment-stripe-panel">
          <div className="home1-checkout-payment-element-wrap">
            <PaymentElement
              options={paymentElementOptions}
              onReady={async () => {
                setStripeElementReady(true);

                if (!stripe || !clientSecret) return;

                try {
                  const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);

                  if (error) {
                    logPaymentIntentDebug("Stripe retrieve error", { message: error.message, type: error.type });
                    setAllowedMethods(null);
                    return;
                  }

                  const methods = paymentIntent?.payment_method_types ?? [];
                  setAllowedMethods(methods);

                  logPaymentIntentDebug("Stripe Payment Intent (full)", formatPaymentIntentForLog(paymentIntent));
                  logPaymentIntentDebug("Allowed payment methods", {
                    payment_method_types: methods,
                    tabCountExpected: methods.length,
                    note:
                      methods.length > 1
                        ? "Multiple tabs should appear in Stripe PaymentElement."
                        : "Only one method — Stripe will not show method tabs.",
                  });
                } catch (err) {
                  logPaymentIntentDebug("Stripe retrieve failed", {
                    message: err?.message ?? "Unknown error",
                  });
                  setAllowedMethods(null);
                }
              }}
              onLoadError={(event) => {
                setStripeElementReady(false);
                setLocalError(event.error?.message ?? "Payment methods could not load.");
              }}
            />
          </div>
        </div>

        {allowedMethods?.length === 1 && allowedMethods[0] === "card" ? (
          <p className="home1-checkout-payment-methods-hint" role="status">
            Only card is available on this payment session. Pay by Bank, Revolut Pay and Billie must
            be included when the payment intent is created with Stripe automatic payment methods.
          </p>
        ) : null}

        <TermsAgreement checked={termsAccepted} onChange={setTermsAccepted} />

        <p className="home1-checkout-secure-note">Payments are processed securely through Stripe.</p>

        <div className="home1-checkout-step-actions">
          <button type="button" onClick={onBack} className="home1-checkout-back-btn" disabled={busy}>
            ← Back
          </button>
          <button
            type="submit"
            disabled={busy || !stripe || !clientSecret || !stripeElementReady}
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
