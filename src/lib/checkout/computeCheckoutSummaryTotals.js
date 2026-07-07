import { VAT_MULTIPLIER } from "@/lib/pricing";

function roundMoney(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

/**
 * Checkout summary: discount off ex-VAT subtotal, then VAT at 20% on the remainder.
 *
 * @param {{
 *   serviceExc?: number | string,
 *   travelExc?: number | string,
 *   discount?: number,
 * }} params
 */
export function computeCheckoutSummaryTotals({
  serviceExc = 0,
  travelExc = 0,
  discount = 0,
} = {}) {
  const service = parseFloat(String(serviceExc)) || 0;
  const travel = parseFloat(String(travelExc)) || 0;
  const grossExc = roundMoney(service + travel);
  const discountAmount = roundMoney(Math.max(0, Number(discount) || 0));
  const subtotalExc = roundMoney(Math.max(0, grossExc - discountAmount));
  const vatAmount = roundMoney(subtotalExc * (VAT_MULTIPLIER - 1));
  const payableTotalInc = roundMoney(subtotalExc * VAT_MULTIPLIER);

  return {
    grossExc,
    discount: discountAmount,
    subtotalExc,
    vatAmount,
    payableTotalInc,
  };
}
