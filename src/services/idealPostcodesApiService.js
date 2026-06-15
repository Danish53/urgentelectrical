import { getApiErrorMessage } from "@/lib/api/errors";

/**
 * @param {string} postcode
 * @returns {Promise<{ addresses: Record<string, unknown>[], suggestions?: string[] }>}
 */
export async function fetchAddressesByPostcode(postcode) {
  const trimmed = postcode.trim();
  if (!trimmed) {
    throw new Error("Please enter a postcode.");
  }

  const res = await fetch(`/api/postcode-lookup?postcode=${encodeURIComponent(trimmed)}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(getApiErrorMessage(data, "Could not find addresses for this postcode."));
  /** @type {Error & { suggestions?: string[] }} */ (err);
    if (Array.isArray(data.suggestions) && data.suggestions.length) {
      err.suggestions = data.suggestions;
    }
    throw err;
  }

  return {
    addresses: Array.isArray(data.addresses) ? data.addresses : [],
  };
}
