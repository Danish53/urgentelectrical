import ProfilePageClient from "@/components/account/ProfilePageClient";
import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("My Profile"),
  description: "Manage your Urgent Electrical account — personal details, contact info, and security.",
  robots: { index: false, follow: false },
};

export default function AccountProfilePage() {
  return <ProfilePageClient />;
}
