import { formatSiteCountryDisplay } from "@/lib/sites/siteForm";

/**
 * @param {{
 *   label: string,
 *   value: import("react").ReactNode,
 *   fullWidth?: boolean,
 * }} props
 */
export function SiteFieldItem({ label, value, fullWidth = false }) {
  return (
    <div
      className={`home1-sites-field-item${fullWidth ? " home1-sites-field-item--full" : ""}`}
    >
      <span className="home1-sites-field-label">{label}</span>
      <span className="home1-sites-field-value">{value ?? "—"}</span>
    </div>
  );
}

/**
 * @param {{
 *   children: import("react").ReactNode,
 *   columns?: 2 | 3,
 * }} props
 */
export function SiteFieldGrid({ children, columns = 2 }) {
  return (
    <div className="home1-sites-field-grid" data-columns={columns}>
      {children}
    </div>
  );
}

/**
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 */
function buildCompactLines(site) {
  const country = formatSiteCountryDisplay(site.country);
  const lines = [];

  if (site.addressLine2?.trim()) lines.push(site.addressLine2.trim());

  const locality = [site.townCity, site.county].filter(Boolean).join(", ");
  if (locality) lines.push(locality);

  const postal = [site.postcode, country].filter(Boolean).join(" · ");
  if (postal) lines.push(postal);

  return lines;
}

/**
 * @param {{ site: import("@/lib/sites/siteTypes").SavedSite }} props
 */
export default function SiteCardSummary({ site }) {
  const lines = buildCompactLines(site);

  if (!lines.length) {
    return (
      <div className="home1-sites-card-compact">
        <p className="home1-sites-card-compact-line home1-sites-card-compact-line--muted">
          No additional address details
        </p>
      </div>
    );
  }

  return (
    <div className="home1-sites-card-compact">
      {lines.map((line) => (
        <p key={line} className="home1-sites-card-compact-line">
          {line}
        </p>
      ))}
    </div>
  );
}
