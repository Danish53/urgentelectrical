import ProfilePageClient from "@/components/account/ProfilePageClient";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "My Profile",
  "Manage your Urgent Electrical account — personal details, contact info, and security.",
  { robots: { index: false, follow: false } }
);

export default function AccountProfilePage() {
  return <ProfilePageClient />;
}
