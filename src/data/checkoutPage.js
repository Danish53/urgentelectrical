import { CHECKOUT_PATH, buildCheckoutHref } from "@/lib/checkoutHref";
import { formatApiPrice, priceIncVatFromString } from "@/lib/pricing";

const SITE = "https://www.urgentelectrical.services";

export { CHECKOUT_PATH, buildCheckoutHref };
export const CHECKOUT_CANONICAL = `${SITE}${CHECKOUT_PATH}`;

export const CHECKOUT_SESSION_SECONDS = 10 * 60;

export const CHECKOUT_STEPS = [
  { id: 1, key: "datetime", label: "Date & Time" },
  { id: 2, key: "details", label: "Your Details" },
  { id: 3, key: "payment", label: "Payment" },
];

export const CHECKOUT_TIME_SLOTS = [
  "08:00",
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
];

export const TRAVEL_CHARGE_EXC = 0;

export function getDefaultCheckoutService(services) {
  if (!services?.length) return null;
  return services[0];
}

export function findServiceByName(name, services) {
  if (!services?.length) return null;
  return services.find((s) => s.name === name) ?? services[0];
}

export function buildCheckoutLineItems(service, travelExc = TRAVEL_CHARGE_EXC) {
  if (!service) {
    return {
      service: { label: "Service", amountExc: "0.00", amountInc: "0.00" },
      travel: { label: "Travel Charge", amountExc: "0.00", amountInc: "0.00" },
      totalInc: "0.00",
    };
  }

  const serviceInc = parseFloat(service.priceIncVat ?? formatApiPrice(service.price));
  const serviceExc = serviceInc;
  const travelInc = parseFloat(priceIncVatFromString(String(travelExc)));
  const totalInc = (serviceInc + travelInc).toFixed(2);

  return {
    service: {
      label: service.name,
      amountExc: serviceExc.toFixed(2),
      amountInc: serviceInc.toFixed(2),
    },
    travel: {
      label: "Travel Charge",
      amountExc: travelExc.toFixed(2),
      amountInc: travelInc.toFixed(2),
    },
    totalInc,
  };
}

export function buildCheckoutMetadata() {
  return {
    title: "Book your electrician | Checkout",
    description:
      "Complete your booking for NICEIC-approved electrical services in Nottingham and the East Midlands.",
    alternates: { canonical: CHECKOUT_CANONICAL },
    robots: { index: false, follow: false },
  };
}
