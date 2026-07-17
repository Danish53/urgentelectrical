import { LOCATION_AREAS_BY_REGION, LOCATION_FILTERS } from "@/data/locationsPage";
import { SERVICE_DETAIL_EXTRA } from "@/data/serviceDetails";
import { getAreaLocationSlug } from "@/data/areas";
import { slugify } from "@/lib/slugs";
import { toPublicServiceSlug } from "@/lib/services/resolveServiceDetailSlug";

import { absoluteCmsUrl, absoluteSiteUrl, getOgImageUrl, getSiteUrl } from "@/lib/siteUrl";
import { documentTitle } from "@/lib/seo/documentTitle";

const SITE = getSiteUrl();

export const LOCATION_OG_IMAGE_WIDTH = 1200;
export const LOCATION_OG_IMAGE_HEIGHT = 630;

const REGION_LABELS = Object.fromEntries(
  LOCATION_FILTERS.filter((f) => f.id !== "all").map((f) => [f.id, f.label])
);

const REGION_IMAGES = {
  nottingham: "/featured/emergency-24.jpg",
  derby: "/featured/fault-investigation.jpg",
  leicester: "/featured/eicr.jpg",
  lincoln: "/featured/emergency-lighting.jpg",
};

const WHY_CHOOSE = [
  "NICEIC-approved electricians with full certification",
  "24/7 emergency attendance across the East Midlands",
  "Fixed, transparent pricing when you book online",
  "Landlord EICR, PAT, and commercial compliance support",
  "12-month workmanship warranty on qualifying work",
  "Clear communication before and after every visit",
];

export const LOCATION_COMMON_JOBS = [
  "24/7 emergency call-outs for power loss and dangerous faults",
  "Landlord EICR inspections and tenancy compliance",
  "PAT testing for businesses, landlords, and HMOs",
  "Consumer unit upgrades and fuse board replacement",
  "Fault finding for tripping RCDs and flickering lights",
  "Fire alarm and emergency lighting inspections",
];

const TOP_SERVICE_SLUGS = [
  "emergency-response-24-7",
  "electrical-installation-condition-report-eicr",
  "portable-appliance-testing-pat",
  "domestic-electrical-fault-investigation",
  "fuse-box-consumer-unit-replacement",
  "fire-alarm-inspection-and-testing",
];

function findRegionForName(name) {
  for (const [regionId, areas] of Object.entries(LOCATION_AREAS_BY_REGION)) {
    if (areas.includes(name)) return regionId;
  }
  return "nottingham";
}

export function buildLocationHeroLead(name) {
  return `NICEIC-approved electricians serving ${name} — 24/7 emergencies, fixed online pricing, and professional certification on every job.`;
}

function buildParagraphs(name, regionLabel) {
  return [
    `Looking for a reliable electrician in ${name}? Urgent Electrical provides NICEIC-approved electrical services for homes, landlords, and businesses across ${name} and the wider ${regionLabel} area — including 24/7 emergency call-outs when you need help fast.`,
    `Our engineers handle everything from power loss and tripping RCDs to EICR certificates, PAT testing, consumer unit upgrades, fire alarm checks, and planned maintenance. Every job is completed safely, with testing and certification documented where required.`,
    `Book online in minutes for fixed-price work, or call our team for urgent assistance. We operate from Nottingham with coverage across the East Midlands, aiming for prompt attendance and honest quotes before non-emergency work begins.`,
  ];
}

function buildFaqs(name, regionLabel) {
  return [
    {
      id: "cover",
      q: `Do you cover ${name}?`,
      a: `Yes. We regularly attend properties in ${name} and surrounding ${regionLabel} communities. Enter your postcode on our booking form to confirm availability for your address.`,
    },
    {
      id: "emergency",
      q: `Can I get a 24/7 emergency electrician in ${name}?`,
      a: `We offer 24/7 emergency electrical response across the East Midlands, including ${name}. Call our line for urgent faults such as total power loss, burning smells, or dangerous exposed wiring.`,
    },
    {
      id: "landlord",
      q: `Do you provide EICR and PAT testing in ${name}?`,
      a: `Yes — we carry out landlord EICR inspections, PAT testing for offices and rentals, and remedial quotes where improvements are needed, with certificates issued after satisfactory completion.`,
    },
  ];
}

function titleFromSlug(slug) {
  const extra = SERVICE_DETAIL_EXTRA[slug];
  if (extra?.metaTitle) return extra.metaTitle;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildServicesOffered() {
  return TOP_SERVICE_SLUGS.map((slug) => {
    const publicSlug = toPublicServiceSlug(slug);
    return {
      name: titleFromSlug(slug),
      slug: publicSlug,
      href: `/services/${publicSlug}`,
      priceIncVat: null,
      tag: slug === "emergency-response-24-7" ? "Most Popular" : undefined,
    };
  });
}

function getNearby(name, regionId, limit = 8) {
  const areas = LOCATION_AREAS_BY_REGION[regionId] ?? [];
  const shortName = String(name ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();

  return areas
    .filter((areaName) => {
      const lower = areaName.toLowerCase();
      return lower !== String(name ?? "").toLowerCase() && lower !== shortName;
    })
    .map((areaName) => {
      const slug = getAreaLocationSlug(areaName);
      if (!slug) return null;
      return { name: areaName, slug, href: `/locations/${slug}` };
    })
    .filter(Boolean)
    .slice(0, limit);
}

export function buildLocationRecord(name) {
  const regionId = findRegionForName(name);
  const regionLabel = REGION_LABELS[regionId] ?? "East Midlands";
  const slug = slugify(name);

  return {
    slug,
    name,
    regionId,
    regionLabel,
    canonicalUrl: `${SITE}/locations/${slug}`,
    image: REGION_IMAGES[regionId] ?? "/featured/emergency-24.jpg",
    imageAlt: `Electrician in ${name} — Urgent Electrical Services`,
    hero: {
      eyebrow: `${regionLabel} coverage`,
      title: "Emergency electrician in",
      titleAccent: name,
      lead: buildLocationHeroLead(name),
    },
    highlights: ["24/7 emergencies", "NICEIC approved", "Fixed online pricing"],
    paragraphs: buildParagraphs(name, regionLabel),
    whyChoose: WHY_CHOOSE,
    commonJobs: LOCATION_COMMON_JOBS,
    responseNote:
      "Emergency attendance across the East Midlands is typically within 60–90 minutes, subject to engineer availability and traffic.",
    servicesIntro: `Electrical services available in ${name}`,
    services: buildServicesOffered(),
    faqs: buildFaqs(name, regionLabel),
    mapEmbed: `https://maps.google.com/maps?q=${encodeURIComponent(`${name}, UK`)}&hl=en&z=12&ie=UTF8&iwloc=&output=embed`,
    nearby: getNearby(name, regionId),
    bookHref: "/services",
    metaTitle: `Electrician ${name} | 24/7 Emergency`,
    metaDescription: `NICEIC approved electricians in ${name}. Emergency 24/7, EICR, PAT testing, consumer units & more. Fixed prices — book online or call Urgent Electrical.`,
    keywords: [
      `electrician ${name}`,
      `emergency electrician ${name}`,
      `electrical services ${regionLabel}`,
      "NICEIC electrician East Midlands",
      "Urgent Electrical",
    ],
  };
}

function buildAllLocations() {
  const seen = new Set();
  const list = [];
  Object.values(LOCATION_AREAS_BY_REGION).forEach((areas) => {
    areas.forEach((name) => {
      if (!seen.has(name)) {
        seen.add(name);
        list.push(buildLocationRecord(name));
      }
    });
  });
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export const ALL_LOCATIONS = buildAllLocations();

export function getAllLocationSlugs() {
  return ALL_LOCATIONS.map((l) => l.slug);
}

export function getLocationBySlug(slug) {
  return ALL_LOCATIONS.find((l) => l.slug === slug) ?? null;
}

export function getRelatedLocations(location, limit = 6) {
  return ALL_LOCATIONS.filter((l) => l.regionId === location.regionId && l.slug !== location.slug).slice(
    0,
    limit
  );
}

export function getLocationShareImageUrl(location) {
  const raw = location?.image;
  if (!raw || typeof raw !== "string") return getOgImageUrl();
  const trimmed = raw.trim();
  if (!trimmed) return getOgImageUrl();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return absoluteSiteUrl(trimmed);
  return absoluteCmsUrl(trimmed);
}

/** Same-origin OG image URL — proxies API `main_image` for social share previews. */
export function getLocationOgMetadataImageUrl(location) {
  if (!location?.slug) return getOgImageUrl();
  return absoluteSiteUrl(`/api/location-og/${encodeURIComponent(location.slug)}`);
}

export function buildLocationMetadata(location) {
  const imageUrl = getLocationOgMetadataImageUrl(location);
  const imageAlt =
    location.imageAlt || `Electrician in ${location.name} — Urgent Electrical Services`;
  const description =
    location.metaDescription && location.metaDescription.toLowerCase() !== "null"
      ? location.metaDescription
      : `NICEIC approved electricians in ${location.name}. Emergency 24/7, EICR, PAT testing, consumer units & more. Book online with Urgent Electrical.`;

  const pageTitle = documentTitle(location.metaTitle);

  return {
    title: pageTitle,
    description,
    keywords: location.keywords,
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: location.canonicalUrl,
      siteName: "Urgent Electrical Services",
      title: pageTitle.absolute,
      description,
      images: [
        {
          url: imageUrl,
          width: LOCATION_OG_IMAGE_WIDTH,
          height: LOCATION_OG_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle.absolute,
      description,
      images: [imageUrl],
    },
    alternates: { canonical: location.canonicalUrl },
  };
}

export function buildLocationJsonLd(location) {
  const pageTitle = documentTitle(location.metaTitle).absolute;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${location.canonicalUrl}#webpage`,
        url: location.canonicalUrl,
        name: pageTitle,
        description: location.metaDescription,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@type": "Place", name: location.name },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: getLocationShareImageUrl(location),
          width: LOCATION_OG_IMAGE_WIDTH,
          height: LOCATION_OG_IMAGE_HEIGHT,
        },
      },
      {
        "@type": "ElectricalContractor",
        "@id": `${SITE}/#organization`,
        name: "Urgent Electrical Services",
        url: SITE,
        areaServed: {
          "@type": "City",
          name: location.name,
          containedInPlace: { "@type": "AdministrativeArea", name: location.regionLabel },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: location.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
