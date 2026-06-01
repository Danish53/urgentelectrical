"use client";

import { CHECKOUT_PAGE_CONTAINER } from "@/components/home1/constants";

function formatTimer(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CheckoutSessionBar({ secondsLeft }) {
  const urgent = secondsLeft < 120;

  return (
    <div
      className={`home1-checkout-session${urgent ? " is-urgent" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`home1-checkout-session-inner ${CHECKOUT_PAGE_CONTAINER}`}>
        <p className="home1-checkout-session-text">
          Your checkout session is reserved for{" "}
          <strong>{formatTimer(Math.max(0, secondsLeft))}</strong>
        </p>
      </div>
    </div>
  );
}
