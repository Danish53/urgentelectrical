/** Prefer short brand so document titles stay within ~60 characters. */
export const DOCUMENT_TITLE_BRAND = "Urgent Electrical";

const MAX_DOCUMENT_TITLE_LENGTH = 60;

/**
 * Remove trailing/embedded Urgent Electrical brand segments to avoid
 * "Title | Urgent Electrical | Urgent Electrical Services".
 * @param {string | null | undefined} title
 */
export function stripTitleBrand(title) {
  return String(title ?? "")
    .replace(/\s*\|\s*Urgent Electrical(?:\s+Services)?\s*/gi, " | ")
    .replace(/\s*\|\s*$/g, "")
    .replace(/^\s*\|\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @param {string} text
 * @param {number} max
 */
export function truncateTitle(text, max) {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= max) return normalized;

  const cut = normalized.slice(0, Math.max(0, max - 1));
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > Math.floor(max * 0.55) ? cut.slice(0, lastSpace) : cut)
    .replace(/[|,:;\-–—.\s]+$/g, "")
    .trim();
  return base ? `${base}…` : `${normalized.slice(0, max - 1)}…`;
}

/**
 * Next.js `metadata.title` value — always `absolute` so the root
 * `template: "%s | Urgent Electrical Services"` cannot double-append the brand.
 *
 * @param {string | null | undefined} pageTitle
 * @param {{ maxLength?: number }} [options]
 * @returns {{ absolute: string }}
 */
export function documentTitle(pageTitle, options = {}) {
  const maxLength = options.maxLength ?? MAX_DOCUMENT_TITLE_LENGTH;
  let base = stripTitleBrand(pageTitle);
  // Drop incomplete CMS fragments like "Emergency Electrician in"
  if (/\bin$/i.test(base)) {
    base = base.replace(/\s+in$/i, "").trim();
  }
  if (!base) {
    return { absolute: DOCUMENT_TITLE_BRAND };
  }

  const withBrand = `${base} | ${DOCUMENT_TITLE_BRAND}`;
  if (withBrand.length <= maxLength) {
    return { absolute: withBrand };
  }

  if (base.length <= maxLength) {
    return { absolute: base };
  }

  return { absolute: truncateTitle(base, maxLength) };
}
