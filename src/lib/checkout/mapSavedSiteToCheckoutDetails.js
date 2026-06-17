import { writeCheckoutAddress, readCheckoutAddress } from "@/lib/checkout/checkoutAddressFields";

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

/**
 * Logged-in checkout: saved site drives both site + billing for delivery fee / validate-order.
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 * @param {Record<string, unknown>} [currentDetails]
 */
export function mapSavedSiteToLoggedInCheckoutDetails(site, currentDetails = {}) {
  const mapped = mapSavedSiteToCheckoutDetails(site, currentDetails);
  const siteAddress = readCheckoutAddress(mapped, "site");
  const withBilling = writeCheckoutAddress(mapped, "billing", siteAddress);

  return {
    ...withBilling,
    siteSameAsBilling: true,
    siteAddressId: String(site.id ?? ""),
    title: String(site.title ?? withBilling.title ?? "Mr").trim() || "Mr",
    firstName:
      String(withBilling.firstName ?? "").trim() ||
      String(site.firstName ?? "").trim() ||
      String(site.contact ?? "").trim().split(/\s+/)[0] ||
      "",
    lastName:
      String(withBilling.lastName ?? "").trim() ||
      String(site.lastName ?? "").trim() ||
      "",
    phone:
      String(withBilling.phone ?? "").trim() ||
      String(site.mobile ?? site.phone ?? "").trim(),
    email: String(withBilling.email ?? "").trim() || String(site.email ?? "").trim(),
  };
}
