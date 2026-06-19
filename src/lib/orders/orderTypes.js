/** @typedef {"confirmed" | "in_progress" | "completed" | "cancelled"} OrderStatus */

/**
 * @typedef {object} OrdersPagination
 * @property {number} currentPage
 * @property {number} lastPage
 * @property {number} total
 * @property {number} perPage
 * @property {number} from
 * @property {number} to
 * @property {boolean} hasMore
 */

/**
 * @typedef {object} OrderSummary
 * @property {string} id
 * @property {string} reference
 * @property {string} serviceName
 * @property {string} serviceSlug
 * @property {string} category
 * @property {OrderStatus} status
 * @property {string} statusLabel
 * @property {string} bookedAt
 * @property {string} visitDate
 * @property {string} visitTime
 * @property {string} address
 * @property {number} totalInc
 * @property {number} totalExc
 * @property {number} serviceSubTotal
 * @property {number} deliveryFee
 * @property {number} discount
 * @property {string} paymentMethod
 * @property {string} paymentStatus
 * @property {Record<string, unknown>} [raw]
 */

/**
 * @typedef {OrderSummary & {
 *   customerName?: string,
 *   customerPhone?: string,
 *   customerEmail?: string,
 *   notes?: string,
 *   engineerNotes?: string,
 *   raw?: Record<string, unknown>,
 * }} OrderDetail
 */

export {};
