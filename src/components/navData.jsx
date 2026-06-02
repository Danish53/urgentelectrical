/** Nav label → other-services page slug (GET /pages/{slug}; falls back to /services data) */
const SLUG = {
  emergency: "emergency-response-24-7",
  eicr: "electrical-installation-condition-report-eicr",
  pat: "portable-appliance-testing-pat",
  fireAlarm: "fire-alarm-inspection-and-testing",
  emergencyLighting: "emergency-lighting-periodic-inspection-and-testing",
  faultFinding: "domestic-electrical-fault-investigation",
  fuseBox: "fuse-box-consumer-unit-replacement",
  socket: "socket-replacement",
};

function navItem(label, slug) {
  return {
    label,
    slug: slug ?? null,
    href: slug ? `/pages/${slug}` : "/pages",
  };
}

export const NAV_DOMESTIC = [
  navItem("Domestic Electrician", SLUG.faultFinding),
  navItem("EICR Nottingham", SLUG.eicr),
  navItem("Emergency Electrician Nottingham", SLUG.emergency),
  navItem("Electrical Fault Finding Nottingham", SLUG.faultFinding),
  navItem("Fuse Box Replacement Nottingham", SLUG.fuseBox),
  navItem("Socket Replacement & Installation Nottingham", SLUG.socket),
];

export const NAV_COMMERCIAL = [
  navItem("Fire Alarm Installation Nottingham", SLUG.fireAlarm),
  navItem("Commercial Electrician", SLUG.pat),
  navItem("PAT Testing Nottingham", SLUG.pat),
  navItem("Emergency Lighting Nottingham", SLUG.emergencyLighting),
];

export const NAV_INDUSTRIAL = [
  navItem("Industrial Electrician", SLUG.eicr),
  navItem("Planned Electrical Maintenance", SLUG.emergency),
  navItem("Electrical Certificates Nottingham", SLUG.eicr),
];

export const NAV_RENEWABLES = [
  navItem("EV Charger Installation Nottingham"),
  navItem("Solar Panels Nottingham"),
];

export const NAV_TESTING_SAFETY = [
  navItem("EICR Testing Nottingham", SLUG.eicr),
  navItem("PAT Testing Nottingham", SLUG.pat),
  navItem("Emergency Lighting Testing", SLUG.emergencyLighting),
  navItem("Fire Alarm Testing Nottingham", SLUG.fireAlarm),
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
