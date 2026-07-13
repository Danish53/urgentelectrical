import { getSiteUrl } from "@/lib/siteUrl";

const SITE = getSiteUrl();

export const ABOUT_CANONICAL = `${SITE}/about-us`;

export const ABOUT_HERO = {
  title: "About Urgent Electrical",
  titleAccent: "Services",
  description:
    "Trusted NICEIC approved electricians in Nottingham since 2014 — 24/7 emergency response, fixed pricing, and quality workmanship across the East Midlands.",
  highlights: ["Est. 2014", "NICEIC approved", "24/7 emergency"],
};

export const ABOUT_JOURNEY_IMAGE = {
  src: "/about/journey.jpg",
  fallback: "/featured/emergency-24.jpg",
  alt: "Urgent Electrical Services electrician — 24 hour emergency response Nottingham",
  width: 720,
  height: 900,
};

export const ABOUT_JOURNEY = {
  beganTitle: "How We Began Our Journey",
  beganParagraphs: [
    "Urgent Electrical Services was founded in 2014 with a simple goal — to provide fast, reliable, and high-quality electrical services to homes and businesses across Nottingham and the East Midlands.",
    "Starting as a small, dedicated team of skilled electricians, we focused on building a reputation for trust, professionalism, and excellent customer service. From our first job to now, our commitment to safety, quality workmanship, and 24/7 availability has remained at the core of everything we do.",
    "Today, Urgent Electrical Services is proud to be a trusted name in the region, known for dependability, expertise, and a customer-first approach — continuing to power homes and businesses safely and efficiently.",
  ],
  missionTitle: "Our Mission",
  missionParagraphs: [
    "At Urgent Electrical Services, our mission is simple — to provide safe, reliable, and high-quality electrical services that our customers can depend on 24/7. We're committed to delivering fast response times, professional workmanship, and transparent pricing on every job, whether it's an emergency call-out or a full installation.",
    "Our goal is to keep homes and businesses across Nottingham and the East Midlands powered, protected, and compliant — with service you can trust.",
  ],
  ctaLabel: "Contact Us",
  ctaHref: "/contact-us",
};

export const ABOUT_CORE_VALUES = {
  title: "Our Core Values",
  left: [
    {
      id: "safety",
      title: "Safety First",
      description:
        "We never compromise on safety. Every project is completed to the highest standards and in full compliance with UK regulations.",
      icon: "shield",
    },
    {
      id: "reliability",
      title: "Reliability",
      description:
        "Available 24/7, we're always ready to respond when you need us most — ensuring peace of mind and minimal disruption.",
      icon: "clock",
    },
    {
      id: "quality",
      title: "Quality Workmanship",
      description:
        "Our qualified, NICEIC-approved electricians take pride in delivering professional results with attention to detail and long-lasting performance.",
      icon: "tools",
    },
  ],
  right: [
    {
      id: "integrity",
      title: "Integrity & Transparency",
      description:
        "We believe in honest advice, clear communication, and upfront pricing — no hidden costs, no surprises.",
      icon: "scale",
    },
    {
      id: "commitment",
      title: "Customer Commitment",
      description:
        "Your satisfaction drives everything we do. We go the extra mile to ensure every client receives exceptional service and support.",
      icon: "handshake",
    },
    {
      id: "improvement",
      title: "Continuous Improvement",
      description:
        "Since 2014, we've continued to grow by embracing new technologies, training, and best practices to provide the most efficient and modern electrical solutions.",
      icon: "bulb",
    },
  ],
};

export function buildAboutMetadata() {
  return {
    title: "About Us | NICEIC Electricians Nottingham Since 2014",
    description:
      "Learn about Urgent Electrical Services — founded in 2014, NICEIC approved, 24/7 emergency electricians serving Nottingham and the East Midlands with safety, reliability, and transparent pricing.",
    keywords: [
      "about Urgent Electrical",
      "electrician Nottingham company",
      "NICEIC approved electricians Nottingham",
      "electrical contractor East Midlands",
      "24 hour electrician Nottingham history",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: ABOUT_CANONICAL,
      siteName: "Urgent Electrical Services",
      title: "About Urgent Electrical Services | Nottingham",
      description: ABOUT_HERO.description,
      images: [
        {
          url: `${SITE}${ABOUT_JOURNEY_IMAGE.fallback}`,
          width: 1200,
          height: 630,
          alt: ABOUT_JOURNEY_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "About Urgent Electrical Nottingham",
      description: ABOUT_HERO.description,
    },
    alternates: { canonical: ABOUT_CANONICAL },
  };
}

export const ABOUT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "About us", item: ABOUT_CANONICAL },
      ],
    },
    {
      "@type": "AboutPage",
      "@id": `${ABOUT_CANONICAL}#webpage`,
      url: ABOUT_CANONICAL,
      name: "About Urgent Electrical Services",
      description: ABOUT_HERO.description,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ElectricalContractor",
      "@id": `${SITE}/#organization`,
      name: "Urgent Electrical Services",
      foundingDate: "2014",
      url: SITE,
      description: ABOUT_HERO.description,
      areaServed: ["Nottingham", "Nottinghamshire", "East Midlands"],
    },
  ],
};
