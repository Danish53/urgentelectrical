"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { getOrderCancelDeadline } from "@/lib/orders/orderCancel";

/**
 * @param {{
 *   open: boolean,
 *   order: import("@/lib/orders/orderTypes").OrderSummary | null,
 *   onClose: () => void,
 *   onSubmit: (note: string) => void | Promise<void>,
 *   saving?: boolean,
 * }} props
 */
export default function OrderCancelModal({
  open,
  order,
  onClose,
  onSubmit,
  saving = false,
}) {
  const titleId = useId();
  const noteId = useId();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const openToken = open ? String(order?.id ?? "open") : null;
  const [syncedOpenToken, setSyncedOpenToken] = useState(null);

  if (openToken !== syncedOpenToken) {
    setSyncedOpenToken(openToken);
    if (openToken) {
      setNote("");
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

  const displayRef = order.reference || order.id;
  const deadline = getOrderCancelDeadline(order);
  const deadlineLabel = deadline
    ? deadline.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) {
      setError("Please tell us why you are cancelling this order.");
      return;
    }
    setError("");
    await onSubmit(trimmed);
  }

  const modal = (
    <div className="home1-sites-modal-root home1-order-cancel-modal-root" role="presentation">
      <button
        type="button"
        className="home1-sites-modal-backdrop"
        aria-label="Close dialog"
        onClick={() => !saving && onClose()}
      />
      <div
        className="home1-sites-modal home1-order-cancel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="home1-sites-modal-head">
          <div>
            <p className="home1-sites-modal-eyebrow">Cancel order</p>
            <h2 id={titleId} className="home1-sites-modal-title">
              {order.serviceName}
            </h2>
            {displayRef ? <p className="home1-order-cancel-modal-ref">{displayRef}</p> : null}
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
            <p className="home1-order-cancel-modal-lead">
            You can cancel this booking free of charge up to 48 hours before your appointment.
              {deadlineLabel ? ` Free cancellation and changes are available until ${deadlineLabel}.` : null}
            </p>

            <div className="home1-sites-field">
              <label htmlFor={noteId} className={AUTH_LABEL_CLASS}>
                Reason for cancellation<span className="text-[#d3231f]">*</span>
              </label>
              <textarea
                id={noteId}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  if (error) setError("");
                }}
                placeholder="Please share why you need to cancel…"
                className={`${AUTH_INPUT_CLASS} home1-sites-textarea home1-order-cancel-modal-note`}
                rows={4}
                disabled={saving}
                required
              />
              {error ? (
                <p className="home1-order-cancel-modal-error" role="alert">
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
              Keep order
            </button>
            <button
              type="button"
              className="home1-btn-primary home1-sites-modal-btn home1-order-cancel-modal-submit inline-flex items-center justify-center gap-2"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? <ButtonSpinner /> : null}
              {saving ? "Cancelling…" : "Confirm cancellation"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
