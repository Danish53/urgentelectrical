const LOG_PREFIX = "[UE Checkout · Payment Intent]";

/**
 * @param {string} step
 * @param {Record<string, unknown>} data
 */
export function logPaymentIntentDebug(step, data) {
  if (typeof window === "undefined") return;

  console.groupCollapsed(`${LOG_PREFIX} ${step}`);
  console.log(data);
  console.groupEnd();
}

/**
 * @param {import("@stripe/stripe-js").PaymentIntent | null | undefined} paymentIntent
 */
export function formatPaymentIntentForLog(paymentIntent) {
  if (!paymentIntent) {
    return { error: "Payment Intent not found." };
  }

  return {
    id: paymentIntent.id,
    status: paymentIntent.status,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    payment_method_types: paymentIntent.payment_method_types,
    payment_method: paymentIntent.payment_method,
    livemode: paymentIntent.livemode,
    description: paymentIntent.description,
    customer: paymentIntent.customer,
    metadata: paymentIntent.metadata,
  };
}

/**
 * @param {unknown} apiResponse
 */
export function formatCreateIntentApiResponse(apiResponse) {
  const root = /** @type {Record<string, unknown>} */ (apiResponse ?? {});
  const nested = /** @type {Record<string, unknown>} */ (root.data ?? {});

  return {
    payment_intent_id:
      root.payment_intent_id ??
      root.paymentIntentId ??
      root.id ??
      nested.payment_intent_id ??
      nested.paymentIntentId ??
      nested.id ??
      null,
    has_client_secret: Boolean(
      root.client_secret ?? root.clientSecret ?? nested.client_secret ?? nested.clientSecret
    ),
    payment_method_types: root.payment_method_types ?? nested.payment_method_types ?? null,
    stripe_key_provided: Boolean(root.stripe_key ?? root.stripeKey ?? nested.stripe_key ?? nested.stripeKey),
    raw: apiResponse,
  };
}
