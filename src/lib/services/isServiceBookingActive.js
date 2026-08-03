/**
 * Whether online booking is allowed for a service.
 * Only `booking_status === 1` (or string `"1"`) is bookable.
 * Any other / missing value means booking is unavailable.
 *
 * @param {unknown} bookingStatus
 * @returns {boolean}
 */
export function isServiceBookingActive(bookingStatus) {
  if (bookingStatus === 1 || bookingStatus === true) return true;
  if (typeof bookingStatus === "string" && bookingStatus.trim() === "1") return true;
  return false;
}

export const SERVICE_BOOKING_UNAVAILABLE_MESSAGE =
  "This service booking currently unavailable";
