import { SERVICE_BY_POSTAL_CODE_PROXY } from "@/constants/servicesApi";
import { normalizePostcodeForApi } from "@/lib/postcode/normalizePostcode";

const DEFAULT_NO_MATCH_MESSAGE = "Invalid Postcode";

/**
 * @typedef {{ matched: true, distance?: number }} ServicePostcodeMatch
 * @typedef {{ matched: false, message: string, distance?: number }} ServicePostcodeNoMatch
 * @typedef {ServicePostcodeMatch | ServicePostcodeNoMatch} ServicePostcodeResult
 */

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

  if (!ok) {
    const message =
      String(data?.error ?? data?.message ?? "").trim() ||
      (data?.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : "") ||
      DEFAULT_NO_MATCH_MESSAGE;
    return { matched: false, message };
  }

  if (data?.success === true) {
    return { matched: true, distance: typeof data.distance === "number" ? data.distance : undefined };
  }

  return {
    matched: false,
    message: String(data?.message ?? data?.error ?? "").trim() || DEFAULT_NO_MATCH_MESSAGE,
    distance: typeof data?.distance === "number" ? data.distance : undefined,
  };
}
