const SITE = "https://www.urgentelectrical.services";

export const LOCATIONS_CANONICAL = `${SITE}/locations`;

export const LOCATIONS_HERO = {
  title: "Areas we",
  titleAccent: "cover",
  description:
    "Emergency electricians across Nottingham, Derby, Leicester, Lincoln and the wider East Midlands — 24/7 response and fixed pricing.",
  highlights: ["24/7 cover", "NICEIC approved", "Fast response"],
};

export const LOCATIONS_INTRO = {
  title:
    "Emergency Electricians & Electrical Maintenance in Nottingham & East Midlands | Urgent Electrical",
  paragraphs: [
    "At Urgent Electrical, we are proud to be your trusted local electricians, offering a comprehensive range of electrical services to homes and businesses across Nottingham and the East Midlands. With years of experience and a team of fully qualified, NICEIC-approved electricians, we are committed to delivering safe, reliable, and high-quality electrical solutions.",
    "Whether you need an emergency electrician in the middle of the night, a routine electrical inspection, or a full rewire, our expert team is here to help. We understand the importance of keeping your property safe and powered — which is why we offer 24/7 emergency call-outs, transparent pricing, and professional workmanship on every job.",
    "From Nottingham city centre to surrounding towns and villages, we proudly serve communities throughout the region. Use the search below to check coverage in your postcode, then browse the areas we regularly attend.",
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

export function buildLocationsMetadata() {
  return {
    title: "Service Areas | Electricians Nottingham & East Midlands",
    description:
      "Urgent Electrical covers Nottingham, Derby, Leicester, Lincoln and the East Midlands. Find your area, check postcode availability, and book NICEIC approved electricians 24/7.",
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
      title: "Areas We Cover | Urgent Electrical",
      description: LOCATIONS_HERO.description,
    },
    twitter: {
      card: "summary_large_image",
      title: "Service areas | Urgent Electrical Nottingham",
      description: LOCATIONS_HERO.description,
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
      areaServed: getAllLocationNames().map((name) => ({
        "@type": "City",
        name,
      })),
    },
  ],
};
