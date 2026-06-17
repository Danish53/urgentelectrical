/** UK payment methods enabled in Stripe Dashboard for Payment Element tabs. */
export const CHECKOUT_PAYMENT_METHOD_ORDER = [
  "card",
  "pay_by_bank",
  "revolut_pay",
  "billie",
];

/**
 * Normalise create-payment-intent body for Laravel → Stripe.
 * Uses dynamic payment methods so Dashboard-enabled methods (Revolut Pay, Billie, Pay by Bank) appear.
 *
 * @param {Record<string, unknown>} [body]
 */
export function buildCreatePaymentIntentPayload(body = {}) {
  const amount = Number(body.amount);
  const currency = String(body.currency ?? "gbp").toLowerCase();

  return {
    ...body,
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "always",
    },
  };
}

/**
 * @param {number} amount Major currency units (e.g. 89.99 GBP).
 */
export function toStripeMinorUnits(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Invalid payment amount.");
  }
  return Math.round(value * 100);
}
