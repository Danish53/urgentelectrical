"use client";

import { CONTAINER } from "@/components/home1/constants";

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
    >
      <div className={`home1-checkout-session-inner ${CONTAINER}`}>
        <span className="home1-checkout-session-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p>
          Your checkout session is reserved for{" "}
          <strong>{formatTimer(Math.max(0, secondsLeft))}</strong>
        </p>
      </div>
    </div>
  );
}
