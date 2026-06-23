import { getScheduleSlotsForDate, normalizeApiDate } from "@/lib/schedules";
import { readCheckoutAddress } from "@/lib/checkout/checkoutAddressFields";

/**
 * @param {unknown} value
 */
function nullIfEmpty(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

/**
 * @param {unknown} value
 */
function toMoneyNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}

/**
 * @param {Date | string | null | undefined} date
 */
export function formatCheckoutApiDate(date) {
  return normalizeApiDate(date);
}

/**
 * Resolve CRM schedule key from selected slot label/value.
 * @param {Date | null} selectedDate
 * @param {string | null} selectedTime
 * @param {import("@/lib/schedules").ScheduleSlot[]} schedules
 */
export function resolveCrmScheduleKey(selectedDate, selectedTime, schedules) {
  if (!selectedTime || !schedules?.length) return null;

  const slot = schedules.find(
    (s) => s.value === selectedTime || s.label === selectedTime
  );
  if (slot?.crmScheduleKey) return slot.crmScheduleKey;

  if (!selectedDate) return null;
  return (
    getScheduleSlotsForDate(schedules, selectedDate).find(
      (s) => s.value === selectedTime || s.label === selectedTime
    )?.crmScheduleKey ?? null
  );
}

/**
 * @param {{
 *   service: { apiId?: number | string } | null,
 *   variant: { apiVariantId?: number | string } | null,
 *   selectedDate: Date | null,
 *   selectedTime: string | null,
 *   schedules?: import("@/lib/schedules").ScheduleSlot[],
 *   details: Record<string, unknown>,
 *   lineItems: { totalInc: string },
 *   paymentIntentId: string | null,
 *   crmScheduleKey?: string | null,
 *   sameAddress?: boolean,
 *   coupon?: { code?: string, discountAmount?: number, discountValue?: number | null, discountType?: string | null } | null,
 * }} params
 */
export function buildValidateOrderPayload({
  service,
  variant,
  selectedDate,
  selectedTime,
  schedules = [],
  details,
  lineItems,
  paymentIntentId,
  crmScheduleKey: crmOverride,
  sameAddress = true,
  coupon = null,
}) {
  const serviceSubTotal = toMoneyNumber(lineItems.service?.amountExc);
  const deliveryFee = toMoneyNumber(lineItems.travel?.amountExc);
  const serviceInc = toMoneyNumber(lineItems.service?.amountInc);
  const deliveryInc = toMoneyNumber(lineItems.travel?.amountInc);
  const discountAmount = Math.max(0, Number(coupon?.discountAmount ?? 0) || 0);
  const amount = Math.max(0, serviceInc + deliveryInc - discountAmount);

  const sameAsBilling = details.siteSameAsBilling === true;
  const billing = readCheckoutAddress(details, "billing");
  const site = sameAsBilling ? billing : readCheckoutAddress(details, "site");

  const crmScheduleKey =
    crmOverride ?? resolveCrmScheduleKey(selectedDate, selectedTime, schedules) ?? "CRM-1";

  const isGuest = details.isGuest !== false;

  /** @type {Record<string, unknown>} */
  const payload = {
    service_id: Number(service?.apiId),
    variant_id:
      variant?.apiVariantId != null
        ? Number(variant.apiVariantId)
        : variant?.id != null && !Number.isNaN(Number(variant.id))
          ? Number(variant.id)
          : null,
    same_address: sameAsBilling,
    amount,
    delivery_fee: deliveryFee,
    sub_total: serviceSubTotal,
    selected_date: selectedDate ? formatCheckoutApiDate(selectedDate) : null,
    selected_time: selectedTime || null,
    discount_amount: discountAmount,
    discount_value: coupon?.discountValue ?? null,
    discount_type: coupon?.discountType ?? null,
    crm_schedule_key: String(crmScheduleKey),
    payment_intent_id: paymentIntentId,
    site_country: site.country,
    site_post_code: site.postcode,
    site_address_line_1: site.address,
    site_address_line_2: nullIfEmpty(site.addressLine2),
    site_town: site.city,
    site_county: nullIfEmpty(site.county),
    is_guest: isGuest,
    country: billing.country,
    post_code: billing.postcode,
    address_line_1: billing.address,
    address_line_2: nullIfEmpty(billing.addressLine2),
    town: billing.city,
    county: nullIfEmpty(billing.county),
    title: String(details.title ?? "Mr").trim() || "Mr",
    first_name: String(details.firstName ?? "").trim(),
    last_name: String(details.lastName ?? "").trim(),
    mobile_number: String(details.phone ?? "").trim(),
    email: String(details.email ?? "").trim(),
    company: nullIfEmpty(details.company),
    same_as_billing_address: sameAsBilling ? 1 : 0,
  };

  const couponCode = String(coupon?.code ?? "").trim();
  if (couponCode) {
    payload.coupon_code = couponCode;
  }

  const password = String(details.password ?? "").trim();
  const passwordConfirmation = String(details.passwordConfirmation ?? password).trim();
  if (isGuest && password) {
    payload.password = password;
    payload.password_confirmation = passwordConfirmation;
  }

  return payload;
}

/**
 * @param {unknown} data
 */
export function parsePaymentIntentResponse(data) {
  const root = /** @type {Record<string, unknown>} */ (data ?? {});
  const nested = /** @type {Record<string, unknown>} */ (root.data ?? {});

  const clientSecret =
    String(
      root.client_secret ??
        root.clientSecret ??
        nested.client_secret ??
        nested.clientSecret ??
        ""
    ).trim() || null;

  const paymentIntentId =
    String(
      root.payment_intent_id ??
        root.paymentIntentId ??
        root.id ??
        nested.payment_intent_id ??
        nested.paymentIntentId ??
        nested.id ??
        ""
    ).trim() || null;

  const stripePublishableKey =
    String(root.stripe_key ?? root.stripeKey ?? nested.stripe_key ?? nested.stripeKey ?? "").trim() ||
    null;

  const paymentMethodTypes = Array.isArray(root.payment_method_types)
    ? root.payment_method_types
    : Array.isArray(nested.payment_method_types)
      ? nested.payment_method_types
      : null;

  return { clientSecret, paymentIntentId, stripePublishableKey, paymentMethodTypes, raw: data };
}
