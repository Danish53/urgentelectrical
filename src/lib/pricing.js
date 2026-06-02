/** UK VAT multiplier — API catalogue prices are ex. VAT unless noted otherwise. */
export const VAT_MULTIPLIER = 1.2;

function parsePriceNumber(price) {
  if (typeof price === "number") return Number.isFinite(price) ? price : NaN;
  if (typeof price !== "string") return NaN;

  // Keep only digits, decimal dot, and minus to handle values like "£120.00" or "120,00".
  const normalized = price.replace(/,/g, ".").replace(/[^0-9.-]/g, "");
  return parseFloat(normalized);
}

/** Ex-VAT amount → inc. VAT (+20%). */
export function priceIncVatFromString(price) {
  const n = parsePriceNumber(price);
  if (!Number.isFinite(n)) return "0.00";
  return (n * VAT_MULTIPLIER).toFixed(2);
}

/** Normalise a numeric price string to 2 decimal places (ex. VAT base). */
export function formatPriceAmount(price) {
  const n = parsePriceNumber(price);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

/** @deprecated Use formatPriceAmount + getDisplayPrice; API detail prices are ex. VAT */
export function formatApiPrice(price) {
  return formatPriceAmount(price);
}

export function getVatSuffix(incVat) {
  return incVat ? "Inc. VAT" : "Exc. VAT";
}

/** Display amount for UI from ex-VAT catalogue price. */
export function getDisplayPrice(excPrice, incVat) {
  return incVat ? priceIncVatFromString(excPrice) : formatPriceAmount(excPrice);
}

/** £156 or £156.00 for ribbon display */
export function formatGbpDisplay(amount, { trimZeros = false } = {}) {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return "£0";
  if (trimZeros && n % 1 === 0) return `£${n.toFixed(0)}`;
  return `£${n.toFixed(2)}`;
}

export function formatGbpFromExc(excPrice, incVat, options) {
  return formatGbpDisplay(getDisplayPrice(excPrice, incVat), options);
}

export function buildRangePriceDisplay(variants, baseExcPrice) {
  if (variants?.length) {
    const amounts = variants.map((v) => parseFloat(v.priceExcVat ?? v.price ?? 0));
    const min = Math.min(...amounts).toFixed(2);
    const max = Math.max(...amounts).toFixed(2);
    return {
      type: "range",
      min,
      max,
      prefix: "FROM",
    };
  }

  const exc = formatPriceAmount(baseExcPrice);
  return {
    type: "fixed",
    amount: exc,
    prefix: "FROM",
  };
}
