import { Suspense } from "react";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";
import { buildCheckoutMetadata } from "@/data/checkoutPage";
import "../home1/home1.css";
import "./checkout.css";

const meta = buildCheckoutMetadata();

export const metadata = {
  metadataBase: new URL("https://www.urgentelectrical.services"),
  title: meta.title,
  description: meta.description,
  alternates: meta.alternates,
  robots: meta.robots,
};

function CheckoutFallback() {
  return (
    <div className="home1-checkout-page min-h-[50vh] flex items-center justify-center text-[#64748b] text-sm font-medium">
      Loading checkout…
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutPageClient />
    </Suspense>
  );
}
