/** UK postcode for API — strip spaces and uppercase (e.g. "NG1 1AA" → "NG11AA"). */
export function normalizePostcodeForApi(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .toUpperCase();
}
