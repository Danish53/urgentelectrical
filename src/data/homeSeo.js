import { FAQ_ITEMS } from "./faqs";
import { BOOKABLE_SERVICES } from "./servicesPage";

const SITE = "https://www.urgentelectrical.services";

/** Shorter FAQ set on homepage for faster load & focused schema */
export const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 4);

const HOME_TITLE = "Urgent Electrical Nottingham | Electricians Across the East Midlands";

export const HOME_METADATA = {
  metadataBase: new URL(SITE),
  title: {
    absolute: HOME_TITLE,
  },
  description:
    "Emergency electricians in Nottingham and across the East Midlands. NICEIC approved. 24/7 response. No call-out fees. Fixed transparent pricing.",
  keywords: [
    "emergency electrician Nottingham",
    "electrician Nottingham",
    "NICEIC approved electrician",
    "24 hour electrician Nottingham",
    "EICR Nottingham",
    "fuse box replacement Nottingham",
    "electrical fault finding Nottingham",
    "commercial electrician Nottingham",
    "East Midlands electrician",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE,
    siteName: "Urgent Electrical Services",
    title: "Local Emergency Electrician in Nottingham | 24 Hours",
    description:
      "Looking for an electrician in Nottingham? Urgent Electrical Services offers residential, commercial & industrial work, emergency call-outs.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Urgent Electrical Services Nottingham",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Urgent Electrical Nottingham | 24/7 Emergency Electricians",
    description:
      "NICEIC approved emergency electricians in Nottingham. 60-90 min response. No call-out fees. Book online now.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE },
};

export const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: HOME_TITLE,
      description: HOME_METADATA.description,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Urgent Electrical Services",
      publisher: { "@id": `${SITE}/#organization` },
      inLanguage: "en-GB",
    },
    {
      "@type": "FAQPage",
      mainEntity: HOME_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a.replace(/0115 778 0622/g, "01157780622") },
      })),
    },
    {
      "@type": "ItemList",
      name: "Our electrical services",
      itemListElement: BOOKABLE_SERVICES.slice(0, 6).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: s.canonicalUrl,
        name: s.name,
      })),
    },
  ],
};
