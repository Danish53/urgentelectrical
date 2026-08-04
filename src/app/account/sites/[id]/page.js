import SiteDetailPageClient from "@/components/account/SiteDetailPageClient";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "Site Details",
  "View and update a saved service location.",
  { robots: { index: false, follow: false } }
);

export default function AccountSiteDetailPage() {
  return <SiteDetailPageClient />;
}
