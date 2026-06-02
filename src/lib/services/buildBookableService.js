import { buildCheckoutHref } from "@/lib/checkoutHref";
import { buildRangePriceDisplay, formatPriceAmount, priceIncVatFromString } from "@/lib/pricing";
import { serviceSlug } from "@/lib/slugs";
import {
  DETAIL_SLUG_ALIASES,
  getServiceLongDescription,
  resolveDetailExtra,
} from "@/lib/services/resolveServiceDetailSlug";

export { DETAIL_SLUG_ALIASES };

const SITE = "https://www.urgentelectrical.services";

/** @deprecated Prefer API category labels via categoryMap */
export const CATEGORY_LABELS = {
  domestic: "Domestic",
  commercial: "Commercial",
  security: "Security",
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

/** @param {{ slug: string, label: string, id: number } | undefined} category */
function resolveServiceCategoryFields(category, serviceCategoryId) {
  if (category) {
    return {
      category: category.slug,
      categoryLabel: category.label,
      serviceCategoryId: serviceCategoryId ?? category.id,
    };
  }

  return {
    category: "domestic",
    categoryLabel: "Domestic",
    serviceCategoryId: serviceCategoryId ?? 1,
  };
}

function buildServiceVariants(extraVariants) {
  if (!extraVariants?.length) return null;
  return extraVariants.map((v) => {
    const priceExcVat = formatPriceAmount(String(v.priceExc));
    return {
      ...v,
      priceExcVat,
      priceIncVat: priceIncVatFromString(priceExcVat),
    };
  });
}


/**
 * Resolve canonical API slug (list links must match GET /services/{slug}).
 * @param {{ slug?: string | null, title?: string | null }} api
 */
export function resolveServiceSlugFromApi(api) {
  const fromApi = String(api.slug ?? "").trim();
  if (fromApi) return fromApi;
  return serviceSlug(String(api.title ?? "").trim() || "Electrical service");
}

/**
 * @param {{ id: number, service_category_id: number, title: string, price: string, slug?: string | null, description?: string | null, image?: string | null }} api
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 */
export function buildBookableServiceFromApi(api, categoryMap = {}) {
  const name = api.title?.trim() ?? "Electrical service";
  const price = String(api.price ?? "0");
  const slug = resolveServiceSlugFromApi(api);
  const extra = resolveDetailExtra(slug, name);
  const meta = IMAGE_MAP[name] ?? { image: "/featured/pat.jpg", color: "#D3231F" };
  const { category, categoryLabel, serviceCategoryId } = resolveServiceCategoryFields(
    categoryMap[api.service_category_id],
    api.service_category_id
  );
  const priceExcVat = formatPriceAmount(price);
  const priceIncVat = priceIncVatFromString(priceExcVat);
  const variants = buildServiceVariants(extra.variants);
  const priceDisplay = buildRangePriceDisplay(variants, priceExcVat);
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
    serviceCategoryId,
    name,
    price,
    priceExcVat,
    tag: name === "Emergency Response - 24/7" ? "Most Popular" : undefined,
    slug,
    id: String(api.id),
    category,
    categoryLabel,
    description,
    image,
    color: meta.color,
    href: `/services/${slug}`,
    canonicalUrl: `${SITE}/services/${slug}`,
    bookHref: buildCheckoutHref({ service: name }),
    priceIncVat,
    variants,
    priceDisplay,
    longDescription: getServiceLongDescription(extra, description, name),
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
 * @param {Record<number, import("@/lib/services/buildServiceCategory").ReturnType<import("@/lib/services/buildServiceCategory").buildServiceCategoryFromApi>>} [categoryMap]
 */
export function buildBookableServicesFromApi(list, categoryMap = {}) {
  return list.map((api) => buildBookableServiceFromApi(api, categoryMap));
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
    price: service.price,
    priceExcVat: service.priceExcVat,
    priceIncVat: service.priceIncVat,
    color: service.color,
    image: service.image,
    tag: service.tag,
    href: service.href,
  };
}
