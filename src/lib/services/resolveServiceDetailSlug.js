import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { serviceSlug } from "@/lib/slugs";

/** URL / API slug variants → canonical SERVICE_DETAIL_EXTRA key */
export const DETAIL_SLUG_ALIASES = {
  "emergency-lighting-periodic-inspection-and-testing-certificate":
    "emergency-lighting-periodic-inspection-and-testing",
  "socket-replacment": "socket-replacement",
  "emergency-response-247": "emergency-response-24-7",
  "emergency-response-24-7-247": "emergency-response-24-7",
};

const SERVICE_DETAIL_SLUG_HINTS = [
  { hint: "eicr", key: "electrical-installation-condition-report-eicr" },
  { hint: "emergency-response", key: "emergency-response-24-7" },
  { hint: "emergency", key: "emergency-response-24-7" },
  { hint: "pat", key: "portable-appliance-testing-pat" },
  { hint: "fire-alarm", key: "fire-alarm-inspection-and-testing" },
  { hint: "emergency-lighting", key: "emergency-lighting-periodic-inspection-and-testing" },
  { hint: "fault", key: "domestic-electrical-fault-investigation" },
  { hint: "fuse-box", key: "fuse-box-consumer-unit-replacement" },
  { hint: "consumer-unit", key: "fuse-box-consumer-unit-replacement" },
  { hint: "extractor", key: "bathroom-extractor-fan-replacement" },
  { hint: "panel-heater", key: "electrical-panel-heater" },
  { hint: "socket", key: "socket-replacement" },
];

/**
 * Canonical slug for static copy in serviceDetails.js
 * @param {string} [slug]
 * @param {string} [title]
 */
export function resolveServiceDetailSlug(slug, title) {
  const candidates = [slug, serviceSlug(slug || ""), title, serviceSlug(title || "")]
    .map((c) => (typeof c === "string" ? c.trim() : ""))
    .filter(Boolean);

  for (const c of candidates) {
    if (SERVICE_DETAIL_EXTRA[c]) return c;
    if (DETAIL_SLUG_ALIASES[c]) return DETAIL_SLUG_ALIASES[c];
  }

  const normalized = serviceSlug(slug || title || "");
  if (SERVICE_DETAIL_EXTRA[normalized]) return normalized;
  if (DETAIL_SLUG_ALIASES[normalized]) return DETAIL_SLUG_ALIASES[normalized];

  for (const { hint, key } of SERVICE_DETAIL_SLUG_HINTS) {
    if (normalized.includes(hint)) return key;
  }

  return normalized || slug || "";
}

/**
 * @param {string} [slug]
 * @param {string} [title]
 */
export function resolveDetailExtra(slug, title) {
  const key = resolveServiceDetailSlug(slug, title);
  return SERVICE_DETAIL_EXTRA[key] ?? {};
}

/**
 * Multi-paragraph “About this service” copy (EICR-style) for every slug.
 * @param {ReturnType<typeof resolveDetailExtra>} extra
 * @param {string} [description]
 * @param {string} [title]
 * @returns {string[]}
 */
export function getServiceLongDescription(extra, description, title) {
  if (extra?.longDescription?.length) return extra.longDescription;

  const name = title?.trim() || "this electrical service";
  const lead =
    description?.trim() ||
    `Professional ${name} from NICEIC approved engineers in Nottingham and the East Midlands.`;

  return [
    lead,
    `Our team carries out ${name} to current standards, with safe isolation, clear communication on site, and transparent pricing before any additional remedial work proceeds.`,
    "Book online for fixed-price slots where available, or call us to discuss access, timing, and follow-up certificates or repairs from the same trusted electricians.",
  ];
}
