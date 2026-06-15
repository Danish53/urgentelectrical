/**
 * @param {Record<string, unknown>} address
 */
export function formatIdealAddressLabel(address) {
  const parts = [
    address.line_1,
    address.line_2,
    address.dependant_locality,
    address.post_town,
    address.county,
    address.postcode,
  ]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  return parts.join(", ");
}

/**
 * @param {Record<string, unknown>} address
 */
export function mapIdealAddressToCheckout(address) {
  return {
    address: String(address.line_1 ?? "").trim(),
    addressLine2: String(address.line_2 ?? "").trim(),
    city: String(address.post_town ?? "").trim(),
    county: String(address.county ?? "").trim(),
    postcode: String(address.postcode ?? "")
      .trim()
      .toUpperCase(),
    country: "GB",
  };
}
