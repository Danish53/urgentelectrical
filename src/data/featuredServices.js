/** @deprecated Use API services via `useFeaturedServices` hook */
export const FEATURED_SERVICES = [];

export function priceIncVat(priceExc) {
  return (parseFloat(priceExc) * 1.2).toFixed(2);
}
