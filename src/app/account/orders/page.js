import OrdersPageClient from "@/components/account/OrdersPageClient";
import "../../home1/home1.css";
import "../account.css";

export const metadata = {
  title: "My Orders | Urgent Electrical",
  description:
    "View and manage your electrical service bookings — upcoming visits, completed jobs, and order history.",
  robots: { index: false, follow: false },
};

export default function AccountOrdersPage() {
  return <OrdersPageClient />;
}
