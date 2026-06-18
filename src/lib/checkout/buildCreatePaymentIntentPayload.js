/** UK payment methods enabled in Stripe Dashboard for Payment Element tabs. */
export const CHECKOUT_PAYMENT_METHOD_ORDER = [
  "card",
  "pay_by_bank",
  "revolut_pay",
  "billie",
];

/**
 * Dashboard payment method configuration (pmc_…) with Pay by Bank, Revolut Pay, Billie enabled.
 * Set STRIPE_PAYMENT_METHOD_CONFIGURATION_ID in server env.
 */
export function resolvePaymentMethodConfigurationId() {
  return process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION_ID?.trim() || "";
}

/**
 * Normalise create-payment-intent body for Laravel → Stripe.
 * Uses dynamic payment methods so Dashboard-enabled methods (Revolut Pay, Billie, Pay by Bank) appear.
 *
 * @param {Record<string, unknown>} [body]
 */
export function buildCreatePaymentIntentPayload(body = {}) {
  const amount = Number(body.amount);
  const currency = String(body.currency ?? "gbp").toLowerCase();
  const configurationId =
    (typeof body.payment_method_configuration === "string" && body.payment_method_configuration.trim()) ||
    resolvePaymentMethodConfigurationId();

  const payload = {
    ...body,
    amount,
    currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "always",
    },
  };

  if (configurationId) {
    payload.payment_method_configuration = configurationId;
  }

  return payload;
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
