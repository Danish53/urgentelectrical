import SitesPageClient from "@/components/account/SitesPageClient";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "My Sites",
  "Manage saved service locations for faster booking.",
  { robots: { index: false, follow: false } }
);

export default function AccountSitesPage() {
  return <SitesPageClient />;
}
