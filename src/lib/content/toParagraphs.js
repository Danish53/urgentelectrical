/**
 * Decode a few common HTML entities after tags are stripped.
 * @param {string} text
 */
function decodeBasicEntities(text) {
  return String(text)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'");
}

/**
 * Strip tags while preserving paragraph / line breaks from CMS HTML or plain text.
 * Unlike a naive strip, this keeps breaks from </p>, <br>, and newlines.
 * @param {string} htmlOrText
 */
export function stripHtmlPreserveBreaks(htmlOrText) {
  return decodeBasicEntities(
    String(htmlOrText ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n\n")
      .replace(/<(p|div|h[1-6]|li|tr|blockquote)(?:\s[^>]*)?>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      // Collapse spaces/tabs but keep newlines so paragraphs can be split.
      .replace(/[^\S\n]+/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  );
}

/**
 * Flat text for meta / SEO (no paragraph structure).
 * @param {string | null | undefined} htmlOrText
 */
export function stripHtmlFlat(htmlOrText) {
  return stripHtmlPreserveBreaks(htmlOrText).replace(/\s+/g, " ").trim();
}

/**
 * Split CMS main description into display paragraphs.
 * Supports: HTML <p>/<br>, blank lines, and single newlines (textarea Enter).
 * @param {unknown} value
 * @returns {string[]}
 */
export function toParagraphs(value) {
  if (value == null) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => toParagraphs(item))
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const text = stripHtmlPreserveBreaks(String(value));
  if (!text) return [];

  const parts = text
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length ? parts : [text];
}
