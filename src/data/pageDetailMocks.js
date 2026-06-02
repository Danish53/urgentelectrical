import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { serviceSlug } from "@/lib/slugs";
import { resolveServiceDetailSlug } from "@/lib/services/resolveServiceDetailSlug";

const DEFAULT_TRUST_PILLS = ["NICEIC approved", "Fully insured", "Nottingham & East Midlands"];

const DEFAULT_PROCESS = [
  {
    step: "01",
    title: "Book or call",
    text: "Choose a convenient slot online or speak to our team. We confirm scope, access, and any fixed pricing before attendance.",
  },
  {
    step: "02",
    title: "On-site visit",
    text: "NICEIC approved engineers attend with the right test equipment and materials for your property type.",
  },
  {
    step: "03",
    title: "Clear results",
    text: "You receive a plain-English explanation, certificate, or written summary — with coded observations explained where relevant.",
  },
  {
    step: "04",
    title: "Next steps",
    text: "Remedial work, follow-up visits, or certificates are quoted transparently and completed by the same trusted team.",
  },
];

const DEFAULT_FEATURES = [
  "NICEIC approved, fully insured engineers",
  "Fixed pricing on booked work where shown",
  "Nottingham, Nottinghamshire & East Midlands",
  "Clear reports and certificates",
  "Remedial quotes from the same team",
];

const DEFAULT_INCLUDES = [
  "Qualified engineer attendance",
  "Professional inspection or installation work",
  "Clear explanation of findings",
  "Advice on any urgent safety issues",
];

const DEFAULT_FAQS = [
  {
    q: "How do I book?",
    a: "Use the Book online button for fixed-price services, or call our Nottingham team to discuss your property and arrange a visit.",
  },
  {
    q: "Which areas do you cover?",
    a: "We cover Nottingham, surrounding towns, and the wider East Midlands. Contact us if you are unsure about your postcode.",
  },
];

const DEFAULT_SYMPTOMS = [
  "You need certification for a property sale or let",
  "An insurer or agent has requested a report",
  "The installation has not been tested recently",
  "You are planning major electrical works",
  "You want peace of mind about electrical safety",
  "Previous observations need re-checking",
];

/** @type {Record<string, { category: string, image: string, priceHint: string, symptoms?: string[], process?: typeof DEFAULT_PROCESS }>} */
export const PAGE_SLUG_META = {
  "emergency-response-24-7": {
    category: "Emergency",
    image: "/featured/emergency-24.jpg",
    priceHint: "Emergency response from £156 inc. VAT",
    symptoms: [
      "Complete or partial power loss",
      "Burning smell from a fitting or consumer unit",
      "Sparking sockets or switches",
      "RCD tripping and won't reset",
      "Exposed or damaged wiring",
      "Need urgent isolation before repairs",
    ],
  },
  "electrical-installation-condition-report-eicr": {
    category: "Testing & Safety",
    image: "/featured/eicr.jpg",
    priceHint: "EICR from £118.80 inc. VAT",
    symptoms: [
      "Landlord renewal or change of tenancy",
      "Buying or selling a property",
      "Mortgage or insurance request",
      "Consumer unit looks outdated",
      "No recent electrical certificate",
      "Previous EICR with outstanding observations",
    ],
  },
  "portable-appliance-testing-pat": {
    category: "Commercial",
    image: "/featured/pat.jpg",
    priceHint: "PAT testing with fixed-price options",
    symptoms: [
      "Workplace H&S audit approaching",
      "New staff or office equipment",
      "Landlord supplying appliances in lets",
      "Insurance requires PAT records",
      "Labels or records out of date",
      "Mixed office and kitchen appliances",
    ],
  },
  "fire-alarm-inspection-and-testing": {
    category: "Commercial",
    image: "/featured/fire-alarm.jpg",
    priceHint: "Fire alarm inspection — book for a quote",
    symptoms: [
      "Annual fire alarm test due",
      "Beeping or fault light on panel",
      "Change of building use or layout",
      "Insurance or fire risk assessment action",
      "New tenant or business occupation",
      "After building works near devices",
    ],
  },
  "emergency-lighting-periodic-inspection-and-testing": {
    category: "Testing & Safety",
    image: "/featured/emergency-lighting.jpg",
    priceHint: "Emergency lighting testing — fixed pricing",
    symptoms: [
      "Annual duration test required",
      "Fittings fail to illuminate on test",
      "New build or refurbishment sign-off",
      "Fire risk assessment recommendations",
      "Damaged or missing exit signs",
      "Battery backup shorter than rated",
    ],
  },
  "domestic-electrical-fault-investigation": {
    category: "Domestic",
    image: "/featured/fault-investigation.jpg",
    priceHint: "Investigation visits from £78 inc. VAT",
    process: [
      {
        step: "01",
        title: "Listen & make safe",
        text: "We confirm what you are experiencing — tripping RCDs, flickering lights, partial power loss — and isolate hazards before testing.",
      },
      {
        step: "02",
        title: "Systematic testing",
        text: "Circuits, accessories, and appliances are tested methodically, including insulation and thermal checks where appropriate.",
      },
      {
        step: "03",
        title: "Clear findings",
        text: "You receive a plain-English explanation of the cause and a written summary of what we found on site.",
      },
      {
        step: "04",
        title: "Repair quote",
        text: "Simple fixes may be completed on the visit. Larger remedial work is quoted transparently by the same trusted team.",
      },
    ],
    symptoms: [
      "RCD or fuse box keeps tripping",
      "Flickering or dimming lights",
      "Buzzing from consumer unit or sockets",
      "Partial power loss in one room",
      "Burning smell from a fitting or switch",
      "One appliance trips the whole house",
    ],
  },
  "fuse-box-consumer-unit-replacement": {
    category: "Domestic",
    image: "/featured/eicr.jpg",
    priceHint: "Consumer unit upgrades from £654 inc. VAT",
    symptoms: [
      "Old fuse wire board still in place",
      "No RCD protection on circuits",
      "Failed EICR on the consumer unit",
      "Adding EV charger or solar soon",
      "Frequent nuisance tripping",
      "Buying a property built before 2000",
    ],
  },
  "bathroom-extractor-fan-replacement": {
    category: "Domestic",
    image: "/featured/pat.jpg",
    priceHint: "Extractor fans from £156 inc. VAT",
    symptoms: [
      "Fan noisy or has stopped working",
      "Mould or condensation in bathroom",
      "Landlord compliance for ventilation",
      "Upgrading to humidistat or timer fan",
      "En-suite with poor extraction",
      "New bathroom fit-out needs wiring",
    ],
  },
  "electrical-panel-heater": {
    category: "Domestic",
    image: "/featured/emergency-lighting.jpg",
    priceHint: "Panel heater installs — book for pricing",
    symptoms: [
      "Replacing old storage heaters",
      "Cold room needs efficient heat source",
      "Landlord upgrading heating in lets",
      "Garage or conservatory heating",
      "Timer or thermostat not working",
      "Safety concerns with existing heater",
    ],
  },
  "socket-replacement": {
    category: "Domestic",
    image: "/featured/fault-investigation.jpg",
    priceHint: "Socket work with fixed supply-and-fit pricing",
    symptoms: [
      "Cracked or discoloured socket faceplates",
      "Loose sockets or switches",
      "Adding USB or extra outlets",
      "Kitchen or outdoor socket upgrade",
      "Burn marks or heat damage",
      "Part P notifiable work required",
    ],
  },
};

const RELATED_LINKS = [
  { slug: "emergency-response-24-7", label: "Emergency Electrician", href: "/pages/emergency-response-24-7" },
  {
    slug: "electrical-installation-condition-report-eicr",
    label: "EICR Nottingham",
    href: "/pages/electrical-installation-condition-report-eicr",
  },
  { slug: "portable-appliance-testing-pat", label: "PAT Testing", href: "/pages/portable-appliance-testing-pat" },
  {
    slug: "fire-alarm-inspection-and-testing",
    label: "Fire alarm testing",
    href: "/pages/fire-alarm-inspection-and-testing",
  },
  {
    slug: "domestic-electrical-fault-investigation",
    label: "Fault finding",
    href: "/pages/domestic-electrical-fault-investigation",
  },
  {
    slug: "fuse-box-consumer-unit-replacement",
    label: "Fuse box replacement",
    href: "/pages/fuse-box-consumer-unit-replacement",
  },
  { slug: "socket-replacement", label: "Socket replacement", href: "/pages/socket-replacement" },
];

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * @param {string} slug
 * @param {import("@/services/pagesApiService").ApiInfoPageDetail | null} [page]
 */
export function resolvePageDetailSlug(slug, page = null) {
  return resolveServiceDetailSlug(slug, page?.title);
}

function pickRelated(slug) {
  const pool = RELATED_LINKS.filter((link) => link.slug !== slug);
  return pool.slice(0, 4);
}

function getGenericParagraphs(title) {
  return [
    `Our ${title} service is delivered by NICEIC approved electricians across Nottingham and the East Midlands.`,
    "Book online for fixed pricing where available, or contact us to discuss your property, access requirements, and the best time for a visit.",
  ];
}

/**
 * Rich layout for every /pages/[slug] route (dummy/reference until CMS HTML is live).
 * @param {string} slug
 * @param {import("@/services/pagesApiService").ApiInfoPageDetail | null} [page]
 */
export function getPageDetailLayout(slug, page = null) {
  const resolved = resolvePageDetailSlug(slug, page);
  const extra = SERVICE_DETAIL_EXTRA[resolved] ?? null;
  const meta = PAGE_SLUG_META[resolved] ?? {};

  const fallbackTitle = page?.title?.trim() || titleFromSlug(resolved || slug);
  const title =
    page?.title?.trim() ||
    extra?.metaTitle?.replace(/\s*\|.*$/, "").trim() ||
    fallbackTitle;

  const lead =
    page?.description?.trim() ||
    page?.seo_description?.trim() ||
    extra?.metaDescription ||
    `Professional ${fallbackTitle} from NICEIC approved engineers in Nottingham and the East Midlands.`;

  const paragraphs =
    extra?.longDescription?.length ? extra.longDescription : getGenericParagraphs(title);

  const features = extra?.features?.length ? extra.features : DEFAULT_FEATURES;
  const includes = extra?.includes?.length ? extra.includes : DEFAULT_INCLUDES;
  const faqs = extra?.faqs?.length ? extra.faqs : DEFAULT_FAQS;

  return {
    slug: resolved || slug,
    title,
    lead,
    paragraphs,
    features,
    includes,
    faqs,
    category: meta.category ?? "Service guide",
    image: meta.image ?? "/featured/pat.jpg",
    priceHint: meta.priceHint ?? "Fixed pricing — book online for details",
    bookHref: `/services/${resolved || slug}`,
    trustPills: DEFAULT_TRUST_PILLS,
    process: meta.process ?? DEFAULT_PROCESS,
    symptoms: meta.symptoms ?? DEFAULT_SYMPTOMS,
    related: pickRelated(resolved || slug),
    keywords: extra?.keywords ?? [],
  };
}
