"use client";

import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

function WarningIcon() {
  return (
    <svg className="home1-postcode-result-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.25" r="0.9" fill="currentColor" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="home1-postcode-result-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 12.2l2.4 2.4L16 9.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {{
 *   open: boolean,
 *   variant: "success" | "error",
 *   message?: string,
 *   onClose: () => void,
 *   onBook?: () => void,
 * }} props
 */
export default function ServicePostcodeResultModal({
  open,
  variant,
  message,
  onClose,
  onBook,
}) {
  const titleId = useId();
  const isSuccess = variant === "success";
  const title = isSuccess ? "We Proudly Serve Your Area" : "Invalid Postcode";
  const bodyText = isSuccess ? "" : message || "Invalid Postcode";

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const modal = (
    <div className="home1-postcode-result-root" role="presentation">
      <button type="button" className="home1-postcode-result-backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="home1-postcode-result-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          className={`home1-postcode-result-icon-wrap${isSuccess ? " is-success" : " is-error"}`}
          aria-hidden="true"
        >
          {isSuccess ? <SuccessIcon /> : <WarningIcon />}
        </div>

        <h2 id={titleId} className="home1-postcode-result-title">
          {title}
        </h2>

        {bodyText ? <p className="home1-postcode-result-message">{bodyText}</p> : null}

        {isSuccess ? (
          <div className="home1-postcode-result-actions home1-postcode-result-actions--dual">
            <button type="button" className="home1-postcode-result-btn home1-postcode-result-btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="home1-postcode-result-btn home1-postcode-result-btn--book" onClick={onBook}>
              Book
            </button>
          </div>
        ) : (
          <div className="home1-postcode-result-actions">
            <button type="button" className="home1-postcode-result-btn home1-postcode-result-btn--ok" onClick={onClose}>
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
