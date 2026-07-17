import { getSiteUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { documentTitle } from "@/lib/seo/documentTitle";

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/services`;
const servicesTitle = documentTitle("Our Services | Fixed-Price Electricians Nottingham");

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: servicesTitle,
  description:
    "Explore our comprehensive collection of electrical services and resources. Fixed-price EICR, PAT, emergency call-outs, fuse boards, and commercial testing across Nottingham and the East Midlands.",
  keywords: [
    "electrical services Nottingham",
    "fixed price electrician Nottingham",
    "EICR Nottingham price",
    "PAT testing Nottingham",
    "emergency electrician services",
    "fuse box replacement Nottingham",
    "fire alarm testing Nottingham",
    "commercial electrician services",
    "electrical fault finding Nottingham",
    "NICEIC electrician East Midlands",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: PAGE_URL,
    siteName: "Urgent Electrical Services",
    title: servicesTitle.absolute,
    description:
      "Browse fixed-price electrical services, emergency response, testing, and commercial work. Book online with transparent pricing.",
    images: [
      {
        url: OG_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: "Electrical services Nottingham — Urgent Electrical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: servicesTitle.absolute,
    description:
      "Fixed-price EICR, PAT, emergency electricians, and commercial electrical services across Nottingham & the East Midlands.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function ServicesLayout({ children }) {
  return children;
}
