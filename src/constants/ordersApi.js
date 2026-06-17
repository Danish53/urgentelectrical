export const ORDERS_API = {
  list: "/orders",
  detail: (id) => `/orders/${id}`,
  orderActionRequest: "/orders/order-action-request",
};

export const ORDERS_PROXY = {
  list: "/api/orders",
  detail: (id) => `/api/orders/${encodeURIComponent(id)}`,
  orderActionRequest: "/api/orders/order-action-request",
};
