import { SERVICES } from "./services";
import { NAV_GROUPS } from "@/components/navData";
import { SERVICE_DETAIL_EXTRA } from "./serviceDetails";
import { serviceSlug } from "@/lib/slugs";

const SITE = "https://www.urgentelectrical.services";

export const CATEGORY_LABELS = {
  emergency: "Emergency",
  testing: "Testing & Safety",
  domestic: "Domestic",
  commercial: "Commercial",
};

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
};

export function priceIncVatFromString(price) {
  return (parseFloat(price) * 1.2).toFixed(2);
}

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

export const SERVICE_CATEGORIES = [
  { id: "all", label: "All services" },
  { id: "emergency", label: "Emergency" },
  { id: "testing", label: "Testing & safety" },
  { id: "domestic", label: "Domestic" },
  { id: "commercial", label: "Commercial" },
];

const SERVICE_CATEGORY_MAP = {
  "Emergency Response - 24/7": "emergency",
  "Electrical Installation Condition Report (EICR)": "testing",
  "Portable Appliance Testing (PAT)": "testing",
  "Fire Alarm Inspection & Testing": "commercial",
  "Emergency Lighting Periodic Inspection & Testing": "commercial",
  "Domestic Electrical Fault Investigation": "domestic",
  "Fuse Box (Consumer Unit) Replacement": "domestic",
  "Bathroom Extractor Fan Replacement": "domestic",
  "Electrical Panel Heater": "domestic",
  "Socket Replacement": "domestic",
};

/** Bookable fixed-price services for the services page grid */
export const BOOKABLE_SERVICES = SERVICES.map((s) => {
  const meta = IMAGE_MAP[s.name] ?? { image: "/featured/pat.jpg", color: "#D3231F" };
  const slug = serviceSlug(s.name);
  const extra = SERVICE_DETAIL_EXTRA[slug] ?? {};
  const category = SERVICE_CATEGORY_MAP[s.name] ?? "domestic";
  const priceIncVat = priceIncVatFromString(s.price);
  const variants = buildServiceVariants(extra.variants);
  const priceDisplay = buildPriceDisplay(priceIncVat, variants);
  return {
    ...s,
    slug,
    id: slug,
    category,
    categoryLabel: CATEGORY_LABELS[category] ?? "Domestic",
    description: SERVICE_DESCRIPTIONS[s.name] ?? "NICEIC approved electrical work with transparent fixed pricing.",
    image: meta.image,
    color: meta.color,
    href: `/services/${slug}`,
    canonicalUrl: `${SITE}/services/${slug}`,
    bookHref: "/#book",
    priceIncVat,
    variants,
    priceDisplay,
    longDescription: extra.longDescription ?? [SERVICE_DESCRIPTIONS[s.name] ?? ""],
    features: extra.features ?? [],
    includes: extra.includes ?? [],
    faqs: extra.faqs ?? [],
    metaTitle: extra.metaTitle ?? s.name,
    metaDescription: extra.metaDescription ?? SERVICE_DESCRIPTIONS[s.name],
    keywords: extra.keywords ?? [],
  };
});

export function getAllServiceSlugs() {
  return BOOKABLE_SERVICES.map((s) => s.slug);
}

export function getServiceBySlug(slug) {
  return BOOKABLE_SERVICES.find((s) => s.slug === slug) ?? null;
}

export function getRelatedServices(service, limit = 3) {
  const same = BOOKABLE_SERVICES.filter((s) => s.slug !== service.slug && s.category === service.category);
  const other = BOOKABLE_SERVICES.filter((s) => s.slug !== service.slug && s.category !== service.category);
  return [...same, ...other].slice(0, limit);
}

export function buildServiceMetadata(service) {
  const title = service.metaTitle;
  const description = service.metaDescription;
  return {
    title: { absolute: `${title} | Urgent Electrical Services` },
    description,
    keywords: [
      ...service.keywords,
      "NICEIC electrician Nottingham",
      "Urgent Electrical Services",
      service.categoryLabel,
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: service.canonicalUrl,
      siteName: "Urgent Electrical Services",
      title: `${title} | Urgent Electrical Services`,
      description,
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: `${service.name} — Urgent Electrical Nottingham`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Urgent Electrical`,
      description,
    },
    alternates: {
      canonical: service.canonicalUrl,
    },
  };
}

export function buildServiceJsonLd(service) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Our Services", item: `${SITE}/services` },
          { "@type": "ListItem", position: 3, name: service.name, item: service.canonicalUrl },
        ],
      },
      {
        "@type": "Service",
        name: service.name,
        description: service.metaDescription,
        url: service.canonicalUrl,
        image: `${SITE}${service.image}`,
        provider: {
          "@type": "ElectricalContractor",
          name: "Urgent Electrical Services",
          telephone: "+441157780622",
          url: SITE,
        },
        areaServed: "Nottingham and East Midlands",
        offers: {
          "@type": "Offer",
          price: service.priceIncVat,
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        },
      },
      ...(service.faqs.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: service.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}

/** Informative resource links grouped like the main nav */
export const SERVICE_RESOURCE_GROUPS = NAV_GROUPS.map((group) => ({
  id: serviceSlug(group.label),
  label: group.label,
  description:
    group.label === "Domestic"
      ? "Home electrics, EICR, fuse boards, and fault finding across Nottingham."
      : group.label === "Commercial"
        ? "Fire alarms, PAT, emergency lighting, and commercial installs."
        : group.label === "Industrial"
          ? "Planned maintenance and certification for industrial sites."
          : group.label === "Renewables"
            ? "EV chargers and solar-ready electrical infrastructure."
            : "EICR, PAT, fire alarm, and emergency lighting compliance testing.",
  items: group.items.map((item) => ({
    ...item,
    slug: item.slug ?? null,
    href: item.href ?? "/services",
  })),
}));

export const SERVICES_PAGE_TRUST = [
  { value: "24/7", label: "Emergency cover" },
  { value: "Fixed", label: "Transparent pricing" },
  { value: "NICEIC", label: "Approved contractors" },
  { value: "2014", label: "Local since" },
];

export const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Our Services", item: `${SITE}/services` },
      ],
    },
    {
      "@type": "ItemList",
      name: "Electrical Services Nottingham",
      description:
        "Fixed-price and emergency electrical services from Urgent Electrical Services across Nottingham and the East Midlands.",
      numberOfItems: BOOKABLE_SERVICES.length,
      itemListElement: BOOKABLE_SERVICES.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          url: `${SITE}/services/${s.slug}`,
          provider: {
            "@type": "ElectricalContractor",
            name: "Urgent Electrical Services",
            url: SITE,
          },
          offers: {
            "@type": "Offer",
            price: priceIncVatFromString(s.price),
            priceCurrency: "GBP",
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  ],
};
