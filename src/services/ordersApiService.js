import { ORDERS_PROXY } from "@/constants/ordersApi";
import {
  apiToOrderDetail,
  apiToOrderSummary,
  parseOrderDetailResponse,
  parseOrdersListPayload,
} from "@/lib/orders/orderMapper";
import { resolveOrderActionId } from "@/lib/orders/orderCancel";
import { sameOriginAuthGet, sameOriginAuthPost } from "@/lib/api/sameOriginPost";

/**
 * GET /orders (Laravel paginated: { data, current_page, last_page, … })
 * @param {number} [page]
 */
export async function fetchOrders(page = 1) {
  const url = page > 1 ? `${ORDERS_PROXY.list}?page=${page}` : ORDERS_PROXY.list;
  const payload = await sameOriginAuthGet(url);
  const { orders, pagination } = parseOrdersListPayload(payload);
  return {
    orders: orders.map(apiToOrderSummary).filter((o) => o.id),
    pagination,
  };
}

/** GET /orders/{id} */
export async function fetchOrderById(id) {
  const payload = await sameOriginAuthGet(ORDERS_PROXY.detail(id));
  const row = parseOrderDetailResponse(payload);
  if (!row) throw new Error("Order not found.");
  return apiToOrderDetail(row);
}

/**
 * POST /orders/order-action-request
 * @param {{ action: string, orderId: string | number, note?: string }} params
 */
export async function submitOrderActionRequest({ action, orderId, note = "" }) {
  return sameOriginAuthPost(ORDERS_PROXY.orderActionRequest, {
    action,
    order_id: resolveOrderActionId(orderId),
    note: String(note ?? "").trim(),
  });
}

/** @param {string | number} orderId @param {string} note */
export async function requestOrderCancellation(orderId, note) {
  return submitOrderActionRequest({
    action: "cancel",
    orderId,
    note,
  });
}
