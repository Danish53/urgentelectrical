import { pickServiceSlugFromOrderApi } from "@/lib/orders/orderServiceHref";
/** @typedef {import("@/lib/orders/orderTypes").OrderSummary} OrderSummary */
/** @typedef {import("@/lib/orders/orderTypes").OrderDetail} OrderDetail */
/** @typedef {import("@/lib/orders/orderTypes").OrdersPagination} OrdersPagination */

/**
 * Numeric id for GET /orders/{id}
 * @param {Record<string, unknown>} api
 */
export function normalizeOrderApiId(api) {
  const raw = api.id;
  if (raw == null || raw === "") return "";
  return String(raw);
}

/**
 * Display reference e.g. ORD-WLHFGH
 * @param {Record<string, unknown>} api
 */
export function normalizeOrderReference(api) {
  const ref = api.order_id ?? api.order_number ?? api.reference ?? api.booking_reference;
  if (ref == null || ref === "") return "";
  return String(ref).trim();
}

/**
 * @param {unknown} value
 */
function parseMoney(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * @param {Record<string, unknown>} api
 */
function pickOrderDiscount(api) {
  return parseMoney(
    api.discount_amount ??
      api.discountAmount ??
      api.discount ??
      api.coupon_discount ??
      api.couponDiscount
  );
}

/**
 * @param {Record<string, unknown>} api
 */
function pickOrderSubTotal(api) {
  return parseMoney(
    api.sub_total ?? api.subtotal ?? api.totalSubtotal ?? api.total_subtotal ?? api.service_total
  );
}

/**
 * @param {Record<string, unknown>} api
 */
function pickOrderDeliveryFee(api) {
  return parseMoney(api.delivery_fee ?? api.deliveryFee);
}

/**
 * Paid total inc. VAT — prefers net amount after coupon discount.
 * @param {Record<string, unknown>} api
 */
function pickOrderPaidTotal(api) {
  const discount = pickOrderDiscount(api);
  const subTotal = pickOrderSubTotal(api);
  const deliveryFee = pickOrderDeliveryFee(api);
  const grossFromParts = subTotal + deliveryFee;

  if (grossFromParts > 0) {
    const netFromParts = Math.max(0, grossFromParts - discount);
    if (discount > 0) return netFromParts;
  }

  const explicitPaid = parseMoney(
    api.paid_amount ?? api.amount_paid ?? api.total_paid ?? api.net_amount ?? api.net_total
  );
  if (explicitPaid > 0) return explicitPaid;

  const amount = parseMoney(api.amount);
  if (amount > 0) {
    if (discount > 0 && grossFromParts > 0 && Math.abs(amount - grossFromParts) < 0.02) {
      return Math.max(0, amount - discount);
    }
    return amount;
  }

  const headlineTotal = parseMoney(
    api.total_inc_vat ?? api.total_incl_vat ?? api.grand_total ?? api.total
  );
  if (headlineTotal > 0 && discount > 0) {
    return Math.max(0, headlineTotal - discount);
  }

  return headlineTotal;
}

/**
 * @param {unknown} value
 */
function formatApiTime(value) {
  if (value == null || value === "") return "";
  const s = String(value).trim();
  const match = s.match(/^(\d{1,2}):(\d{2})/);
  if (match) return `${match[1].padStart(2, "0")}:${match[2]}`;
  return s;
}

/**
 * @param {unknown} status
 */
export function formatOrderStatusLabel(status) {
  const s = String(status ?? "").trim();
  if (!s) return "";
  return s
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * @param {unknown} status
 * @returns {OrderStatus}
 */
export function normalizeOrderStatus(status) {
  const s = String(status ?? "confirmed").toLowerCase().replace(/\s+/g, "_");

  if (["completed", "complete", "done", "finished"].includes(s)) return "completed";
  if (["cancelled", "canceled", "refunded"].includes(s)) return "cancelled";
  if (["in_progress", "inprogress", "processing", "assigned", "on_route", "on_the_way"].includes(s)) {
    return "in_progress";
  }
  if (["scheduled", "booked", "confirmed", "pending", "paid"].includes(s)) return "confirmed";
  return "confirmed";
}

/**
 * @param {Record<string, unknown>} api
 */
function formatOrderAddress(api) {
  const direct =
    (typeof api.address === "string" && api.address) ||
    (typeof api.full_address === "string" && api.full_address) ||
    (typeof api.site_address === "string" && api.site_address);

  if (direct) return direct.trim();

  const site = api.site_address;
  if (site && typeof site === "object") {
    return formatOrderAddress(/** @type {Record<string, unknown>} */ (site));
  }

  const parts = [
    api.address_line_1,
    api.address_line_2,
    api.town,
    api.county,
    api.post_code,
    api.country,
  ]
    .map((p) => (typeof p === "string" ? p.trim() : ""))
    .filter(Boolean);

  return parts.join(", ");
}

/**
 * @param {Record<string, unknown>} api
 */
function pickServiceName(api) {
  const direct = api.service_name ?? api.service_title ?? api.title ?? api.service;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const items = api.order_items ?? api.items ?? api.line_items ?? api.services;
  if (Array.isArray(items) && items.length > 0) {
    const first = items[0];
    if (first && typeof first === "object") {
      const row = /** @type {Record<string, unknown>} */ (first);
      const name = row.service_name ?? row.name ?? row.title ?? row.product_name;
      if (typeof name === "string" && name.trim()) return name.trim();
    }
  }

  const label = formatOrderStatusLabel(api.order_status ?? api.status);
  return label ? `${label} booking` : "Electrical booking";
}

/**
 * @param {Record<string, unknown>} api
 */
function pickVisitDate(api) {
  const raw =
    api.selected_date ??
    api.visit_date ??
    api.scheduled_date ??
    api.appointment_date ??
    api.booking_date ??
    api.date;

  if (typeof raw === "string" && raw.trim()) {
    return raw.trim().slice(0, 10);
  }

  return "";
}

/**
 * @param {Record<string, unknown>} api
 */
function pickVisitTime(api) {
  const start = formatApiTime(api.start_time ?? api.visit_time_start ?? api.slot_start);
  const end = formatApiTime(api.end_time ?? api.visit_time_end ?? api.slot_end);

  if (start && end) return `${start} – ${end}`;
  if (start) return start;
  if (api.visit_time) return String(api.visit_time);
  if (api.time_slot) return String(api.time_slot);
  if (api.scheduled_time) return String(api.scheduled_time);
  return "To be confirmed";
}

/**
 * @param {Record<string, unknown>} api
 * @returns {OrderSummary}
 */
export function apiToOrderSummary(api) {
  const discount = pickOrderDiscount(api);
  const subTotal = pickOrderSubTotal(api);
  const deliveryFee = pickOrderDeliveryFee(api);
  const totalInc = pickOrderPaidTotal(api);
  const totalExc = parseMoney(
    api.total_exc_vat ?? api.total_ex_vat ?? api.totalSubtotal ?? api.total_subtotal ?? subTotal
  );
  const rawStatus = api.order_status ?? api.status;

  return {
    id: normalizeOrderApiId(api),
    reference: normalizeOrderReference(api),
    serviceName: pickServiceName(api),
    serviceSlug: pickServiceSlugFromOrderApi(api),
    category: String(api.category ?? api.service_category ?? api.category_name ?? "").trim(),
    status: normalizeOrderStatus(rawStatus),
    statusLabel: formatOrderStatusLabel(rawStatus) || "Confirmed",
    bookedAt: String(api.created_at ?? api.booked_at ?? api.order_date ?? ""),
    visitDate: pickVisitDate(api),
    visitTime: pickVisitTime(api),
    address: formatOrderAddress(api) || "",
    totalInc,
    totalExc,
    serviceSubTotal: subTotal,
    deliveryFee,
    discount,
    paymentMethod: String(api.payment_method ?? "").trim(),
    paymentStatus: String(api.payment_status ?? "").trim(),
  };
}

/**
 * @param {Record<string, unknown>} api
 * @returns {OrderDetail}
 */
export function apiToOrderDetail(api) {
  const summary = apiToOrderSummary(api);
  const first = String(api.first_name ?? "").trim();
  const last = String(api.last_name ?? "").trim();

  return {
    ...summary,
    reference: normalizeOrderReference(api) || summary.reference,
    customerName: [api.title, first, last].filter(Boolean).join(" ").trim() || undefined,
    customerPhone: String(api.mobile ?? api.mobile_number ?? api.phone ?? "").trim() || undefined,
    customerEmail: String(api.email ?? "").trim() || undefined,
    notes: String(api.description ?? api.notes ?? api.customer_notes ?? "").trim() || undefined,
    engineerNotes: String(api.engineer_notes ?? "").trim() || undefined,
    raw: api,
  };
}

/**
 * @param {unknown} value
 * @returns {Record<string, unknown>[] | null}
 */
function extractOrderRows(value) {
  if (!value) return null;
  if (Array.isArray(value)) {
    return value.filter((item) => item && typeof item === "object");
  }
  if (typeof value !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (value);

  if (Array.isArray(record.data)) {
    return record.data.filter((item) => item && typeof item === "object");
  }

  const keys = ["orders", "bookings", "items", "results", "records"];
  for (const key of keys) {
    if (Array.isArray(record[key])) {
      return record[key].filter((item) => item && typeof item === "object");
    }
  }

  if (record.data && typeof record.data === "object" && !Array.isArray(record.data)) {
    return extractOrderRows(record.data);
  }

  return null;
}

/**
 * @param {unknown} payload
 * @returns {{ orders: Record<string, unknown>[], pagination: OrdersPagination | null }}
 */
export function parseOrdersListPayload(payload) {
  const rows = extractOrderRows(payload) ?? [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { orders: rows, pagination: null };
  }

  const record = /** @type {Record<string, unknown>} */ (payload);
  const currentPage = Number(record.current_page);
  const lastPage = Number(record.last_page);
  const total = Number(record.total);
  const perPage = Number(record.per_page);
  const from = Number(record.from);
  const to = Number(record.to);

  if (!Number.isFinite(currentPage) || !Number.isFinite(lastPage)) {
    return { orders: rows, pagination: null };
  }

  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : rows.length;
  const safeTotal = Number.isFinite(total) ? total : rows.length;
  const safeFrom = Number.isFinite(from) ? from : (currentPage - 1) * safePerPage + 1;
  const safeTo = Number.isFinite(to) ? to : safeFrom + Math.max(rows.length, 1) - 1;

  return {
    orders: rows,
    pagination: {
      currentPage,
      lastPage,
      total: safeTotal,
      perPage: safePerPage,
      from: safeFrom,
      to: safeTo,
      hasMore: currentPage < lastPage,
    },
  };
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown>[]}
 */
export function parseOrdersListResponse(payload) {
  return parseOrdersListPayload(payload).orders;
}

/**
 * @param {unknown} payload
 * @returns {Record<string, unknown> | null}
 */
export function parseOrderDetailResponse(payload) {
  if (!payload || typeof payload !== "object") return null;
  const record = /** @type {Record<string, unknown>} */ (payload);

  if (record.success === true && record.data && typeof record.data === "object") {
    const data = /** @type {Record<string, unknown>} */ (record.data);
    if (data.order && typeof data.order === "object") {
      return /** @type {Record<string, unknown>} */ (data.order);
    }
    if (!Array.isArray(data)) return data;
  }

  if (record.order && typeof record.order === "object") {
    return /** @type {Record<string, unknown>} */ (record.order);
  }

  if (normalizeOrderApiId(record) || normalizeOrderReference(record)) return record;

  return null;
}
