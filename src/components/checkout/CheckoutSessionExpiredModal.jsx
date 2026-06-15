"use client";

import { useRouter } from "next/navigation";
import { clearCheckoutSession } from "@/hooks/useCheckoutSessionTimer";

function SessionExpiredIcon() {
  return (
    <svg
      className="home1-checkout-session-expired-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CheckoutSessionExpiredModal() {
  const router = useRouter();

  function goToServices() {
    clearCheckoutSession();
    router.push("/services");
  }

  return (
    <div className="home1-checkout-site-modal-root" role="presentation">
      <div className="home1-checkout-site-modal-backdrop" aria-hidden="true" />
      <div
        className="home1-checkout-site-modal home1-checkout-session-expired-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-session-expired-title"
      >
        <div className="home1-checkout-session-expired-body">
          <div className="home1-checkout-session-expired-icon-wrap" aria-hidden="true">
            <SessionExpiredIcon />
          </div>

          <h2 id="checkout-session-expired-title" className="home1-checkout-session-expired-title">
            Session Expired
          </h2>

          <p className="home1-checkout-session-expired-text">
            Your checkout session has expired. Please start again.
          </p>

          <button type="button" className="home1-btn-primary home1-checkout-session-expired-btn" onClick={goToServices}>
            Go to Service
          </button>
        </div>
      </div>
    </div>
  );
}
