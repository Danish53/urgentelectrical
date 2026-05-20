import { serviceSlug } from "@/lib/slugs";

function serviceHref(label) {
  return `/services#${serviceSlug(label)}`;
}

export const NAV_DOMESTIC = [
  { label: "Domestic Electrician", href: serviceHref("Domestic Electrician") },
  { label: "EICR Nottingham", href: serviceHref("EICR Nottingham") },
  { label: "Emergency Electrician Nottingham", href: serviceHref("Emergency Electrician Nottingham") },
  { label: "Electrical Fault Finding Nottingham", href: serviceHref("Electrical Fault Finding Nottingham") },
  { label: "Fuse Box Replacement Nottingham", href: serviceHref("Fuse Box Replacement Nottingham") },
  { label: "Socket Replacement & Installation Nottingham", href: serviceHref("Socket Replacement & Installation Nottingham") },
];

export const NAV_COMMERCIAL = [
  { label: "Fire Alarm Installation Nottingham", href: serviceHref("Fire Alarm Installation Nottingham") },
  { label: "Commercial Electrician Nottingham", href: serviceHref("Commercial Electrician Nottingham") },
  { label: "PAT Testing Nottingham", href: serviceHref("PAT Testing Nottingham") },
  { label: "Emergency Lighting Nottingham", href: serviceHref("Emergency Lighting Nottingham") },
];

export const NAV_INDUSTRIAL = [
  { label: "Industrial Electrician Nottingham", href: serviceHref("Industrial Electrician Nottingham") },
  { label: "Planned Electrical Maintenance", href: serviceHref("Planned Electrical Maintenance") },
  { label: "Electrical Certificates Nottingham", href: serviceHref("Electrical Certificates Nottingham") },
];

export const NAV_RENEWABLES = [
  { label: "EV Charger Installation Nottingham", href: serviceHref("EV Charger Installation Nottingham") },
  { label: "Solar Panels Nottingham", href: serviceHref("Solar Panels Nottingham") },
];

export const NAV_TESTING_SAFETY = [
  { label: "EICR Testing Nottingham", href: serviceHref("EICR Testing Nottingham") },
  { label: "PAT Testing Nottingham", href: serviceHref("PAT Testing Nottingham") },
  { label: "Emergency Lighting Testing", href: serviceHref("Emergency Lighting Testing") },
  { label: "Fire Alarm Testing Nottingham", href: serviceHref("Fire Alarm Testing Nottingham") },
];

export const NAV_GROUPS = [
  { label: "Domestic", items: NAV_DOMESTIC },
  { label: "Commercial", items: NAV_COMMERCIAL },
  { label: "Industrial", items: NAV_INDUSTRIAL },
  { label: "Renewables", items: NAV_RENEWABLES },
  { label: "Testing & Safety", items: NAV_TESTING_SAFETY },
];

export const NAV_DROPDOWN_SUBTITLES = {
  Domestic: "Professional domestic services",
  Commercial: "Professional commercial services",
  Industrial: "Professional industrial services",
  Renewables: "Professional renewable services",
  "Testing & Safety": "Professional testing & safety services",
};
