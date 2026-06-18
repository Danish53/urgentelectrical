export const CHECKOUT_API = {
  validateOrderData: "/orders/validate-order-data",
  createPaymentIntent: "/orders/create-payment-intent",
  checkPaymentStatus: "/orders/check-payment-status",
  createOrder: "/orders",
  applyCoupon: "/apply-coupon",
  calculateDeliveryFee: "/public/api/calculate-delivery-fee",
};

/** Same-origin Next.js proxies (browser → Laravel via server) */
export const CHECKOUT_PROXY = {
  validateOrderData: "/api/orders/validate-order-data",
  createPaymentIntent: "/api/orders/create-payment-intent",
  checkPaymentStatus: "/api/orders/check-payment-status",
  createOrder: "/api/orders",
  applyCoupon: "/api/apply-coupon",
  calculateDeliveryFee: "/api/calculate-delivery-fee",
};
