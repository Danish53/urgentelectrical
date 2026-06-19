import ProfilePageClient from "@/components/account/ProfilePageClient";

export const metadata = {
  title: "My Profile | Urgent Electrical",
  description: "Manage your Urgent Electrical account — personal details, contact info, and security.",
  robots: { index: false, follow: false },
};

export default function AccountProfilePage() {
  return <ProfilePageClient />;
}
