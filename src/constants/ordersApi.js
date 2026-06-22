export const ORDERS_API = {
  list: "/orders",
  detail: (id) => `/orders/${id}`,
  orderActionRequest: "/orders/order-action-request",
  sendOrderPdf: "/orders/send-order-pdf",
};

export const ORDERS_PROXY = {
  list: "/api/orders",
  detail: (id) => `/api/orders/${encodeURIComponent(id)}`,
  orderActionRequest: "/api/orders/order-action-request",
  sendOrderPdf: "/api/orders/send-order-pdf",
};
