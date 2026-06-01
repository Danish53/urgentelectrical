/** Demo order list — replace with API when `/orders` endpoint is available. */

/** @typedef {"confirmed" | "in_progress" | "completed" | "cancelled"} OrderStatus */

/**
 * @typedef {object} Order
 * @property {string} id
 * @property {string} serviceName
 * @property {string} category
 * @property {OrderStatus} status
 * @property {string} bookedAt ISO date
 * @property {string} visitDate YYYY-MM-DD
 * @property {string} visitTime
 * @property {string} address
 * @property {number} totalInc
 * @property {number} totalExc
 */

/** @type {Order[]} */
export const MOCK_ORDERS = [
  {
    id: "UE-2026-0847",
    serviceName: "EICR Certificate (Domestic)",
    category: "Domestic",
    status: "confirmed",
    bookedAt: "2026-04-28T10:30:00",
    visitDate: "2026-05-12",
    visitTime: "09:00 – 12:00",
    address: "42 Mapperley Road, Nottingham NG3 5FS",
    totalInc: 189,
    totalExc: 157.5,
  },
  {
    id: "UE-2026-0791",
    serviceName: "Emergency Call-Out",
    category: "Domestic",
    status: "in_progress",
    bookedAt: "2026-04-20T18:05:00",
    visitDate: "2026-04-21",
    visitTime: "18:30 – 20:30",
    address: "18 Trent Boulevard, West Bridgford NG2 5NE",
    totalInc: 145,
    totalExc: 120.83,
  },
  {
    id: "UE-2026-0612",
    serviceName: "EV Charger Installation",
    category: "Domestic",
    status: "completed",
    bookedAt: "2026-03-10T14:20:00",
    visitDate: "2026-03-18",
    visitTime: "13:00 – 17:00",
    address: "7 Wollaton Vale, Nottingham NG8 1FW",
    totalInc: 899,
    totalExc: 749.17,
  },
  {
    id: "UE-2026-0444",
    serviceName: "Commercial PAT Testing",
    category: "Commercial",
    status: "completed",
    bookedAt: "2026-02-02T09:15:00",
    visitDate: "2026-02-14",
    visitTime: "08:00 – 16:00",
    address: "Unit 4 Riverside Park, Derby DE1 2AY",
    totalInc: 420,
    totalExc: 350,
  },
  {
    id: "UE-2025-9912",
    serviceName: "Fuse Board Upgrade",
    category: "Domestic",
    status: "cancelled",
    bookedAt: "2025-12-08T11:00:00",
    visitDate: "2025-12-15",
    visitTime: "10:00 – 14:00",
    address: "91 Alfreton Road, Nottingham NG7 3JL",
    totalInc: 650,
    totalExc: 541.67,
  },
];

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
 * @param {Order} order
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
 * @param {Order[]} orders
 */
export function getOrderStats(orders) {
  return {
    total: orders.length,
    upcoming: orders.filter((o) => o.status === "confirmed" || o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };
}
