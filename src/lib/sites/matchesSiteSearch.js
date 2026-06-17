/**
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 * @param {string} query
 */
export function matchesSiteSearch(site, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    site.name,
    site.address,
    site.addressLine1,
    site.addressLine2,
    site.postcode,
    site.townCity,
    site.county,
    site.country,
    site.contact,
    site.firstName,
    site.lastName,
    site.phone,
    site.mobile,
    site.email,
    site.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}
