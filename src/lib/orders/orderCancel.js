/** @typedef {import("@/lib/orders/orderTypes").OrderSummary} OrderSummary */

export const ORDER_CANCEL_WINDOW_MS = 48 * 60 * 60 * 1000;

/**
 * @param {OrderSummary | null | undefined} order
 */
export function canCancelOrder(order) {
  if (!order?.id) return false;
  if (order.status === "cancelled" || order.status === "completed") return false;
  if (order.status !== "confirmed") return false;

  const bookedAt = new Date(order.bookedAt);
  if (Number.isNaN(bookedAt.getTime())) return false;

  const elapsed = Date.now() - bookedAt.getTime();
  return elapsed >= 0 && elapsed < ORDER_CANCEL_WINDOW_MS;
}

/**
 * @param {OrderSummary | null | undefined} order
 */
export function getOrderCancelDeadline(order) {
  if (!order?.bookedAt) return null;
  const bookedAt = new Date(order.bookedAt);
  if (Number.isNaN(bookedAt.getTime())) return null;
  return new Date(bookedAt.getTime() + ORDER_CANCEL_WINDOW_MS);
}

/**
 * @param {string | number} orderId
 */
export function resolveOrderActionId(orderId) {
  const numeric = Number(orderId);
  if (Number.isFinite(numeric) && numeric > 0) return numeric;
  return orderId;
}
