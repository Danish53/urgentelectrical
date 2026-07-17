import { getSiteUrl } from "@/lib/siteUrl";
import { documentTitle } from "@/lib/seo/documentTitle";

const SITE = getSiteUrl();

export const CONTACT_CANONICAL = `${SITE}/contact-us`;

export const CONTACT_ADDRESS = {
  streetAddress: "17 Regent Street",
  addressLocality: "Nottingham",
  postalCode: "NG1 5BQ",
  addressCountry: "GB",
  full: "17 Regent Street, Nottingham NG1 5BQ",
};

export const CONTACT_EMAIL = "info@urgentelectrical.services";
export const CONTACT_PHONE_DISPLAY = "0115 778 0622";
export const CONTACT_PHONE_TEL = "01157780622";

export const CONTACT_GEO = {
  latitude: 52.9538,
  longitude: -1.1504,
};

export const CONTACT_BUSINESS_NAME = "Urgent Electrical Services Limited";

/** Google listing — shown on contact map card */
export const CONTACT_MAP_RATING = {
  score: 4.6,
  count: 97,
};

export const CONTACT_MAP_EMBED =
  "https://maps.google.com/maps?q=Urgent+Electrical+Services+Limited,+17+Regent+Street,+Nottingham+NG1+5BQ&hl=en&z=18&t=h&ie=UTF8&iwloc=near&output=embed";

export const CONTACT_MAP_LINK =
  "https://www.google.com/maps/search/?api=1&query=Urgent+Electrical+Services+Limited,+17+Regent+Street,+Nottingham+NG1+5BQ";

export const CONTACT_MAP_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=17+Regent+Street,+Nottingham+NG1+5BQ";

export const CONTACT_HOURS = "Open 24 hours, 7 days a week";

/** Displayed in business hours card */
export const CONTACT_BUSINESS_HOURS = [
  { label: "Monday – Friday", hours: "24 / 7" },
  { label: "Saturday", hours: "24 / 7" },
  { label: "Sunday", hours: "24 / 7" },
];

export const CONTACT_ENQUIRY_TYPES = [
  "General enquiry",
  "Emergency call-out",
  "Request a quote",
  "Booking question",
  "Commercial / landlord work",
  "Other",
];

export function buildContactMetadata() {
  const pageTitle = documentTitle("Contact Us | Electricians in Nottingham");
  return {
    title: pageTitle,
    description:
      "Contact Urgent Electrical in Nottingham — 17 Regent Street NG1 5BQ. Call 0115 778 0622 or email info@urgentelectrical.services. NICEIC approved, 24/7.",
    keywords: [
      "contact electrician Nottingham",
      "Urgent Electrical contact",
      "electrician Nottingham phone",
      "17 Regent Street electrician",
      "emergency electrician Nottingham number",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: CONTACT_CANONICAL,
      siteName: "Urgent Electrical Services",
      title: pageTitle.absolute,
      description:
        "Get in touch with our Nottingham office — phone, email, contact form, and directions to 17 Regent Street NG1 5BQ.",
    },
    twitter: {
      card: "summary",
      title: pageTitle.absolute,
      description:
        "Call 0115 778 0622 or use our contact form. 17 Regent Street, Nottingham NG1 5BQ.",
    },
    alternates: { canonical: CONTACT_CANONICAL },
  };
}

export const CONTACT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Contact us", item: CONTACT_CANONICAL },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": `${CONTACT_CANONICAL}#webpage`,
      url: CONTACT_CANONICAL,
      name: "Contact Urgent Electrical Services",
      description:
        "Contact our Nottingham electricians by phone, email, or online form. Visit us at 17 Regent Street NG1 5BQ.",
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ElectricalContractor",
      "@id": `${SITE}/#organization`,
      name: "Urgent Electrical Services",
      url: SITE,
      telephone: CONTACT_PHONE_TEL,
      email: CONTACT_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: CONTACT_ADDRESS.streetAddress,
        addressLocality: CONTACT_ADDRESS.addressLocality,
        postalCode: CONTACT_ADDRESS.postalCode,
        addressCountry: CONTACT_ADDRESS.addressCountry,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: CONTACT_GEO.latitude,
        longitude: CONTACT_GEO.longitude,
      },
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
      areaServed: ["Nottingham", "Nottinghamshire", "East Midlands"],
    },
  ],
};
