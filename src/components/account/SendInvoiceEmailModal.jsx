"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import ButtonSpinner from "@/components/ui/ButtonSpinner";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());
}

/**
 * @param {{
 *   open: boolean,
 *   order: { orderId: string, reference?: string, serviceName?: string } | null,
 *   onClose: () => void,
 *   onSubmit: (email: string) => void | Promise<void>,
 *   saving?: boolean,
 * }} props
 */
export default function SendInvoiceEmailModal({
  open,
  order,
  onClose,
  onSubmit,
  saving = false,
}) {
  const titleId = useId();
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const openToken = open ? String(order?.orderId ?? "open") : null;
  const [syncedOpenToken, setSyncedOpenToken] = useState(null);

  if (openToken !== syncedOpenToken) {
    setSyncedOpenToken(openToken);
    if (openToken) {
      setEmail("");
      setError("");
    }
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event) => {
      if (event.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, saving]);

  if (!open || !order) return null;

  const displayRef = order.reference || order.orderId;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter an email address.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    await onSubmit(trimmed);
  }

  const modal = (
    <div className="home1-sites-modal-root home1-send-invoice-modal-root" role="presentation">
      <button
        type="button"
        className="home1-sites-modal-backdrop"
        aria-label="Close dialog"
        onClick={() => !saving && onClose()}
      />
      <div
        className="home1-sites-modal home1-send-invoice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="home1-sites-modal-head">
          <div>
            <p className="home1-sites-modal-eyebrow">Send invoice</p>
            <h2 id={titleId} className="home1-sites-modal-title">
              Email invoice
            </h2>
            {displayRef ? <p className="home1-send-invoice-modal-ref">{displayRef}</p> : null}
          </div>
          <button
            type="button"
            className="home1-sites-modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="home1-sites-modal-form">
          <div className="home1-sites-modal-body">
            <p className="home1-send-invoice-modal-lead">
              Enter an address and we&apos;ll send the invoice PDF.
            </p>

            <div className="home1-sites-field">
              <label htmlFor={emailId} className={AUTH_LABEL_CLASS}>
                Email address<span className="text-[#d3231f]">*</span>
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError("");
                }}
                placeholder="you@example.com"
                className={AUTH_INPUT_CLASS}
                autoComplete="email"
                disabled={saving}
                required
              />
              {error ? (
                <p className="home1-send-invoice-modal-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          <footer className="home1-sites-modal-foot">
            <button
              type="button"
              className="home1-btn-outline home1-sites-modal-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="home1-btn-primary home1-sites-modal-btn inline-flex items-center justify-center gap-2"
              disabled={saving}
            >
              {saving ? <ButtonSpinner /> : null}
              {saving ? "Sending…" : "Send invoice"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
