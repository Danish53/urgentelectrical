import Link from "next/link";
import { IconCheck } from "@/components/home1/icons";
import { formatLongDate, formatMoney } from "@/components/checkout/checkoutUtils";

export default function CheckoutComplete({ booking }) {
  return (
    <div className="home1-checkout-complete-wrap">
      <div className="home1-checkout-complete" role="status" aria-live="polite">
        <div className="home1-checkout-complete-icon" aria-hidden="true">
          <IconCheck className="w-7 h-7 text-[#16a34a]" />
        </div>

        <h1 className="home1-checkout-complete-title font-playfair">Booking confirmed</h1>
        <p className="home1-checkout-complete-text">
          Thanks, {booking.firstName}. Your <strong>{booking.serviceName}</strong> visit is booked.
        </p>

        <div className="home1-checkout-complete-meta">
          <div className="home1-checkout-complete-row">
            <span>Date</span>
            <strong>{formatLongDate(booking.date)}</strong>
          </div>
          <div className="home1-checkout-complete-row">
            <span>Time</span>
            <strong>{booking.time}</strong>
          </div>
          <div className="home1-checkout-complete-row">
            <span>Total</span>
            <strong>{formatMoney(booking.totalInc)} Inc. VAT</strong>
          </div>
        </div>

        <Link href="/" className="home1-checkout-complete-btn">
          Back to home
        </Link>
      </div>
    </div>
  );
}
