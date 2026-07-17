import SiteDetailPageClient from "@/components/account/SiteDetailPageClient";
import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("Site Details"),
  description: "View and update a saved service location.",
  robots: { index: false, follow: false },
};

export default function AccountSiteDetailPage() {
  return <SiteDetailPageClient />;
}
