"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AccountLayout from "@/components/account/AccountLayout";
import OrderDetailModal from "@/components/account/OrderDetailModal";
import OrderCancelModal from "@/components/account/OrderCancelModal";
import SendInvoiceEmailModal from "@/components/account/SendInvoiceEmailModal";
import OrdersListSkeleton from "@/components/skeletons/OrdersListSkeleton";
import BlogPagination from "@/components/blog/BlogPagination";
import { formatMoney, formatLongDate } from "@/components/checkout/checkoutUtils";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import {
  ORDER_FILTERS,
  ORDER_STATUS_META,
  getOrderStats,
  orderMatchesFilter,
} from "@/lib/orders/orderFilters";
import { getOrderServiceDetailHref } from "@/lib/orders/orderServiceHref";
import { canCancelOrder } from "@/lib/orders/orderCancel";
import { downloadOrderInvoicePdf } from "@/lib/orders/downloadOrderInvoice";
import { toastError, toastSuccess } from "@/lib/toast";
import { requestOrderCancellation, fetchOrderById, sendOrderInvoiceEmail, parseSendOrderInvoiceMessage } from "@/services/ordersApiService";
import { pickOrderApiId } from "@/lib/orders/orderMapper";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearOrderDetail, loadOrderDetail, loadOrders } from "@/store/slices/ordersSlice";
import { IconArrow, IconCalendar, IconCheck, IconDownload, IconMail } from "@/components/home1/icons";
import "@/app/account/account.css";
import "@/components/skeletons/skeleton.css";

function formatShortDate(isoDate) {
  if (!isoDate) return "—";
  const d = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

/**
 * @param {import("@/lib/orders/orderTypes").OrderSummary} order
 */
function OrderStatusBadge({ order }) {
  const meta = ORDER_STATUS_META[order.status];
  const label = order.statusLabel || meta.label;
  return (
    <span className={`home1-orders-status home1-orders-status--${meta.tone}`}>
      {label}
    </span>
  );
}

/**
 * @param {{
 *   order: import("@/lib/orders/orderTypes").OrderSummary,
 *   onViewDetails: (order: import("@/lib/orders/orderTypes").OrderSummary) => void,
 *   onCancel?: (order: import("@/lib/orders/orderTypes").OrderSummary) => void,
 *   onSendInvoiceEmail?: (order: import("@/lib/orders/orderTypes").OrderSummary) => void,
 *   detailLoading?: boolean,
 *   invoiceEmailLoading?: boolean,
 * }} props
 */
function OrderCard({
  order,
  onViewDetails,
  onCancel,
  onSendInvoiceEmail,
  detailLoading = false,
  invoiceEmailLoading = false,
}) {
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const visitDate = order.visitDate
    ? new Date(`${order.visitDate}T12:00:00`)
  : null;
  const displayRef = order.reference || order.id;
  const showCancel = canCancelOrder(order);

  async function handleDownloadInvoice() {
    setInvoiceLoading(true);
    try {
      await downloadOrderInvoicePdf(order);
    } catch (err) {
      toastError(err, "Could not download invoice.");
    } finally {
      setInvoiceLoading(false);
    }
  }

  return (
    <article className="home1-orders-card home1-card">
      <div className="home1-orders-card-top">
        <div className="min-w-0">
          <p className="home1-orders-card-ref">{displayRef}</p>
          <h2 className="home1-orders-card-title">{order.serviceName}</h2>
          {order.paymentMethod || order.paymentStatus ? (
            <p className="home1-orders-card-category">
              {/* {[order.paymentMethod, order.paymentStatus]
                .filter(Boolean)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join(" · ")} */}
                Paid by Card
            </p>
          ) : null}
        </div>
        <OrderStatusBadge order={order} />
      </div>

      <dl className="home1-orders-card-meta">
        {visitDate && !Number.isNaN(visitDate.getTime()) ? (
          <div className="home1-orders-card-meta-row">
            <dt>
              <IconCalendar className="w-4 h-4 shrink-0" aria-hidden="true" />
              Visit
            </dt>
            <dd>
              {formatLongDate(visitDate)}
              <span className="home1-orders-card-meta-sub">{order.visitTime}</span>
            </dd>
          </div>
        ) : null}
        {order.address ? (
          <div className="home1-orders-card-meta-row">
            <dt>Address</dt>
            <dd>{order.address}</dd>
          </div>
        ) : null}
        <div className="home1-orders-card-meta-row">
          <dt>Placed</dt>
          <dd>{formatBookedAt(order.bookedAt)}</dd>
        </div>
        <div className="home1-orders-card-meta-row home1-orders-card-meta-row--total">
          <dt>Paid</dt>
          <dd>
            {formatMoney(order.totalInc)}
            {order.discount > 0 ? (
              <span className="home1-orders-card-meta-sub">
                Includes −{formatMoney(order.discount)} discount
              </span>
            ) : order.serviceSubTotal > 0 &&
              order.serviceSubTotal + order.deliveryFee !== order.totalInc ? (
              <span className="home1-orders-card-meta-sub">
                Before discount {formatMoney(order.serviceSubTotal + order.deliveryFee)}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <div className="home1-orders-card-actions">
        <div className="home1-orders-card-actions-left">
          {/* <button
          type="button"
          className="home1-btn-outline home1-orders-card-btn home1-orders-card-btn--detail inline-flex items-center justify-center gap-2"
          onClick={() => onViewDetails(order)}
          disabled={detailLoading}
          aria-busy={detailLoading}
        >
          {detailLoading ? <ButtonSpinner /> : null}
            {detailLoading ? "Loading…" : "Order Details"}
          </button> */}

          <button
            type="button"
            className="home1-orders-card-btn home1-orders-card-btn--invoice home1-orders-card-btn--invoice-email inline-flex items-center justify-center gap-2"
            onClick={() => onSendInvoiceEmail?.(order)}
            disabled={invoiceEmailLoading || invoiceLoading}
            aria-busy={invoiceEmailLoading}
          >
            {invoiceEmailLoading ? (
              <ButtonSpinner />
            ) : (
              <span className="home1-orders-card-btn-icon home1-orders-card-btn-icon--mail" aria-hidden="true">
                <IconMail className="w-3.5 h-3.5" />
              </span>
            )}
            {invoiceEmailLoading ? "Sending…" : "Send Invoice By Email"}
          </button>
          <button
            type="button"
            className="home1-orders-card-btn home1-orders-card-btn--invoice home1-orders-card-btn--invoice-download inline-flex items-center justify-center gap-2"
            onClick={handleDownloadInvoice}
            disabled={invoiceLoading || invoiceEmailLoading}
            aria-busy={invoiceLoading}
          >
            {invoiceLoading ? <ButtonSpinner /> : (
            <span className="home1-orders-card-btn-icon home1-orders-card-btn-icon--download" aria-hidden="true">
              <IconDownload className="w-3.5 h-3.5" />
            </span>
            )}
            {invoiceLoading ? "Downloading…" : "Download Invoice"}
          </button>
        </div>

        <div className="home1-orders-card-actions-end">
          {showCancel ? (
            <button
              type="button"
              className="home1-btn-outline home1-orders-card-btn home1-orders-card-btn--cancel w-full"
              onClick={() => onCancel?.(order)}
            >
              Cancel Order
        </button>
          ) : order.status === "completed" || order.status === "cancelled" ? (
            <Link
              href={getOrderServiceDetailHref(order)}
              className="home1-btn-primary home1-orders-card-btn"
            >
              Reorder
          </Link>
        ) : (
          <a href="tel:01157780622" className="home1-btn-primary home1-orders-card-btn">
              Call Engineer
          </a>
        )}
        </div>
      </div>
    </article>
  );
}

function OrdersEmpty({ filterLabel }) {
  return (
    <div className="home1-orders-empty home1-card">
      <div className="home1-orders-empty-icon" aria-hidden="true">
        <IconCalendar className="w-8 h-8" />
      </div>
      <h2 className="home1-orders-empty-title">No orders found</h2>
      <p className="home1-orders-empty-text">
        {filterLabel === "All orders"
          ? "You have not placed any bookings yet. Book online in minutes."
          : `You do not have any ${filterLabel.toLowerCase()} right now.`}
      </p>
      <Link href="/services" className="home1-btn-primary inline-flex items-center gap-2">
        Browse services
        <IconArrow className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function OrdersPageClient() {
  const dispatch = useAppDispatch();
  const {
    orders,
    status,
    error,
    pagination,
    detail,
    detailOrderId,
    detailStatus,
    detailError,
  } = useAppSelector((state) => state.orders);

  const [activeFilter, setActiveFilter] = useState("all");
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelSaving, setCancelSaving] = useState(false);
  const [invoiceEmailTarget, setInvoiceEmailTarget] = useState(
    /** @type {{ orderId: string, reference?: string, serviceName?: string } | null} */ (null),
  );
  const [invoiceEmailSaving, setInvoiceEmailSaving] = useState(false);
  const [invoiceSendingOrderId, setInvoiceSendingOrderId] = useState("");
  const listAnchorRef = useRef(null);

  const initialLoading = (status === "loading" || status === "idle") && orders.length === 0;
  const pageLoading = status === "loading" && orders.length > 0;
  const detailLoading = detailStatus === "loading";

  const stats = useMemo(() => getOrderStats(orders), [orders]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => orderMatchesFilter(order, activeFilter)),
    [orders, activeFilter]
  );

  const activeFilterLabel =
    ORDER_FILTERS.find((f) => f.id === activeFilter)?.label ?? "All orders";

  const totalCount = pagination?.total ?? orders.length;

  useEffect(() => {
    dispatch(loadOrders({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    if (activeFilter === "all") return;
    dispatch(loadOrders({ page: 1 }));
  }, [activeFilter, dispatch]);

  function openOrderDetail(order) {
    if (!order.id) {
      toastError("This order cannot be opened (missing ID).");
      return;
    }

    setDetailOpen(true);
    dispatch(clearOrderDetail());
    dispatch(loadOrderDetail(order.id))
      .unwrap()
      .catch((err) => {
        toastError(err, "Could not load order details.");
      });
  }

  function closeOrderDetail() {
    if (detailLoading) return;
    setDetailOpen(false);
    dispatch(clearOrderDetail());
  }

  function openCancelModal(order) {
    setCancelTarget(order);
  }

  function closeCancelModal() {
    if (cancelSaving) return;
    setCancelTarget(null);
  }

  async function handleConfirmCancel(note) {
    if (!cancelTarget?.id) return;
    setCancelSaving(true);
    try {
      await requestOrderCancellation(cancelTarget.id, note);
      toastSuccess("Your cancellation request has been submitted.");
      setCancelTarget(null);
      if (detailOpen && detailOrderId === cancelTarget.id) {
        closeOrderDetail();
      }
      dispatch(loadOrders({ page: pagination?.currentPage ?? 1 }));
    } catch (err) {
      toastError(err, "Could not cancel this order.");
    } finally {
      setCancelSaving(false);
    }
  }

  async function deliverInvoiceEmail(orderId, email) {
    const response = await sendOrderInvoiceEmail(orderId, email);
    toastSuccess(parseSendOrderInvoiceMessage(response) || "Invoice sent to your email address.");
  }

  async function handleSendInvoiceEmail(order) {
    const orderId = pickOrderApiId(order);
    if (!orderId || invoiceSendingOrderId || invoiceEmailSaving) return;

    setInvoiceSendingOrderId(orderId);
    try {
      const detail = await fetchOrderById(orderId);
      const savedEmail = detail.customerEmail?.trim();

      if (savedEmail) {
        await deliverInvoiceEmail(pickOrderApiId(detail) || orderId, savedEmail);
        return;
      }

      setInvoiceEmailTarget({
        orderId: pickOrderApiId(detail) || orderId,
        reference: detail.reference || orderId,
        serviceName: detail.serviceName,
      });
    } catch (err) {
      toastError(err, "Could not send invoice by email.");
    } finally {
      setInvoiceSendingOrderId("");
    }
  }

  function closeInvoiceEmailModal() {
    if (invoiceEmailSaving) return;
    setInvoiceEmailTarget(null);
  }

  async function handleManualInvoiceEmail(email) {
    if (!invoiceEmailTarget?.orderId) return;

    setInvoiceEmailSaving(true);
    try {
      await deliverInvoiceEmail(invoiceEmailTarget.orderId, email);
      setInvoiceEmailTarget(null);
    } catch (err) {
      toastError(err, "Could not send invoice by email.");
    } finally {
      setInvoiceEmailSaving(false);
    }
  }

  function goToPage(page) {
    if (!pagination || pageLoading) return;
    if (page < 1 || page > pagination.lastPage || page === pagination.currentPage) return;

    dispatch(loadOrders({ page }));
    listAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AccountLayout
      active="orders"
      title="My orders"
      description="Track upcoming visits, completed jobs, and past bookings — all in one place."
    >
      <div className="home1-orders-stats">
        <div className="home1-orders-stat home1-card">
          <p className="home1-orders-stat-value">{initialLoading ? "—" : totalCount}</p>
          <p className="home1-orders-stat-label">Total orders</p>
        </div>
        <div className="home1-orders-stat home1-card home1-orders-stat--accent">
          <p className="home1-orders-stat-value">{initialLoading ? "—" : stats.upcoming}</p>
          <p className="home1-orders-stat-label">Upcoming</p>
        </div>
        <div className="home1-orders-stat home1-card">
          <p className="home1-orders-stat-value">{initialLoading ? "—" : stats.completed}</p>
          <p className="home1-orders-stat-label">Completed</p>
        </div>
      </div>

      <div className="home1-orders-filters" role="tablist" aria-label="Filter orders">
        {ORDER_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`home1-orders-filter${isActive ? " is-active" : ""}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {initialLoading ? <OrdersListSkeleton count={3} /> : null}

      {!initialLoading && status === "failed" ? (
        <div className="home1-orders-empty home1-card">
          <p className="text-sm text-[#9f1239]">{error}</p>
          <button
            type="button"
            className="home1-btn-outline mt-4"
            onClick={() => dispatch(loadOrders({ page: 1 }))}
          >
            Try again
          </button>
        </div>
      ) : null}

      <div ref={listAnchorRef} className="home1-orders-list-anchor" />

      {!initialLoading && status !== "failed" && filteredOrders.length === 0 ? (
        <OrdersEmpty
          filterLabel={
            activeFilter !== "all" && orders.length > 0
              ? `${activeFilterLabel} on this page`
              : activeFilterLabel
          }
        />
      ) : null}

      {pageLoading && orders.length > 0 ? (
        <div className="home1-orders-list-loading" aria-live="polite">
          <ButtonSpinner className="h-6 w-6 text-[var(--home1-red)]" />
        </div>
      ) : null}

      {!initialLoading && status !== "failed" && filteredOrders.length > 0 ? (
        <ul
          className={`home1-orders-list list-none p-0 m-0${pageLoading ? " home1-orders-list--busy" : ""}`}
        >
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <OrderCard
                order={order}
                onViewDetails={openOrderDetail}
                  onCancel={openCancelModal}
                  onSendInvoiceEmail={handleSendInvoiceEmail}
                detailLoading={detailLoading && detailOrderId === order.id}
                  invoiceEmailLoading={invoiceSendingOrderId === order.id}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {!initialLoading &&
      status !== "failed" &&
      activeFilter === "all" &&
      filteredOrders.length > 0 &&
      pagination &&
      pagination.lastPage > 1 ? (
        <div className="home1-orders-pagination">
          {pagination.from && pagination.to ? (
            <p className="home1-orders-pagination-summary">
              Showing {pagination.from}–{pagination.to} of {totalCount} orders
            </p>
          ) : (
            <p className="home1-orders-pagination-summary">
              Page {pagination.currentPage} of {pagination.lastPage} ({totalCount} orders)
            </p>
          )}
          <BlogPagination
            ariaLabel="Orders pagination"
            className="home1-orders-pagination-nav mt-0"
            currentPage={pagination.currentPage}
            lastPage={pagination.lastPage}
            loading={pageLoading}
            onPageChange={goToPage}
          />
        </div>
      ) : null}

      <div className="home1-orders-trust home1-card">
        <IconCheck className="w-5 h-5 text-[var(--home1-red)] shrink-0" aria-hidden="true" />
        <div>
          <p className="home1-orders-trust-title">NICEIC approved · Fixed pricing</p>
          <p className="home1-orders-trust-text">
            Questions about an order? Email{" "}
            <a href="mailto:info@urgentelectrical.services">info@urgentelectrical.services</a> or call{" "}
            <a href="tel:01157780622">0115 778 0622</a>.
          </p>
        </div>
      </div>

      <OrderDetailModal
        open={detailOpen}
        onClose={closeOrderDetail}
        order={detail}
        loading={detailLoading}
        error={detailError}
        onCancel={openCancelModal}
      />

      <OrderCancelModal
        open={Boolean(cancelTarget)}
        order={cancelTarget}
        onClose={closeCancelModal}
        onSubmit={handleConfirmCancel}
        saving={cancelSaving}
      />

      <SendInvoiceEmailModal
        open={Boolean(invoiceEmailTarget)}
        order={invoiceEmailTarget}
        onClose={closeInvoiceEmailModal}
        onSubmit={handleManualInvoiceEmail}
        saving={invoiceEmailSaving}
      />
    </AccountLayout>
  );
}
