/** Nav label → bookable `/services/{slug}` or other-services `/pages/{slug}` */

/**
 * @param {string} label
 * @param {string | null} [href]
 */
function navItem(label, href = null) {
  const path = typeof href === "string" && href.trim() ? href.trim() : "/pages";
  const slug = path === "/pages" ? null : path.split("/").filter(Boolean).pop() || null;
  return { label, slug, href: path };
}

export const NAV_DOMESTIC = [
  navItem("Domestic Electrician", "/services/domestic-electrical-fault-investigation"),
  navItem("EICR Nottingham", "/services/electrical-installation-condition-report-eicr"),
  navItem("Emergency Electrician Nottingham", "/services/emergency-response-247"),
  navItem("Electrical Fault Finding Nottingham", "/services/domestic-electrical-fault-investigation"),
  navItem("Fuse Box Replacement Nottingham", "/services/fuse-box-consumer-unit-replacement"),
  navItem("Socket Replacement & Installation Nottingham", "/services/socket-replacment"),
];

export const NAV_COMMERCIAL = [
  navItem("Fire Alarm Installation Nottingham", "/services/fire-alarm-inspection-testing"),
  navItem("Commercial Electrician", "/pages/portable-appliance-testing-pat-test"),
  navItem("PAT Testing Nottingham", "/services/portable-appliance-testing-pat"),
  navItem(
    "Emergency Lighting Nottingham",
    "/services/emergency-lighting-periodic-inspection-testing-certificate",
  ),
];

export const NAV_INDUSTRIAL = [
  navItem("Industrial Electrician", "/services/electrical-installation-condition-report-eicr"),
  navItem("Planned Electrical Maintenance", "/services/emergency-response-247"),
  navItem("Electrical Certificates Nottingham", "/services/electrical-installation-condition-report-eicr"),
];

export const NAV_RENEWABLES = [
  navItem("EV Charger Installation Nottingham"),
  navItem("Solar Panels Nottingham"),
];

export const NAV_TESTING_SAFETY = [
  navItem("EICR Testing Nottingham", "/services/electrical-installation-condition-report-eicr"),
  navItem("PAT Testing Nottingham", "/services/portable-appliance-testing-pat"),
  navItem(
    "Emergency Lighting Testing",
    "/services/emergency-lighting-periodic-inspection-testing-certificate",
  ),
  navItem("Fire Alarm Testing Nottingham", "/services/fire-alarm-inspection-testing"),
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
