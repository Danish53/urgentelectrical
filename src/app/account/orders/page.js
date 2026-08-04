import OrdersPageClient from "@/components/account/OrdersPageClient";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

export const metadata = buildSeoMetadata(
  "My Orders",
  "View and manage your electrical service bookings — upcoming visits, completed jobs, and order history.",
  { robots: { index: false, follow: false } }
);

export default function AccountOrdersPage() {
  return <OrdersPageClient />;
}
