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
  country: "GB",
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
 * @param {SiteFormValues} form
 */
export function formatSiteAddress(form) {
  const parts = [
    form.addressLine1.trim(),
    form.addressLine2.trim(),
    form.townCity.trim(),
    form.county.trim(),
    form.postcode.trim(),
  ].filter(Boolean);
  return parts.join(", ");
}

/**
 * @param {SiteFormValues} form
 */
export function formatSiteContact(form) {
  const name = [form.title, form.firstName, form.lastName]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");
  return name || "—";
}

/**
 * @param {SiteFormValues} form
 * @param {string} [id]
 * @returns {SavedSite}
 */
export function siteFromForm(form, id) {
  const address = formatSiteAddress(form);
  const line1 = form.addressLine1.trim();
  const town = form.townCity.trim();

  return {
    id: id ?? `site-${Date.now()}`,
    name: line1 || town || "New site",
    contact: formatSiteContact(form),
    phone: form.mobile.trim() || "—",
    email: form.email.trim() || "",
    address,
    notes: form.description.trim(),
    jobs: 0,
    lastVisit: "Not yet",
    primary: form.isDefault,
    country: form.country,
    postcode: form.postcode.trim(),
    addressLine1: line1,
    addressLine2: form.addressLine2.trim(),
    townCity: town,
    county: form.county.trim(),
    title: form.title.trim(),
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
  };
}

/**
 * @param {SavedSite[]} sites
 * @param {SavedSite} added
 */
export function applyNewSite(sites, added) {
  const next = added.primary
    ? sites.map((s) => ({ ...s, primary: false }))
    : [...sites];
  return [added, ...next];
}

/**
 * @param {SavedSite} site
 * @returns {SiteFormValues}
 */
export function siteToForm(site) {
  return {
    country: site.country || "GB",
    postcode: site.postcode || "",
    addressLine1: site.addressLine1 || site.name || "",
    addressLine2: site.addressLine2 || "",
    townCity: site.townCity || "",
    county: site.county || "",
    isDefault: Boolean(site.primary),
    title: site.title ?? "",
    firstName: site.firstName ?? "",
    lastName: site.lastName ?? "",
    mobile: site.phone && site.phone !== "—" ? site.phone : "",
    email: site.email || "",
    description: site.notes || "",
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
