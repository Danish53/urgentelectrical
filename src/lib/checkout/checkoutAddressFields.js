/** @typedef {"billing" | "site"} CheckoutAddressVariant */

/** @typedef {{
 *   address: string,
 *   addressLine2: string,
 *   city: string,
 *   postcode: string,
 *   county: string,
 *   country: string,
 * }} CheckoutAddressFieldKeys */

/** @type {Record<CheckoutAddressVariant, CheckoutAddressFieldKeys>} */
export const CHECKOUT_ADDRESS_FIELD_KEYS = {
  billing: {
    address: "address",
    addressLine2: "addressLine2",
    city: "city",
    postcode: "postcode",
    county: "county",
    country: "country",
  },
  site: {
    address: "siteAddress",
    addressLine2: "siteAddressLine2",
    city: "siteCity",
    postcode: "sitePostcode",
    county: "siteCounty",
    country: "siteCountry",
  },
};

/**
 * @param {CheckoutAddressVariant} variant
 */
export function getCheckoutAddressFieldKeys(variant) {
  return CHECKOUT_ADDRESS_FIELD_KEYS[variant];
}

/**
 * @param {Record<string, unknown>} details
 * @param {CheckoutAddressVariant} variant
 */
export function readCheckoutAddress(details, variant) {
  const keys = getCheckoutAddressFieldKeys(variant);
  return {
    address: String(details[keys.address] ?? "").trim(),
    addressLine2: String(details[keys.addressLine2] ?? "").trim(),
    city: String(details[keys.city] ?? "").trim(),
    postcode: String(details[keys.postcode] ?? "").trim(),
    county: String(details[keys.county] ?? "").trim(),
    country: String(details[keys.country] ?? "GB").trim() || "GB",
  };
}

/**
 * @param {Record<string, unknown>} details
 * @param {CheckoutAddressVariant} variant
 * @param {Partial<ReturnType<typeof readCheckoutAddress>>} values
 */
export function writeCheckoutAddress(details, variant, values) {
  const keys = getCheckoutAddressFieldKeys(variant);
  const next = { ...details };

  if (values.address !== undefined) next[keys.address] = values.address;
  if (values.addressLine2 !== undefined) next[keys.addressLine2] = values.addressLine2;
  if (values.city !== undefined) next[keys.city] = values.city;
  if (values.postcode !== undefined) next[keys.postcode] = values.postcode;
  if (values.county !== undefined) next[keys.county] = values.county;
  if (values.country !== undefined) next[keys.country] = values.country;

  return next;
}

/**
 * @param {Record<string, unknown>} address
 * @param {CheckoutAddressVariant} variant
 */
export function mapIdealAddressToCheckoutVariant(address, variant) {
  const line1 = String(address.line_1 ?? "").trim();
  const line2 = String(address.line_2 ?? "").trim();
  const city = String(address.post_town ?? "").trim();
  const county = String(address.county ?? "").trim();
  const postcode = String(address.postcode ?? "")
    .trim()
    .toUpperCase();

  return writeCheckoutAddress({}, variant, {
    address: line1,
    addressLine2: line2,
    city,
    county,
    postcode,
    country: "GB",
  });
}

/**
 * @param {Record<string, unknown>} details
 */
export function copyBillingToSiteAddress(details) {
  const billing = readCheckoutAddress(details, "billing");
  return writeCheckoutAddress(details, "site", billing);
}
