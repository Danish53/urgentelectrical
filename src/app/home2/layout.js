const SITE_URL = "https://www.urgentelectrical.services";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Urgent Electrical Nottingham | Electricians Across the East Midlands",
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
    url: `${SITE_URL}/home2`,
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
  alternates: {
    canonical: `${SITE_URL}/home2`,
  },
};

export default function Home2Layout({ children }) {
  return children;
}
