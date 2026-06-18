import { loadStripe } from "@stripe/stripe-js";

/** @type {string | null} */
let cachedPublishableKey = null;
/** @type {ReturnType<typeof loadStripe> | null} */
let cachedStripePromise = null;

const STRIPE_LOADER_OPTIONS = {
  developerTools: {
    assistant: {
      enabled: false,
    },
  },
};

/**
 * Returns a stable Stripe.js promise for a given publishable key.
 * Reuses the same promise instance so `<Elements stripe={…}>` never receives a new reference.
 *
 * @param {string | null | undefined} publishableKey
 */
export function createStripePromise(publishableKey) {
  const key =
    publishableKey?.trim() || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";

  if (!key) return null;

  if (cachedPublishableKey === key && cachedStripePromise) {
    return cachedStripePromise;
  }

  cachedPublishableKey = key;
  cachedStripePromise = loadStripe(key, STRIPE_LOADER_OPTIONS);
  return cachedStripePromise;
}
