"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import AccountLayout from "@/components/account/AccountLayout";
import { formatMoney, formatLongDate } from "@/components/checkout/checkoutUtils";
import { IconArrow, IconCalendar, IconCheck } from "@/components/home1/icons";
import {
  getOrderStats,
  MOCK_ORDERS,
  ORDER_FILTERS,
  ORDER_STATUS_META,
  orderMatchesFilter,
} from "@/data/ordersMock";

function formatShortDate(isoDate) {
  const d = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T12:00:00`);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderStatusBadge({ status }) {
  const meta = ORDER_STATUS_META[status];
  return (
    <span className={`home1-orders-status home1-orders-status--${meta.tone}`}>
      {meta.label}
    </span>
  );
}

/**
 * @param {{ order: import("@/data/ordersMock").Order }} props
 */
function OrderCard({ order }) {
  const visitDate = new Date(`${order.visitDate}T12:00:00`);

  return (
    <article className="home1-orders-card home1-card">
      <div className="home1-orders-card-top">
        <div className="min-w-0">
          <p className="home1-orders-card-ref">Order {order.id}</p>
          <h2 className="home1-orders-card-title">{order.serviceName}</h2>
          <p className="home1-orders-card-category">{order.category}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="home1-orders-card-meta">
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
        <div className="home1-orders-card-meta-row">
          <dt>Address</dt>
          <dd>{order.address}</dd>
        </div>
        <div className="home1-orders-card-meta-row">
          <dt>Booked</dt>
          <dd>{formatShortDate(order.bookedAt)}</dd>
        </div>
        <div className="home1-orders-card-meta-row home1-orders-card-meta-row--total">
          <dt>Total</dt>
          <dd>
            {formatMoney(order.totalInc)}
            <span className="home1-orders-card-meta-sub">Inc. VAT</span>
          </dd>
        </div>
      </dl>

      <div className="home1-orders-card-actions">
        <button type="button" className="home1-btn-outline home1-orders-card-btn">
          View details
        </button>
        {order.status === "completed" || order.status === "cancelled" ? (
          <Link href="/checkout" className="home1-btn-primary home1-orders-card-btn">
            Book again
          </Link>
        ) : (
          <a href="tel:01157780622" className="home1-btn-primary home1-orders-card-btn">
            Call engineer
          </a>
        )}
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
      <Link href="/checkout" className="home1-btn-primary inline-flex items-center gap-2">
        Book a service
        <IconArrow className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function OrdersPageClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const stats = useMemo(() => getOrderStats(MOCK_ORDERS), []);

  const filteredOrders = useMemo(
    () => MOCK_ORDERS.filter((order) => orderMatchesFilter(order, activeFilter)),
    [activeFilter]
  );

  const activeFilterLabel =
    ORDER_FILTERS.find((f) => f.id === activeFilter)?.label ?? "All orders";

  return (
    <AccountLayout
      active="orders"
      title="My orders"
      description="Track upcoming visits, completed jobs, and past bookings — all in one place."
    >
      <div className="home1-orders-stats">
        <div className="home1-orders-stat home1-card">
          <p className="home1-orders-stat-value">{stats.total}</p>
          <p className="home1-orders-stat-label">Total orders</p>
        </div>
        <div className="home1-orders-stat home1-card home1-orders-stat--accent">
          <p className="home1-orders-stat-value">{stats.upcoming}</p>
          <p className="home1-orders-stat-label">Upcoming</p>
        </div>
        <div className="home1-orders-stat home1-card">
          <p className="home1-orders-stat-value">{stats.completed}</p>
          <p className="home1-orders-stat-label">Completed</p>
        </div>
      </div>

      <div
        className="home1-orders-filters"
        role="tablist"
        aria-label="Filter orders"
      >
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

      {filteredOrders.length === 0 ? (
        <OrdersEmpty filterLabel={activeFilterLabel} />
      ) : (
        <ul className="home1-orders-list list-none p-0 m-0">
          {filteredOrders.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}

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
    </AccountLayout>
  );
}
