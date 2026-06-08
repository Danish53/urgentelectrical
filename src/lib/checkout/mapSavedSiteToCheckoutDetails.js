/**
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 * @param {Record<string, unknown>} [currentDetails]
 */
export function mapSavedSiteToCheckoutDetails(site, currentDetails = {}) {
  const addressLine1 = site.addressLine1 || site.name || "";
  const addressLine2 = site.addressLine2 || "";

  return {
    ...currentDetails,
    address: addressLine1 || String(currentDetails.address ?? ""),
    addressLine2,
    city: site.townCity || String(currentDetails.city ?? ""),
    postcode: (site.postcode || String(currentDetails.postcode ?? "")).toUpperCase(),
    county: site.county || currentDetails.county || "",
    country: site.country || currentDetails.country || "GB",
    phone:
      site.phone && site.phone !== "—"
        ? site.phone
        : String(currentDetails.phone ?? ""),
    firstName: site.firstName || String(currentDetails.firstName ?? ""),
    lastName: site.lastName || String(currentDetails.lastName ?? ""),
    email: site.email || String(currentDetails.email ?? ""),
    title: site.title || String(currentDetails.title ?? "Mr"),
    siteAddressId: site.id,
  };
}
