export const AVAILABILITY_OPEN = {
  limited: false,
  heroText: "Engineers available now in your area",
  navText: "Engineers available now",
  navTextCompact: "Available now",
};

export const AVAILABILITY_LIMITED = {
  limited: true,
  heroText: "Limited availability — call us before booking",
  navText: "Limited availability",
  navTextCompact: "Limited",
};

/** Engineers shown as available between 6:00 and 22:00 local time. */
export function getEngineerAvailability() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 22 ? AVAILABILITY_OPEN : AVAILABILITY_LIMITED;
}
