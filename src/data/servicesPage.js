import { NAV_GROUPS } from "@/components/navData";
import { serviceSlug } from "@/lib/slugs";
import { formatApiPrice, priceIncVatFromString } from "@/lib/pricing";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

import { getSiteUrl } from "@/lib/siteUrl";

const SITE = getSiteUrl();

export { formatApiPrice, priceIncVatFromString };

export function getRelatedServices(service, list, limit = 3) {
  return list
    .filter((s) => {
      if (s.slug === service.slug) return false;
      if (service.serviceCategoryId != null && s.serviceCategoryId != null) {
        return s.serviceCategoryId === service.serviceCategoryId;
      }
      return s.category === service.category;
    })
    .slice(0, limit);
}

export function buildServiceMetadata(service) {
  const description = service.metaDescription;
  return buildSeoMetadata(service.metaTitle, description, {
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
      description,
    },
    alternates: {
      canonical: service.canonicalUrl,
    },
  });
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
        image: service.image?.startsWith("http") ? service.image : `${SITE}${service.image}`,
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

/** Build services index JSON-LD from API-backed list */
export function buildServicesJsonLd(bookable) {
  return {
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
        numberOfItems: bookable.length,
        itemListElement: bookable.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Service",
            name: s.name,
            description: s.description,
            url: s.canonicalUrl,
            provider: {
              "@type": "ElectricalContractor",
              name: "Urgent Electrical Services",
              url: SITE,
            },
            offers: {
              "@type": "Offer",
              price: s.priceIncVat,
              priceCurrency: "GBP",
              availability: "https://schema.org/InStock",
            },
          },
        })),
      },
    ],
  };
}
