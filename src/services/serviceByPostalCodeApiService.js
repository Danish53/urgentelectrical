import { SERVICE_BY_POSTAL_CODE_PROXY } from "@/constants/servicesApi";
import { DEFAULT_NO_MATCH_MESSAGE } from "@/lib/postcode/parseServicePostcodeResponse";
import { normalizePostcodeForApi } from "@/lib/postcode/normalizePostcode";

/**
 * @typedef {{ matched: true, distance?: number }} ServicePostcodeMatch
 * @typedef {{ matched: false, message: string, distance?: number }} ServicePostcodeNoMatch
 * @typedef {ServicePostcodeMatch | ServicePostcodeNoMatch} ServicePostcodeResult
 */

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
    return { matched: false, message: "Please select a service and enter a valid postcode." };
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
      matched: false,
      message: "Unable to reach the server. Check your connection and try again.",
    };
  }

  const { data, ok } = await parseProxyResponse(response);

  if (ok) {
    return { matched: true, distance: readDistanceFromPayload(data) };
  }

  const record = data && typeof data === "object" ? /** @type {Record<string, unknown>} */ (data) : null;
  const message =
    String(record?.error ?? record?.message ?? "").trim() ||
    (record?.errors && typeof record.errors === "object"
      ? Object.values(record.errors).flat().filter(Boolean).join(" ")
      : "") ||
    DEFAULT_NO_MATCH_MESSAGE;
  return { matched: false, message };
}
