export const ORDERS_API = {
  list: "/orders",
  detail: (id) => `/orders/${id}`,
};

export const ORDERS_PROXY = {
  list: "/api/orders",
  detail: (id) => `/api/orders/${encodeURIComponent(id)}`,
};
