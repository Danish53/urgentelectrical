/**
 * Featured carousel — replace images in /public/featured/
 * Card: pat.jpg, fire-alarm.jpg, emergency-lighting.jpg, fault-investigation.jpg, eicr.jpg, emergency-24.jpg
 * Nav arrows: built-in SVG in FeaturedServices.jsx (optional custom: nav-prev.png, nav-next.png)
 */
export const FEATURED_SERVICES = [
  {
    id: "pat",
    name: "Portable Appliance Testing (PAT)",
    priceExc: 65,
    color: "#7C3AED",
    image: "/featured/pat.jpg",
  },
  {
    id: "fire-alarm",
    name: "Fire Alarm Inspection & Testing",
    priceExc: 99,
    color: "#E32B2B",
    image: "/featured/fire-alarm.jpg",
  },
  {
    id: "emergency-lighting",
    name: "Emergency Lighting Periodic Inspection & Testing",
    priceExc: 135,
    color: "#16A34A",
    image: "/featured/emergency-lighting.jpg",
  },
  {
    id: "fault-investigation",
    name: "Domestic Electrical Fault Investigation",
    priceExc: 65,
    color: "#EA580C",
    image: "/featured/fault-investigation.jpg",
  },
  {
    id: "eicr",
    name: "Electrical Installation Condition Report (EICR)",
    priceExc: 99,
    color: "#2563EB",
    image: "/featured/eicr.jpg",
  },
  {
    id: "emergency-24",
    name: "Emergency Response - 24/7",
    priceExc: 130,
    color: "#DC2626",
    image: "/featured/emergency-24.jpg",
    tag: "Most Popular",
  },
];

export function priceIncVat(priceExc) {
  return (priceExc * 1.2).toFixed(2);
}
