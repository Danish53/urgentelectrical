import {
  formatSiteAddress,
  formatSiteContactName,
  siteFromForm,
} from "@/lib/sites/siteForm";

/**
 * @param {import("@/lib/sites/siteForm").SiteFormValues} form
 */
export function formToApiPayload(form) {
  return {
    country: form.country.trim() || "United Kingdom",
    address_line_1: form.addressLine1.trim(),
    address_line_2: form.addressLine2.trim() || null,
    post_code: form.postcode.trim(),
    town: form.townCity.trim(),
    county: form.county.trim() || null,
    is_default: form.isDefault ? 1 : 0,
    title: form.title.trim() || null,
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    description: form.description.trim() || null,
    mobile: form.mobile.trim(),
    email: form.email.trim() || null,
  };
}

/**
 * @param {Record<string, unknown>} api
 * @returns {import("@/lib/sites/siteForm").SiteFormValues}
 */
export function apiRecordToForm(api) {
  const country = String(api.country ?? "United Kingdom").trim() || "United Kingdom";

  return {
    country,
    postcode: String(api.post_code ?? api.postcode ?? "").trim(),
    addressLine1: String(api.address_line_1 ?? "").trim(),
    addressLine2: String(api.address_line_2 ?? "").trim(),
    townCity: String(api.town ?? api.town_city ?? "").trim(),
    county: api.county == null ? "" : String(api.county).trim(),
    isDefault:
      api.is_default === 1 ||
      api.is_default === true ||
      api.is_default === "1" ||
      String(api.is_default).toLowerCase() === "true",
    title: api.title == null ? "" : String(api.title).trim(),
    firstName: String(api.first_name ?? api.firstName ?? "").trim(),
    lastName: String(api.last_name ?? api.lastName ?? "").trim(),
    mobile: String(api.mobile ?? api.phone ?? "").trim(),
    email: api.email == null ? "" : String(api.email).trim(),
    description: api.description == null ? "" : String(api.description).trim(),
  };
}

/**
 * @param {Record<string, unknown>} api
 */
export function normalizeSiteId(api) {
  const raw = api.id ?? api.site_address_id ?? api.site_id;
  if (raw == null || raw === "") return "";
  return String(raw);
}

/**
 * @param {Record<string, unknown>} api
 * @returns {import("@/lib/sites/siteTypes").SavedSite}
 */
export function apiRecordToSavedSite(api) {
  const id = normalizeSiteId(api);
  const form = apiRecordToForm(api);
  const site = siteFromForm(form, id);
  const address = formatSiteAddress(form);
  if (address) site.address = address;

  if (api.user_id != null) site.userId = String(api.user_id);
  if (api.added_by != null) site.addedBy = String(api.added_by);
  if (api.created_at != null) site.createdAt = String(api.created_at);
  if (api.updated_at != null) site.updatedAt = String(api.updated_at);

  const contact = formatSiteContactName(form);
  if (contact) site.contact = contact;

  return site;
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[] | null}
 */
function extractSiteRows(value) {
  if (!value) return null;

  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object");
  }

  if (typeof value !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (value);

  if (Array.isArray(record.data)) {
    return record.data.filter((item) => item && typeof item === "object");
  }

  const arrayKeys = ["site_addresses", "site_address", "addresses", "sites", "items", "results", "records"];

  for (const key of arrayKeys) {
    const list = record[key];
    if (Array.isArray(list)) {
      return list.filter((item) => item && typeof item === "object");
    }
  }

  if (record.data !== undefined && typeof record.data === "object") {
    return extractSiteRows(record.data);
  }

  return null;
}

/**
 * @typedef {import("@/lib/sites/siteTypes").SitesPagination} SitesPagination
 */

/**
 * @param {unknown} payload
 * @returns {{ sites: Record<string, unknown>[], pagination: SitesPagination | null }}
 */
export function parseSitesListPayload(payload) {
  let root = payload;

  if (root && typeof root === "object" && !Array.isArray(root)) {
    const record = /** @type {Record<string, unknown>} */ (root);
    if (record.status === true && record.data && typeof record.data === "object") {
      root = record.data;
    }
  }

  const sites = extractSiteRows(root) ?? [];

  if (!root || typeof root !== "object" || Array.isArray(root)) {
    return { sites, pagination: null };
  }

  const record = /** @type {Record<string, unknown>} */ (root);
  const currentPage = Number(record.current_page);
  const lastPage = Number(record.last_page);

  if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) {
    return { sites, pagination: null };
  }

  const total = Number(record.total);
  const perPage = Number(record.per_page);
  const from = Number(record.from);
  const to = Number(record.to);
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : sites.length;
  const safeTotal = Number.isFinite(total) ? total : sites.length;
  const safeFrom = Number.isFinite(from) ? from : (currentPage - 1) * safePerPage + 1;
  const safeTo = Number.isFinite(to) ? to : safeFrom + Math.max(sites.length, 1) - 1;

  return {
    sites,
    pagination: {
      currentPage,
      lastPage,
      total: safeTotal,
      perPage: safePerPage,
      from: safeFrom,
      to: safeTo,
      hasMore: currentPage < lastPage,
    },
  };
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown>[]}
 */
export function parseSitesListResponse(payload) {
  return parseSitesListPayload(payload).sites;
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
export function parseSiteDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.status === true && record.data && typeof record.data === "object") {
    const data = /** @type {Record<string, unknown>} */ (record.data);
    if ("id" in data) return data;
    return parseSiteDetailResponse(data);
  }

  if (record.success === true && record.data && typeof record.data === "object") {
    const data = /** @type {Record<string, unknown>} */ (record.data);
    if (data.site_address && typeof data.site_address === "object") {
      return /** @type {Record<string, unknown>} */ (data.site_address);
    }
    if (!Array.isArray(data) && "id" in data) return data;
  }

  if (record.site_address && typeof record.site_address === "object") {
    return /** @type {Record<string, unknown>} */ (record.site_address);
  }

  if ("id" in record) {
    return record;
  }

  return null;
}
