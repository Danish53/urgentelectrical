import ProfilePageClient from "@/components/account/ProfilePageClient";
import "../../home1/home1.css";
import "../account.css";

export const metadata = {
  title: "My Profile | Urgent Electrical",
  description: "Manage your Urgent Electrical account — personal details, contact info, and security.",
  robots: { index: false, follow: false },
};

export default function AccountProfilePage() {
  return <ProfilePageClient />;
}
