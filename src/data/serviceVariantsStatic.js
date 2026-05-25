/** Static variant options for service detail UI (temporary — wire to CMS/data later) */
export const STATIC_SERVICE_VARIANTS = [
  { id: "1-5", label: "1-5 Items", priceIncVat: "78.00" },
  { id: "6-10", label: "6-10 Items", priceIncVat: "90.00" },
  { id: "10-15", label: "10-15 Items", priceIncVat: "102.00" },
  { id: "15-20", label: "15-20 Items", priceIncVat: "114.00" },
  { id: "20-30", label: "20-30 Items", priceIncVat: "132.00" },
  { id: "30-40", label: "30-40 Items", priceIncVat: "156.00" },
  { id: "40-50", label: "40-50 Items", priceIncVat: "186.00" },
  // { id: "50+", label: "50+ Items", priceIncVat: "264.00" },
];

export const STATIC_VARIANT_DEFAULT_ID = "10-15";

function formatGbp(amount) {
  return `£${Number(amount).toFixed(2)}`;
}

/** Hero “Starting from” range — min & max from variant prices */
export function buildStaticVariantPriceDisplay() {
  const values = STATIC_SERVICE_VARIANTS.map((v) => parseFloat(v.priceIncVat));
  const min = Math.min(...values).toFixed(2);
  const max = Math.max(...values).toFixed(2);
  return {
    type: "range",
    min,
    max,
    prefix: "FROM",
    amounts: `${formatGbp(min)} – ${formatGbp(max)}`,
    suffix: "Inc. VAT",
    label: `FROM ${formatGbp(min)} – ${formatGbp(max)} Inc. VAT`,
  };
}

export const STATIC_VARIANT_PRICE_DISPLAY = buildStaticVariantPriceDisplay();

export function getStaticVariantById(id) {
  return STATIC_SERVICE_VARIANTS.find((v) => v.id === id) ?? STATIC_SERVICE_VARIANTS[2];
}
