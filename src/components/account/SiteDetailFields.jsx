import {
  formatSiteContactName,
  formatSiteCountryDisplay,
  formatSiteTimestamp,
} from "@/lib/sites/siteForm";
import { SiteFieldGrid, SiteFieldItem } from "@/components/account/SiteCardSummary";

/**
 * @param {{
 *   site: import("@/lib/sites/siteTypes").SavedSite,
 * }} props
 */
export default function SiteDetailFields({ site }) {
  const contactName = formatSiteContactName(site) || "—";

  return (
    <div className="home1-sites-detail-sections">
      <section className="home1-sites-detail-section">
        <h3 className="home1-sites-detail-section-title">Address</h3>
        <SiteFieldGrid columns={3}>
          <SiteFieldItem label="Address line 1" value={site.addressLine1 || "—"} fullWidth />
          <SiteFieldItem label="Address line 2" value={site.addressLine2 || "—"} fullWidth />
          <SiteFieldItem label="Town" value={site.townCity || "—"} />
          <SiteFieldItem label="County" value={site.county || "—"} />
          <SiteFieldItem label="Postcode" value={site.postcode || "—"} />
          <SiteFieldItem label="Country" value={formatSiteCountryDisplay(site.country)} />
          <SiteFieldItem label="Default address" value={site.primary ? "Yes" : "No"} />
        </SiteFieldGrid>
      </section>

      <section className="home1-sites-detail-section">
        <h3 className="home1-sites-detail-section-title">Contact details</h3>
        <SiteFieldGrid columns={3}>
          <SiteFieldItem label="Title" value={site.title || "—"} />
          <SiteFieldItem label="First name" value={site.firstName || "—"} />
          <SiteFieldItem label="Last name" value={site.lastName || "—"} />
          <SiteFieldItem label="Contact name" value={contactName} />
          <SiteFieldItem label="Mobile" value={site.mobile || site.phone || "—"} />
          <SiteFieldItem label="Email" value={site.email || "—"} />
          <SiteFieldItem label="Description" value={site.description || "—"} fullWidth />
        </SiteFieldGrid>
      </section>

      <section className="home1-sites-detail-section">
        <h3 className="home1-sites-detail-section-title">Record</h3>
        <SiteFieldGrid columns={3}>
          <SiteFieldItem label="ID" value={site.id || "—"} />
          <SiteFieldItem label="User ID" value={site.userId || "—"} />
          <SiteFieldItem label="Added by" value={site.addedBy || "—"} />
          <SiteFieldItem label="Created at" value={formatSiteTimestamp(site.createdAt)} />
          <SiteFieldItem label="Updated at" value={formatSiteTimestamp(site.updatedAt)} />
        </SiteFieldGrid>
      </section>
    </div>
  );
}
