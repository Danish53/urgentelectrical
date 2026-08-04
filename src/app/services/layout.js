import { getSiteUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";

const SITE_URL = getSiteUrl();
const PAGE_URL = `${SITE_URL}/services`;
const TITLE = "Our Services | Fixed-Price Electricians Nottingham";
const DESCRIPTION =
  "Explore our comprehensive collection of electrical services and resources. Fixed-price EICR, PAT, emergency call-outs, fuse boards, and commercial testing across Nottingham and the East Midlands.";

export const metadata = buildSeoMetadata(TITLE, DESCRIPTION, {
  metadataBase: new URL(SITE_URL),
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
});

export default function ServicesLayout({ children }) {
  return children;
}
