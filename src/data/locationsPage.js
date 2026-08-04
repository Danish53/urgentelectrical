import { getOgImageUrl, getSiteUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { documentTitle } from "@/lib/seo/documentTitle";

const SITE = getSiteUrl();

export const LOCATIONS_CANONICAL = `${SITE}/locations`;

export const LOCATIONS_HERO = {
  title: "Areas we",
  titleAccent: "cover",
  description:
    "From Nottingham city centre to surrounding towns and villages, we proudly serve communities throughout the region — browse the areas we regularly attend.",
  highlights: ["24/7 cover", "NICEIC approved", "Fast response"],
};

export const LOCATIONS_INTRO = {
  title:
    "Emergency Electricians & Electrical Maintenance in Nottingham & East Midlands | Urgent Electrical",
  paragraphs: [
    "At Urgent Electrical, we are proud to be your trusted local electricians, offering a comprehensive range of electrical services to homes and businesses across Nottingham and the East Midlands. With years of experience and a team of fully qualified, NICEIC-approved electricians, we are committed to delivering safe, reliable, and high-quality electrical solutions.",
    "Whether you need an emergency electrician in the middle of the night, a routine electrical inspection, or a full rewire, our expert team is here to help. We understand the importance of keeping your property safe and powered — which is why we offer 24/7 emergency call-outs, transparent pricing, and professional workmanship on every job.",
  ],
};

export const LOCATIONS_MAP_EMBED =
  "https://maps.google.com/maps?q=Nottingham+Derby+Leicester+East+Midlands+UK&hl=en&z=8&ie=UTF8&iwloc=&output=embed";

export const LOCATION_FILTERS = [
  { id: "all", label: "All" },
  { id: "nottingham", label: "Nottingham" },
  { id: "derby", label: "Derby" },
  { id: "leicester", label: "Leicester" },
  { id: "lincoln", label: "Lincoln" },
];

/** Towns and districts by filter region */
export const LOCATION_AREAS_BY_REGION = {
  nottingham: [
    "Nottingham City Centre",
    "Arnold",
    "Beeston",
    "West Bridgford",
    "Hucknall",
    "Carlton",
    "Mapperley",
    "Gedling",
    "Bulwell",
    "Sherwood",
    "Radcliffe-on-Trent",
    "Bingham",
    "Mansfield",
    "Newark-on-Trent",
    "Retford",
    "Worksop",
    "Southwell",
  ],
  derby: [
    "Derby City Centre",
    "Long Eaton",
    "Ilkeston",
    "Stapleford",
    "Sandiacre",
    "Borrowash",
    "Spondon",
    "Alvaston",
    "Mickleover",
    "Swadlincote",
    "Ashbourne",
    "Belper",
    "Duffield",
  ],
  leicester: [
    "Leicester City Centre",
    "Loughborough",
    "Coalville",
    "Hinckley",
    "Market Harborough",
    "Melton Mowbray",
    "Lutterworth",
    "Oadby",
    "Wigston",
    "Birstall",
    "Syston",
    "Enderby",
  ],
  lincoln: [
    "Lincoln City Centre",
    "Grantham",
    "Sleaford",
    "Boston",
    "Spalding",
    "Stamford",
    "Bourne",
    "Gainsborough",
    "Horncastle",
    "Louth",
    "Skegness",
  ],
};

export function getAllLocationNames() {
  const seen = new Set();
  const list = [];
  Object.values(LOCATION_AREAS_BY_REGION).forEach((areas) => {
    areas.forEach((name) => {
      if (!seen.has(name)) {
        seen.add(name);
        list.push(name);
      }
    });
  });
  return list.sort((a, b) => a.localeCompare(b));
}

export function getLocationsForFilter(filterId) {
  if (filterId === "all") return getAllLocationNames();
  return LOCATION_AREAS_BY_REGION[filterId] ?? [];
}

export const LOCATIONS_INITIAL_VISIBLE = 24;

export function buildLocationsMetadata(page = 1) {
  const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
  const pageTitle = documentTitle(
    pageNum > 1
      ? `Service Areas | Page ${pageNum} | Electricians Nottingham`
      : "Service Areas | Electricians Nottingham"
  );
  const description =
    pageNum > 1
      ? `Urgent Electrical covers Nottingham, Derby, Leicester, Lincoln and the East Midlands — page ${pageNum}. Find your area, check postcode availability, and book NICEIC approved electricians 24/7.`
      : "Urgent Electrical covers Nottingham, Derby, Leicester, Lincoln and the East Midlands. Find your area, check postcode availability, and book NICEIC approved electricians 24/7.";

  return {
    title: pageTitle,
    description,
    keywords: [
      "electrician Nottingham areas",
      "emergency electrician East Midlands",
      "electrical services Derby Leicester",
      "electrician near me Nottinghamshire",
      "Urgent Electrical locations",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: LOCATIONS_CANONICAL,
      siteName: "Urgent Electrical Services",
      title: pageTitle.absolute,
      description,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "Urgent Electrical service areas across the East Midlands",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle.absolute,
      description,
      images: [getOgImageUrl()],
    },
    alternates: { canonical: LOCATIONS_CANONICAL },
  };
}

export const LOCATIONS_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Locations", item: LOCATIONS_CANONICAL },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${LOCATIONS_CANONICAL}#webpage`,
      url: LOCATIONS_CANONICAL,
      name: "Areas we cover — Urgent Electrical Services",
      description: LOCATIONS_HERO.description,
      isPartOf: { "@id": `${SITE}/#website` },
    },
    {
      "@type": "ElectricalContractor",
      "@id": `${SITE}/#organization`,
      name: "Urgent Electrical Services",
      url: SITE,
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Nottingham, Derby, Leicester, Lincoln and the East Midlands, United Kingdom",
      },
    },
  ],
};
