/** Ex-VAT amount → inc. VAT (legacy static catalogue). */
export function priceIncVatFromString(price) {
  const n = parseFloat(price);
  if (!Number.isFinite(n)) return "0.00";
  return (n * 1.2).toFixed(2);
}

/** API `price` field is the customer-facing fixed price (already inc. VAT). */
export function formatApiPrice(price) {
  const n = parseFloat(price);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}
