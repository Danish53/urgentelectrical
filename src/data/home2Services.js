/** @deprecated Use API services via `useBookableServices` / `useFeaturedServices` */
export const HOME2_SERVICES = [];

export function priceIncVatFromString(price) {
  return (parseFloat(price) * 1.2).toFixed(2);
}
