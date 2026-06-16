/** @typedef {import("@/lib/sites/siteTypes").SavedSite} SavedSite */

/** @typedef {{
 *   country: string,
 *   postcode: string,
 *   addressLine1: string,
 *   addressLine2: string,
 *   townCity: string,
 *   county: string,
 *   isDefault: boolean,
 *   title: string,
 *   firstName: string,
 *   lastName: string,
 *   mobile: string,
 *   email: string,
 *   description: string,
 * }} SiteFormValues */

export const EMPTY_SITE_FORM = /** @type {SiteFormValues} */ ({
  country: "United Kingdom",
  postcode: "",
  addressLine1: "",
  addressLine2: "",
  townCity: "",
  county: "",
  isDefault: false,
  title: "",
  firstName: "",
  lastName: "",
  mobile: "",
  email: "",
  description: "",
});

/**
 * @param {string} country
 */
export function formatSiteCountryDisplay(country) {
  const value = String(country ?? "").trim();
  if (!value || value === "GB" || value === "UK") return "United Kingdom";
  return value;
}

/**
 * @param {string | null | undefined} value
 */
export function formatSiteTimestamp(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * @param {Pick<SiteFormValues, "title" | "firstName" | "lastName"> | SavedSite} values
 */
export function formatSiteContactName(values) {
  const title = String(values.title ?? "").trim();
  const first = String(values.firstName ?? "").trim();
  const last = String(values.lastName ?? "").trim();
  const name = [first, last].filter(Boolean).join(" ");
  if (title && name) return `${title} ${name}`;
  return name || title || "";
}

/**
 * @param {SiteFormValues} form
 */
export function formatSiteAddress(form) {
  const parts = [
    form.addressLine1.trim(),
    form.addressLine2.trim(),
    form.townCity.trim(),
    form.county.trim(),
    form.postcode.trim(),
    formatSiteCountryDisplay(form.country),
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * @param {SiteFormValues} form
 * @param {string} [id]
 * @returns {SavedSite}
 */
export function siteFromForm(form, id) {
  const line1 = form.addressLine1.trim();
  const contact = formatSiteContactName(form);
  const mobile = form.mobile.trim();

  return {
    id: id ?? `site-${Date.now()}`,
    name: line1 || form.townCity.trim() || "Saved address",
    address: formatSiteAddress(form),
    primary: form.isDefault,
    country: form.country.trim() || "United Kingdom",
    postcode: form.postcode.trim(),
    addressLine1: line1,
    addressLine2: form.addressLine2.trim(),
    townCity: form.townCity.trim(),
    county: form.county.trim(),
    title: form.title.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    contact,
    phone: mobile,
    mobile,
    email: form.email.trim(),
    description: form.description.trim(),
  };
}

/**
 * @param {SavedSite[]} sites
 * @param {SavedSite} added
 */
export function applyNewSite(sites, added) {
  const next = added.primary ? sites.map((s) => ({ ...s, primary: false })) : [...sites];
  return [added, ...next];
}

/**
 * @param {SavedSite} site
 * @returns {SiteFormValues}
 */
export function siteToForm(site) {
  return {
    country: site.country || "United Kingdom",
    postcode: site.postcode || "",
    addressLine1: site.addressLine1 || site.name || "",
    addressLine2: site.addressLine2 || "",
    townCity: site.townCity || "",
    county: site.county || "",
    isDefault: Boolean(site.primary),
    title: site.title || "",
    firstName: site.firstName || "",
    lastName: site.lastName || "",
    mobile: site.mobile || site.phone || "",
    email: site.email || "",
    description: site.description || "",
  };
}

/**
 * @param {SavedSite[]} sites
 * @param {SavedSite} updated
 */
export function applyUpdatedSite(sites, updated) {
  return sites.map((s) => {
    if (s.id === updated.id) return updated;
    if (updated.primary) return { ...s, primary: false };
    return s;
  });
}

/**
 * @param {SavedSite[]} sites
 * @param {string} id
 */
export function removeSite(sites, id) {
  return sites.filter((s) => s.id !== id);
}
