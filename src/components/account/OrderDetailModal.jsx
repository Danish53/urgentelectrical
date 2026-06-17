"use client";

import { useEffect } from "react";
import Link from "next/link";
import { formatMoney, formatLongDate } from "@/components/checkout/checkoutUtils";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { ORDER_STATUS_META } from "@/lib/orders/orderFilters";
import { canCancelOrder } from "@/lib/orders/orderCancel";

function formatBookedAt(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   order: import("@/lib/orders/orderTypes").OrderDetail | null,
 *   loading?: boolean,
 *   error?: string | null,
 *   onCancel?: (order: import("@/lib/orders/orderTypes").OrderDetail) => void,
 * }} props
 */
export default function OrderDetailModal({
  open,
  onClose,
  order,
  loading = false,
  error = null,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  const statusMeta = order ? ORDER_STATUS_META[order.status] : null;
  const statusLabel = order?.statusLabel || statusMeta?.label;
  const showCancel = canCancelOrder(order);
  const visitDate = order?.visitDate ? new Date(`${order.visitDate}T12:00:00`) : null;
  const displayRef = order?.reference || order?.id;

  return (
    <div className="home1-order-detail-root" role="presentation">
      <button
        type="button"
        className="home1-order-detail-backdrop"
        aria-label="Close order details"
        onClick={() => !loading && onClose()}
      />

      <div
        className="home1-order-detail-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <header className="home1-order-detail-head">
          <div className="min-w-0">
            <p className="home1-order-detail-eyebrow">Order details</p>
            <h2 id="order-detail-title" className="home1-order-detail-title">
              {order?.serviceName ?? "Loading…"}
            </h2>
            {displayRef ? <p className="home1-order-detail-ref">{displayRef}</p> : null}
          </div>
          <button
            type="button"
            className="home1-order-detail-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="home1-order-detail-body">
          {loading ? (
            <div className="home1-order-detail-loading" aria-live="polite">
              <ButtonSpinner className="h-8 w-8 text-[var(--home1-red)]" />
              <p>Loading order details…</p>
            </div>
          ) : null}

          {!loading && error ? (
            <div className="home1-order-detail-error" role="alert">
              <p>{error}</p>
            </div>
          ) : null}

          {!loading && !error && order ? (
            <>
              {statusLabel ? (
                <span
                  className={`home1-orders-status home1-orders-status--${statusMeta?.tone ?? "blue"}`}
                >
                  {statusLabel}
                </span>
              ) : null}

              <dl className="home1-order-detail-grid">
                <div>
                  <dt>Order reference</dt>
                  <dd>{displayRef}</dd>
                </div>
                <div>
                  <dt>Order ID</dt>
                  <dd>{order.id}</dd>
                </div>
                {visitDate && !Number.isNaN(visitDate.getTime()) ? (
                  <div>
                    <dt>Visit date</dt>
                    <dd>
                      {formatLongDate(visitDate)}
                      <span className="home1-order-detail-sub">{order.visitTime}</span>
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt>Placed on</dt>
                  <dd>{formatBookedAt(order.bookedAt)}</dd>
                </div>
                {order.paymentMethod ? (
                  <div>
                    <dt>Payment method</dt>
                    <dd>{order.paymentMethod}</dd>
                  </div>
                ) : null}
                {order.paymentStatus ? (
                  <div>
                    <dt>Payment status</dt>
                    <dd>{capitalize(order.paymentStatus)}</dd>
                  </div>
                ) : null}
                {order.serviceSubTotal > 0 ? (
                  <div>
                    <dt>Service subtotal</dt>
                    <dd>{formatMoney(order.serviceSubTotal)}</dd>
                  </div>
                ) : order.totalExc > 0 ? (
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatMoney(order.totalExc)}</dd>
                  </div>
                ) : null}
                {order.deliveryFee > 0 ? (
                  <div>
                    <dt>Delivery fee</dt>
                    <dd>{formatMoney(order.deliveryFee)}</dd>
                  </div>
                ) : null}
                {order.discount > 0 ? (
                  <div>
                    <dt>Discount</dt>
                    <dd>-{formatMoney(order.discount)}</dd>
                  </div>
                ) : null}
                {order.address ? (
                  <div className="home1-order-detail-grid-full">
                    <dt>Address</dt>
                    <dd>{order.address}</dd>
                  </div>
                ) : null}
                {order.customerName ? (
                  <div>
                    <dt>Contact</dt>
                    <dd>{order.customerName}</dd>
                  </div>
                ) : null}
                {order.customerPhone ? (
                  <div>
                    <dt>Phone</dt>
                    <dd>
                      <a href={`tel:${order.customerPhone.replace(/\s/g, "")}`}>{order.customerPhone}</a>
                    </dd>
                  </div>
                ) : null}
                {order.customerEmail ? (
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
                    </dd>
                  </div>
                ) : null}
                <div className="home1-order-detail-total">
                  <dt>Amount paid</dt>
                  <dd>{formatMoney(order.totalInc)}</dd>
                </div>
              </dl>

              {order.notes ? (
                <div className="home1-order-detail-notes">
                  <p className="home1-order-detail-notes-label">Notes</p>
                  <p>{order.notes}</p>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <footer className="home1-order-detail-foot">
          {showCancel ? (
            <button
              type="button"
              className="home1-btn-outline home1-order-detail-btn home1-order-detail-btn--cancel"
              onClick={() => onCancel?.(order)}
              disabled={loading}
            >
              Cancel order
            </button>
          ) : order?.status === "completed" || order?.status === "cancelled" ? (
            <Link href="/checkout" className="home1-btn-primary home1-order-detail-btn">
              Book again
            </Link>
          ) : (
            <a href="tel:01157780622" className="home1-btn-primary home1-order-detail-btn">
              Call engineer
            </a>
          )}
          <button
            type="button"
            className="home1-btn-outline home1-order-detail-btn"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
