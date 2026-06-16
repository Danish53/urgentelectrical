import { writeCheckoutAddress } from "@/lib/checkout/checkoutAddressFields";

/**
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 * @param {Record<string, unknown>} [currentDetails]
 */
export function mapSavedSiteToCheckoutDetails(site, currentDetails = {}) {
  const addressLine1 = site.addressLine1 || site.name || "";
  const addressLine2 = site.addressLine2 || "";
  const country =
    site.country === "United Kingdom" || site.country === "UK" || site.country === "GB"
      ? "GB"
      : site.country || String(currentDetails.siteCountry ?? "GB");

  const withSite = writeCheckoutAddress(currentDetails, "site", {
    address: addressLine1,
    addressLine2,
    city: site.townCity || "",
    postcode: (site.postcode || "").toUpperCase(),
    county: site.county || "",
    country,
  });

  return {
    ...withSite,
    siteSameAsBilling: false,
    siteAddressId: site.id,
  };
}
