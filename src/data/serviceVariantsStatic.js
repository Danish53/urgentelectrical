/** Static variant options for service detail UI (temporary — wire to CMS/data later) */
export const STATIC_SERVICE_VARIANTS = [
  { id: "1-5", label: "1-5 Items", priceIncVat: "78.00" },
  { id: "6-10", label: "6-10 Items", priceIncVat: "90.00" },
  { id: "10-15", label: "10-15 Items", priceIncVat: "102.00" },
  { id: "15-20", label: "15-20 Items", priceIncVat: "114.00" },
  { id: "20-30", label: "20-30 Items", priceIncVat: "132.00" },
  { id: "30-40", label: "30-40 Items", priceIncVat: "156.00" },
  { id: "40-50", label: "40-50 Items", priceIncVat: "186.00" },
];

export const STATIC_VARIANT_DEFAULT_ID = "10-15";

export const STATIC_VARIANT_PRICE_DISPLAY = {
  type: "range",
  prefix: "FROM",
  amounts: "£78.00 – £186.00",
  suffix: "Inc. VAT",
};

export function getStaticVariantById(id) {
  return STATIC_SERVICE_VARIANTS.find((v) => v.id === id) ?? STATIC_SERVICE_VARIANTS[2];
}
