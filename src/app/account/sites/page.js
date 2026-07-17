import SitesPageClient from "@/components/account/SitesPageClient";
import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("My Sites"),
  description: "Manage saved service locations for faster booking.",
  robots: { index: false, follow: false },
};

export default function AccountSitesPage() {
  return <SitesPageClient />;
}
