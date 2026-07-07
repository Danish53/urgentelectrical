import { SERVICE_BY_POSTAL_CODE_PROXY } from "@/constants/servicesApi";
import { DEFAULT_NO_MATCH_MESSAGE } from "@/lib/postcode/parseServicePostcodeResponse";
import { normalizePostcodeForApi } from "@/lib/postcode/normalizePostcode";

/**
 * @typedef {{ outcome: "in_area", distance?: number }} ServicePostcodeInArea
 * @typedef {{ outcome: "out_of_area", distance?: number }} ServicePostcodeOutOfArea
 * @typedef {{ outcome: "error", message: string }} ServicePostcodeError
 * @typedef {ServicePostcodeInArea | ServicePostcodeOutOfArea | ServicePostcodeError} ServicePostcodeResult
 */

/**
 * @param {unknown} value
 */
function isApiSuccessTrue(value) {
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
function isApiSuccessFalse(value) {
  if (value === false || value === 0) return true;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "false" || normalized === "0" || normalized === "no";
  }
  return false;
}

/**
 * @param {unknown} data
 */
function readDistanceFromPayload(data) {
  if (!data || typeof data !== "object") return undefined;
  const record = /** @type {Record<string, unknown>} */ (data);
  if (typeof record.distance === "number") return record.distance;
  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    const inner = /** @type {Record<string, unknown>} */ (record.data);
    if (typeof inner.distance === "number") return inner.distance;
  }
  return undefined;
}

/**
 * @param {Response} response
 */
async function parseProxyResponse(response) {
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  return { data, ok: response.ok, status: response.status };
}

/**
 * @param {{ source: string, serviceSlug: string, postCode: string }} params
 * @returns {Promise<ServicePostcodeResult>}
 */
export async function checkServiceByPostalCode({ source, serviceSlug, postCode }) {
  const normalized = normalizePostcodeForApi(postCode);
  const slug = String(serviceSlug ?? "").trim();

  if (!slug || !normalized) {
    return { outcome: "error", message: "Please select a service and enter a valid postcode." };
  }

  let response;
  try {
    response = await fetch(SERVICE_BY_POSTAL_CODE_PROXY, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: String(source ?? "").trim() || "home",
        service_slug: slug,
        post_code: normalized,
      }),
    });
  } catch {
    return {
      outcome: "error",
      message: "Unable to reach the server. Check your connection and try again.",
    };
  }

  const { data, ok } = await parseProxyResponse(response);
  const record = data && typeof data === "object" ? /** @type {Record<string, unknown>} */ (data) : null;
  const distance = readDistanceFromPayload(data);

  if (ok && record) {
    // Laravel API: success:true = out of service area, success:false = in coverage area.
    if (isApiSuccessTrue(record.success)) {
      return { outcome: "out_of_area", distance };
    }
    if (isApiSuccessFalse(record.success)) {
      return { outcome: "in_area", distance };
    }
  }

  const message =
    String(record?.error ?? record?.message ?? "").trim() ||
    (record?.errors && typeof record.errors === "object"
      ? Object.values(record.errors).flat().filter(Boolean).join(" ")
      : "") ||
    DEFAULT_NO_MATCH_MESSAGE;
  return { outcome: "error", message };
}
