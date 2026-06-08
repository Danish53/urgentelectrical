import { loadStripe } from "@stripe/stripe-js";

/**
 * @param {string | null | undefined} publishableKey
 */
export function createStripePromise(publishableKey) {
  const key =
    publishableKey?.trim() || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";

  if (!key) return null;

  return loadStripe(key, {
    developerTools: {
      assistant: {
        enabled: false,
      },
    },
  });
}
