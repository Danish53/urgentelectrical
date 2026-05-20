import { SERVICES } from "./services";

/** Maps booking services to featured images in /public/featured/ */
const IMAGE_MAP = {
  "Emergency Response - 24/7": { image: "/featured/emergency-24.jpg", color: "#DC2626" },
  "Electrical Installation Condition Report (EICR)": { image: "/featured/eicr.jpg", color: "#2563EB" },
  "Portable Appliance Testing (PAT)": { image: "/featured/pat.jpg", color: "#7C3AED" },
  "Fire Alarm Inspection & Testing": { image: "/featured/fire-alarm.jpg", color: "#D3231F" },
  "Emergency Lighting Periodic Inspection & Testing": {
    image: "/featured/emergency-lighting.jpg",
    color: "#16A34A",
  },
  "Domestic Electrical Fault Investigation": { image: "/featured/fault-investigation.jpg", color: "#EA580C" },
  "Fuse Box (Consumer Unit) Replacement": { image: "/featured/eicr.jpg", color: "#1E40AF" },
  "Bathroom Extractor Fan Replacement": { image: "/featured/pat.jpg", color: "#0D9488" },
  "Electrical Panel Heater": { image: "/featured/emergency-lighting.jpg", color: "#CA8A04" },
  "Socket Replacement": { image: "/featured/fault-investigation.jpg", color: "#64748B" },
};

export const HOME2_SERVICES = SERVICES.map((s) => ({
  ...s,
  image: IMAGE_MAP[s.name]?.image ?? "/featured/pat.jpg",
  color: IMAGE_MAP[s.name]?.color ?? "#D3231F",
}));

export function priceIncVatFromString(price) {
  return (parseFloat(price) * 1.2).toFixed(2);
}
