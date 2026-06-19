import SitesPageClient from "@/components/account/SitesPageClient";

export const metadata = {
  title: "My Sites | Urgent Electrical",
  description: "Manage saved service locations for faster booking.",
  robots: { index: false, follow: false },
};

export default function AccountSitesPage() {
  return <SitesPageClient />;
}
