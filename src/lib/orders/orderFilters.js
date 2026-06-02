/** @typedef {import("@/lib/orders/orderTypes").OrderStatus} OrderStatus */
/** @typedef {import("@/lib/orders/orderTypes").OrderSummary} OrderSummary */

/** @type {Record<OrderStatus, { label: string, tone: string }>} */
export const ORDER_STATUS_META = {
  confirmed: { label: "Confirmed", tone: "blue" },
  in_progress: { label: "In progress", tone: "amber" },
  completed: { label: "Completed", tone: "green" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

/** @type {{ id: string, label: string }[]} */
export const ORDER_FILTERS = [
  { id: "all", label: "All orders" },
  { id: "upcoming", label: "Upcoming" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

/**
 * @param {OrderSummary} order
 * @param {string} filterId
 */
export function orderMatchesFilter(order, filterId) {
  if (filterId === "all") return true;
  if (filterId === "upcoming") return order.status === "confirmed" || order.status === "in_progress";
  if (filterId === "completed") return order.status === "completed";
  if (filterId === "cancelled") return order.status === "cancelled";
  return true;
}

/**
 * @param {OrderSummary[]} orders
 */
export function getOrderStats(orders) {
  return {
    total: orders.length,
    upcoming: orders.filter((o) => o.status === "confirmed" || o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };
}
