import Link from "next/link";
import { IconCheck } from "@/components/home1/icons";
import { formatLongDate, formatMoney } from "@/components/checkout/checkoutUtils";

const TRUST_ITEMS = [
  "NICEIC approved engineers",
  "Fixed transparent pricing",
  "We'll confirm by email shortly",
];

export default function CheckoutComplete({ booking }) {
  return (
    <div className="home1-checkout-complete-wrap">
      <article className="home1-checkout-complete-card" role="status" aria-live="polite">
        <header className="home1-checkout-complete-head">
          <p className="home1-checkout-complete-eyebrow">
            <IconCheck className="home1-checkout-complete-eyebrow-icon" />
            Payment received
          </p>
          <div className="home1-checkout-complete-icon" aria-hidden="true">
            <IconCheck />
          </div>
          <h1 className="home1-checkout-complete-title">Booking confirmed</h1>
          <p className="home1-checkout-complete-sub">
            You&apos;re all set — we&apos;ll see you on the day.
          </p>
        </header>

        <div className="home1-checkout-complete-body">
          <p className="home1-checkout-complete-lead">
            Thanks, <strong>{booking.firstName}</strong>. Your{" "}
            <strong>{booking.serviceName}</strong> visit is booked.
          </p>

          <dl className="home1-checkout-complete-meta">
            <div className="home1-checkout-complete-meta-row">
              <dt>Service</dt>
              <dd>{booking.serviceName}</dd>
            </div>
            <div className="home1-checkout-complete-meta-row">
              <dt>Visit date</dt>
              <dd>{formatLongDate(booking.date)}</dd>
            </div>
            <div className="home1-checkout-complete-meta-row">
              <dt>Time slot</dt>
              <dd>{booking.time}</dd>
            </div>
            <div className="home1-checkout-complete-meta-row home1-checkout-complete-meta-row--total">
              <dt>Total paid</dt>
              <dd>{formatMoney(booking.totalInc)} Inc. VAT</dd>
            </div>
          </dl>

          <div className="home1-checkout-complete-actions">
            <Link href="/" className="home1-checkout-complete-btn home1-checkout-complete-btn--primary">
              Back to home
            </Link>
            <Link href="/services" className="home1-checkout-complete-btn home1-checkout-complete-btn--secondary">
              Browse more services
            </Link>
          </div>

          <ul className="home1-checkout-complete-trust list-none p-0 m-0">
            {TRUST_ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
