import SiteDetailPageClient from "@/components/account/SiteDetailPageClient";

export const metadata = {
  title: "Site Details | Urgent Electrical",
  description: "View and update a saved service location.",
  robots: { index: false, follow: false },
};

export default function AccountSiteDetailPage() {
  return <SiteDetailPageClient />;
}
