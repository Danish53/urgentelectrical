import SitesPageClient from "@/components/account/SitesPageClient";
import "../../home1/home1.css";
import "../account.css";

export const metadata = {
  title: "My Sites | Urgent Electrical",
  description: "Manage saved service locations for faster booking.",
  robots: { index: false, follow: false },
};

export default function AccountSitesPage() {
  return <SitesPageClient />;
}
