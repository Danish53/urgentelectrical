import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { buildCheckoutHref } from "@/lib/checkoutHref";
import { formatApiPrice, priceIncVatFromString } from "@/lib/pricing";
import { serviceSlug } from "@/lib/slugs";

const SITE = "https://www.urgentelectrical.services";

export const CATEGORY_LABELS = {
  emergency: "Emergency",
  testing: "Testing & Safety",
  domestic: "Domestic",
  commercial: "Commercial",
};

const IMAGE_MAP = {
  "Emergency Response - 24/7": { image: "/featured/emergency-24.jpg", color: "#DC2626" },
  "Electrical Installation Condition Report (EICR)": { image: "/featured/eicr.jpg", color: "#2563EB" },
  "Portable Appliance Testing (PAT)": { image: "/featured/pat.jpg", color: "#7C3AED" },
  "Fire Alarm Inspection & Testing": { image: "/featured/fire-alarm.jpg", color: "#D3231F" },
  "Emergency Lighting Periodic Inspection & Testing": {
    image: "/featured/emergency-lighting.jpg",
    color: "#16A34A",
  },
  "Emergency Lighting Periodic Inspection & Testing Certificate": {
    image: "/featured/emergency-lighting.jpg",
    color: "#16A34A",
  },
  "Domestic Electrical Fault Investigation": { image: "/featured/fault-investigation.jpg", color: "#EA580C" },
  "Fuse Box (Consumer Unit) Replacement": { image: "/featured/eicr.jpg", color: "#1E40AF" },
  "Bathroom Extractor Fan Replacement": { image: "/featured/pat.jpg", color: "#0D9488" },
  "Electrical Panel Heater": { image: "/featured/emergency-lighting.jpg", color: "#CA8A04" },
  "Socket Replacement": { image: "/featured/fault-investigation.jpg", color: "#64748B" },
  "Socket Replacment": { image: "/featured/fault-investigation.jpg", color: "#64748B" },
};

const SERVICE_DESCRIPTIONS = {
  "Emergency Response - 24/7":
    "24/7 emergency electricians across Nottingham and the East Midlands. Fast response, no call-out fee on fixed-price jobs.",
  "Electrical Installation Condition Report (EICR)":
    "Landlord and homeowner EICR certificates. NICEIC approved testing with clear reports and remedial quotes.",
  "Portable Appliance Testing (PAT)":
    "PAT testing for homes, offices, and landlords. Compliant certificates and labelling for all appliances.",
  "Fire Alarm Inspection & Testing":
    "Commercial fire alarm inspection, testing, and certification to keep your premises compliant.",
  "Emergency Lighting Periodic Inspection & Testing":
    "Emergency lighting tests and logbooks for commercial and residential blocks.",
  "Emergency Lighting Periodic Inspection & Testing Certificate":
    "Emergency lighting tests and logbooks for commercial and residential blocks.",
  "Domestic Electrical Fault Investigation":
    "Expert fault finding for tripping RCDs, flickering lights, and partial power loss — fixed-price diagnosis.",
  "Fuse Box (Consumer Unit) Replacement":
    "Modern consumer unit upgrades with RCBO protection. Surge protection and certification included.",
  "Bathroom Extractor Fan Replacement":
    "Quiet, efficient bathroom fan supply and fit. IP-rated for safe installation in wet zones.",
  "Electrical Panel Heater":
    "Supply and installation of panel heaters with correct circuit protection and certification.",
  "Socket Replacement":
    "Damaged or outdated socket replacement with safe isolation and testing.",
  "Socket Replacment": "Damaged or outdated socket replacement with safe isolation and testing.",
};

const SERVICE_CATEGORY_MAP = {
  "Emergency Response - 24/7": "emergency",
  "Electrical Installation Condition Report (EICR)": "testing",
  "Portable Appliance Testing (PAT)": "testing",
  "Fire Alarm Inspection & Testing": "commercial",
  "Emergency Lighting Periodic Inspection & Testing": "commercial",
  "Emergency Lighting Periodic Inspection & Testing Certificate": "commercial",
  "Domestic Electrical Fault Investigation": "domestic",
  "Fuse Box (Consumer Unit) Replacement": "domestic",
  "Bathroom Extractor Fan Replacement": "domestic",
  "Electrical Panel Heater": "domestic",
  "Socket Replacement": "domestic",
  "Socket Replacment": "domestic",
};

const CATEGORY_BY_API_ID = {
  1: "domestic",
  2: "testing",
};

/** Map API slug variants to static detail content keys */
const DETAIL_SLUG_ALIASES = {
  "emergency-lighting-periodic-inspection-and-testing-certificate":
    "emergency-lighting-periodic-inspection-and-testing",
  "socket-replacment": "socket-replacement",
};

function buildServiceVariants(extraVariants) {
  if (!extraVariants?.length) return null;
  return extraVariants.map((v) => ({
    ...v,
    priceIncVat: priceIncVatFromString(String(v.priceExc)),
  }));
}

function buildPriceDisplay(priceIncVat, variants) {
  if (variants?.length) {
    const amounts = variants.map((v) => parseFloat(v.priceIncVat));
    const min = Math.min(...amounts).toFixed(2);
    const max = Math.max(...amounts).toFixed(2);
    return {
      type: "range",
      min,
      max,
      label: `FROM £${min} – £${max} Inc. VAT`,
      prefix: "FROM",
      amounts: `£${min} – £${max}`,
      suffix: "Inc. VAT",
    };
  }
  return {
    type: "fixed",
    amount: priceIncVat,
    label: `£${priceIncVat} Inc. VAT`,
    amounts: `£${priceIncVat}`,
    suffix: "Inc. VAT",
  };
}

function resolveDetailExtra(slug) {
  if (SERVICE_DETAIL_EXTRA[slug]) return SERVICE_DETAIL_EXTRA[slug];
  const alias = DETAIL_SLUG_ALIASES[slug];
  if (alias && SERVICE_DETAIL_EXTRA[alias]) return SERVICE_DETAIL_EXTRA[alias];
  return {};
}

/**
 * @param {{ id: number, service_category_id: number, title: string, price: string, description?: string | null, image?: string | null }} api
 */
export function buildBookableServiceFromApi(api) {
  const name = api.title?.trim() ?? "Electrical service";
  const price = String(api.price ?? "0");
  const slug = serviceSlug(name);
  const extra = resolveDetailExtra(slug);
  const meta = IMAGE_MAP[name] ?? { image: "/featured/pat.jpg", color: "#D3231F" };
  const category =
    SERVICE_CATEGORY_MAP[name] ?? CATEGORY_BY_API_ID[api.service_category_id] ?? "domestic";
  const priceIncVat = formatApiPrice(price);
  const variants = buildServiceVariants(extra.variants);
  const priceDisplay = buildPriceDisplay(priceIncVat, variants);
  const image =
    api.image && (api.image.startsWith("http") || api.image.startsWith("/"))
      ? api.image
      : meta.image;
  const description =
    api.description?.trim() ||
    SERVICE_DESCRIPTIONS[name] ||
    "Fixed-price electrical service — book online with NICEIC approved engineers.";

  return {
    apiId: api.id,
    serviceCategoryId: api.service_category_id,
    name,
    price,
    tag: name === "Emergency Response - 24/7" ? "Most Popular" : undefined,
    slug,
    id: String(api.id),
    category,
    categoryLabel: CATEGORY_LABELS[category] ?? "Domestic",
    description,
    image,
    color: meta.color,
    href: `/services/${slug}`,
    canonicalUrl: `${SITE}/services/${slug}`,
    bookHref: buildCheckoutHref({ service: name }),
    priceIncVat,
    variants,
    priceDisplay,
    longDescription: extra.longDescription ?? [description],
    features: extra.features ?? [],
    includes: extra.includes ?? [],
    faqs: extra.faqs ?? [],
    metaTitle: extra.metaTitle ?? name,
    metaDescription: extra.metaDescription ?? description,
    keywords: extra.keywords ?? [],
  };
}

/**
 * @param {Array<{ id: number, service_category_id: number, title: string, price: string, description?: string | null, image?: string | null }>} list
 */
export function buildBookableServicesFromApi(list) {
  return list.map(buildBookableServiceFromApi);
}

/** Simple { name, price } for booking dropdowns */
export function toBookingOptions(bookable) {
  return bookable.map((s) => ({ name: s.name, price: s.price, tag: s.tag }));
}

/** Featured carousel card shape */
export function toFeaturedCard(service) {
  return {
    id: service.slug,
    name: service.name,
    priceIncVat: service.priceIncVat,
    color: service.color,
    image: service.image,
    tag: service.tag,
  };
}
