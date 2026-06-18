import {
  buildCreatePaymentIntentPayload,
  resolvePaymentMethodConfigurationId,
  toStripeMinorUnits,
} from "@/lib/checkout/buildCreatePaymentIntentPayload";

/**
 * Create a PaymentIntent directly on Stripe (server-only).
 * Use when STRIPE_SECRET_KEY is configured so automatic payment methods from the Dashboard apply.
 *
 * @param {Record<string, unknown>} body
 */
export async function createStripePaymentIntentDirect(body) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) return null;

  const payload = buildCreatePaymentIntentPayload(body);
  const amountInMinor = toStripeMinorUnits(payload.amount);
  const currency = String(payload.currency ?? "gbp").toLowerCase();

  const params = new URLSearchParams();
  params.set("amount", String(amountInMinor));
  params.set("currency", currency);
  params.set("automatic_payment_methods[enabled]", "true");
  params.set("automatic_payment_methods[allow_redirects]", "always");

  const configurationId = resolvePaymentMethodConfigurationId();
  if (configurationId) {
    params.set("payment_method_configuration", configurationId);
  }

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    const message =
      typeof data?.error?.message === "string"
        ? data.error.message
        : "Stripe payment intent creation failed.";
    throw new Error(message);
  }

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || null;

  return {
    client_secret: data.client_secret,
    clientSecret: data.client_secret,
    payment_intent_id: data.id,
    paymentIntentId: data.id,
    id: data.id,
    payment_method_types: data.payment_method_types ?? null,
    stripe_key: publishableKey,
    stripeKey: publishableKey,
  };
}
