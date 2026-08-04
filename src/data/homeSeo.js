import { FAQ_ITEMS } from "./faqs";
import { getSiteUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { withMetaNameTitle } from "@/lib/seo/buildSeoMetadata";

const SITE = getSiteUrl();

/** Shorter FAQ set on homepage for faster load & focused schema */
export const HOME_FAQ_ITEMS = FAQ_ITEMS.slice(0, 4);

const HOME_TITLE = "Urgent Electrical Nottingham | East Midlands";
const HOME_DESCRIPTION =
  "Emergency electricians in Nottingham and across the East Midlands. NICEIC approved. 24/7 response. No call-out fees. Fixed transparent pricing.";

export const HOME_METADATA = withMetaNameTitle(
  {
    metadataBase: new URL(SITE),
    title: {
      absolute: HOME_TITLE,
    },
    description: HOME_DESCRIPTION,
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
      title: HOME_TITLE,
      description:
        "Looking for an electrician in Nottingham? Urgent Electrical Services offers residential, commercial & industrial work, emergency call-outs.",
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "Urgent Electrical Services Nottingham",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_TITLE,
      description:
        "NICEIC approved emergency electricians in Nottingham. 60-90 min response. No call-out fees. Book online now.",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: SITE },
  },
  HOME_TITLE
);

export const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/#webpage`,
      url: SITE,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
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
  ],
};
