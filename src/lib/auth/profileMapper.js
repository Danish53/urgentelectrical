import { getUserDisplayName } from "@/lib/auth/userDisplayName";

/** @typedef {{
 *   firstName: string,
 *   lastName: string,
 *   email: string,
 *   phone: string,
 *   company: string,
 *   country: string,
 *   postcode: string,
 *   addressLine1: string,
 *   addressLine2: string,
 *   townCity: string,
 *   county: string,
 *   displayName: string,
 * }} ProfileFormValues */

export const EMPTY_PROFILE_FORM = /** @type {ProfileFormValues} */ ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "Private",
  country: "GB",
  postcode: "",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  county: "",
  displayName: "Customer",
});

/**
 * @param {Record<string, unknown> | null | undefined} api
 * @returns {ProfileFormValues}
 */
export function apiToProfileForm(api) {
  if (!api || typeof api !== "object") return { ...EMPTY_PROFILE_FORM };

  const firstName = String(api.first_name ?? api.firstName ?? "").trim();
  const lastName = String(api.last_name ?? api.lastName ?? "").trim();
  const countryRaw = String(api.country ?? "").trim();
  const country =
    !countryRaw || countryRaw === "United Kingdom" || countryRaw === "UK" ? "GB" : countryRaw;

  const form = {
    firstName,
    lastName,
    email: String(api.email ?? "").trim(),
    phone: String(api.mobile_number ?? api.mobile ?? api.phone ?? "").trim(),
    company: String(api.company ?? "Private").trim() || "Private",
    country,
    postcode: String(api.post_code ?? api.postcode ?? "").trim(),
    addressLine1: String(api.address_line_1 ?? api.address ?? "").trim(),
    addressLine2: String(api.address_line_2 ?? "").trim(),
    townCity: String(api.town ?? api.town_city ?? "").trim(),
    county: String(api.county ?? "").trim(),
    displayName: "",
  };

  form.displayName = getUserDisplayName({ ...api, first_name: firstName, last_name: lastName });
  return form;
}

/**
 * @param {ProfileFormValues} form
 */
export function profileFormToApi(form) {
  const country =
    form.country === "GB" || !form.country?.trim() ? null : form.country.trim();

  return {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    mobile_number: form.phone.trim() || null,
    company: form.company.trim() || "Private",
    country,
    post_code: form.postcode.trim(),
    address_line_1: form.addressLine1.trim(),
    address_line_2: form.addressLine2.trim() || null,
    town: form.townCity.trim(),
    county: form.county.trim() || null,
  };
}

/**
 * @param {Record<string, unknown>} obj
 */
function isProfileRecord(obj) {
  return (
    "email" in obj ||
    "first_name" in obj ||
    "firstName" in obj ||
    "mobile_number" in obj ||
    "mobile" in obj ||
    "address_line_1" in obj
  );
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown> | null}
 */
function unwrapProfileCandidate(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = /** @type {Record<string, unknown>} */ (value);

  if (record.user && typeof record.user === "object" && !Array.isArray(record.user)) {
    return /** @type {Record<string, unknown>} */ (record.user);
  }
  if (record.profile && typeof record.profile === "object" && !Array.isArray(record.profile)) {
    return /** @type {Record<string, unknown>} */ (record.profile);
  }
  if (isProfileRecord(record)) return record;
  return null;
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
export function parseProfileResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  const fromRoot = unwrapProfileCandidate(record);
  if (fromRoot) return fromRoot;

  if (record.data !== undefined) {
    const fromData = unwrapProfileCandidate(record.data);
    if (fromData) return fromData;
  }

  return null;
}
