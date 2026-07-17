import OrdersPageClient from "@/components/account/OrdersPageClient";
import { documentTitle } from "@/lib/seo/documentTitle";

export const metadata = {
  title: documentTitle("My Orders"),
  description:
    "View and manage your electrical service bookings — upcoming visits, completed jobs, and order history.",
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return <OrdersPageClient />;
}
