export const CHECKOUT_PATH = "/checkout";

/** Build checkout URL with optional service and postcode query params */
export function buildCheckoutHref({ service, postcode } = {}) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (postcode) params.set("postcode", String(postcode).trim().toUpperCase());
  const qs = params.toString();
  return qs ? `${CHECKOUT_PATH}?${qs}` : CHECKOUT_PATH;
}
