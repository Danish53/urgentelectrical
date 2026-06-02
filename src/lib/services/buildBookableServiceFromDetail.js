import { buildCheckoutHref } from "@/lib/checkoutHref";
import { buildRangePriceDisplay, formatPriceAmount, priceIncVatFromString } from "@/lib/pricing";
import { slugify } from "@/lib/slugs";
import {
  resolveDetailExtra,
  resolveServiceSlugFromApi,
} from "@/lib/services/buildBookableService";

const SITE = "https://www.urgentelectrical.services";

const FALLBACK_META = {
  "Emergency Response - 24/7": { image: "/featured/emergency-24.jpg", color: "#DC2626" },
  "Electrical Installation Condition Report (EICR)": { image: "/featured/eicr.jpg", color: "#2563EB" },
  "Portable Appliance Testing (PAT)": { image: "/featured/pat.jpg", color: "#7C3AED" },
};

function resolveCategoryFromDetail(api, categoryMap = {}) {
  const mapped = categoryMap[api.service_category_id];
  if (mapped) {
    return {
      category: mapped.slug,
      categoryLabel: mapped.label,
      serviceCategoryId: api.service_category_id ?? mapped.id,
    };
  }

  const apiCategory = api.category;
  const label = String(apiCategory?.category_name ?? "").trim() || "Domestic";
  const slug =
    String(apiCategory?.slug ?? "").trim() ||
    slugify(label) ||
    "domestic";

  return {
    category: slug,
    categoryLabel: label,
    serviceCategoryId: api.service_category_id ?? apiCategory?.id ?? 1,
  };
}

function buildApiVariants(apiVariants) {
  if (!Array.isArray(apiVariants) || !apiVariants.length) return [];

  return apiVariants.map((v) => {
    const priceExcVat = formatPriceAmount(v.variant_price);
    return {
      id: String(v.id),
      apiVariantId: v.id,
      label: v.variant_name?.trim() ?? "Option",
      price: priceExcVat,
      priceExcVat,
      priceIncVat: priceIncVatFromString(priceExcVat),
    };
  });
}

function resolveImage(api, name) {
  const fromApi = api.image?.trim();
  if (fromApi && (fromApi.startsWith("http") || fromApi.startsWith("/"))) {
    return fromApi;
  }
  return FALLBACK_META[name]?.image ?? "/featured/pat.jpg";
}

/**
 * Full service detail payload from GET /services/{slug}
 * @param {Record<string, unknown>} api
 * @param {Record<number, { slug: string, label: string, id: number }>} [categoryMap]
 */
export function buildBookableServiceFromDetailApi(api, categoryMap = {}) {
  const name = String(api.title ?? "").trim() || "Electrical service";
  const slug = resolveServiceSlugFromApi({ slug: api.slug, title: name });
  const price = String(api.price ?? "0");
  const priceExcVat = formatPriceAmount(price);
  const variants = buildApiVariants(api.variants);
  const priceIncVat = variants[0]?.priceIncVat ?? priceIncVatFromString(priceExcVat);
  const priceDisplay = buildRangePriceDisplay(variants, priceExcVat);
  const { category, categoryLabel, serviceCategoryId } = resolveCategoryFromDetail(api, categoryMap);
  const description =
    String(api.description ?? "").trim() ||
    "Fixed-price electrical service — book online with NICEIC approved engineers.";
  const extra = resolveDetailExtra(slug);
  const meta = FALLBACK_META[name] ?? { color: "#D3231F" };
  const isEmergency =
    name.toLowerCase().includes("emergency") || slug.includes("emergency");

  return {
    apiId: api.id,
    serviceCategoryId,
    name,
    price,
    priceExcVat,
    slug,
    id: String(api.id),
    category,
    categoryLabel,
    description,
    image: resolveImage(api, name),
    color: meta.color,
    href: `/services/${slug}`,
    canonicalUrl: `${SITE}/services/${slug}`,
    bookHref: buildCheckoutHref({ service: name }),
    priceIncVat,
    variants,
    priceDisplay,
    longDescriptionHtml: null,
    longDescription: extra.longDescription ?? [description],
    includes: extra.includes ?? [],
    features: extra.features ?? [],
    faqs: extra.faqs ?? [],
    schedules: Array.isArray(api.schedules) ? api.schedules : [],
    metaTitle: extra.metaTitle ?? name,
    metaDescription: extra.metaDescription ?? description,
    keywords: extra.keywords ?? [],
    tag: isEmergency ? "Most Popular" : undefined,
  };
}

export function getVariantById(service, variantId) {
  if (!variantId || !service?.variants?.length) return null;
  return service.variants.find((v) => v.id === variantId) ?? null;
}

export function getDefaultVariantId(service) {
  return service?.variants?.[0]?.id ?? "";
}
