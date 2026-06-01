export const CHECKOUT_PATH = "/checkout";

/** Build checkout URL with service, slug, variant, and postcode query params */
export function buildCheckoutHref({ service, slug, variantId, variantLabel, postcode } = {}) {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (slug) params.set("slug", slug);
  if (variantId) params.set("variant", String(variantId));
  if (variantLabel) params.set("variantLabel", variantLabel);
  if (postcode) params.set("postcode", String(postcode).trim().toUpperCase());
  const qs = params.toString();
  return qs ? `${CHECKOUT_PATH}?${qs}` : CHECKOUT_PATH;
}
