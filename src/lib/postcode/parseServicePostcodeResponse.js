const DEFAULT_NO_MATCH_MESSAGE = "Invalid Postcode";

/**
 * @param {unknown} value
 */
function isTruthyApiFlag(value) {
  if (value === true || value === 1) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

/**
 * @param {unknown} value
 */
function isFalsyApiFlag(value) {
  if (value === false || value === 0) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "false" || normalized === "0" || normalized === "no";
  }
  return false;
}

/**
 * Laravel-style envelopes often nest the real payload under `data`.
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
function unwrapPostcodePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;

  const root = /** @type {Record<string, unknown>} */ (payload);
  const inner = root.data;

  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    const innerRecord = /** @type {Record<string, unknown>} */ (inner);
    const innerHasCoverage =
      "success" in innerRecord ||
      "matched" in innerRecord ||
      "status" in innerRecord ||
      "distance" in innerRecord ||
      "message" in innerRecord ||
      "error" in innerRecord;

    if (innerHasCoverage) return innerRecord;
  }

  return root;
}

/**
 * @param {Record<string, unknown>} payload
 */
function readCoverageMatch(payload) {
  const flags = [payload.success, payload.matched, payload.status, payload.coverage, payload.in_coverage_area];

  for (const flag of flags) {
    if (isTruthyApiFlag(flag)) return true;
    if (isFalsyApiFlag(flag)) return false;
  }

  return false;
}

/**
 * @param {unknown} payload
 * @returns {{ matched: boolean, message?: string, distance?: number }}
 */
export function parseServicePostcodeCoverage(payload) {
  const record = unwrapPostcodePayload(payload);
  if (!record) {
    return { matched: false, message: DEFAULT_NO_MATCH_MESSAGE };
  }

  const matched = readCoverageMatch(record);
  const distance = typeof record.distance === "number" ? record.distance : undefined;
  const root =
    payload && typeof payload === "object" && !Array.isArray(payload)
      ? /** @type {Record<string, unknown>} */ (payload)
      : null;

  if (matched) {
    return { matched: true, distance };
  }

  const message =
    String(record.message ?? record.error ?? root?.message ?? root?.error ?? "").trim() ||
    DEFAULT_NO_MATCH_MESSAGE;

  return { matched: false, message, distance };
}

export { DEFAULT_NO_MATCH_MESSAGE };
