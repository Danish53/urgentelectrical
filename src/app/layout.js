// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "Urgent Electrical",
//   description: "Urgent Electrical — Next.js site",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html
//       lang="en"
//       className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col">{children}</body>
//     </html>
//   );
// }



import { Plus_Jakarta_Sans, Anton } from "next/font/google";
import Script from "next/script";
import AppProviders from "@/components/providers/AppProviders";
import { getOgImageUrl, getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

/** Legacy /home1 emergency headline only — single weight, no preload on every page */
const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Urgent Electrical Nottingham | Electricians Across the East Midlands",
    template: "%s | Urgent Electrical Services",
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
    url: getSiteUrl(),
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
    images: [getOgImageUrl()],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: getSiteUrl(),
  },
};

/** Fresh CMS/API HTML on each request; SEO metadata and JSON-LD still server-rendered. */
export const dynamic = "force-dynamic";

const GOOGLE_ADS_ID = "AW-975900232";

export default function RootLayout({ children }) {
  const site = getSiteUrl();

  return (
    <html lang="en-GB" data-scroll-behavior="smooth">
      <head>
        {/* Structured data – LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${site}/#website`,
                  url: site,
                  name: "Urgent Electrical Services",
                  publisher: { "@id": `${site}/#organization` },
                },
                {
                  "@type": "ElectricalContractor",
                  "@id": `${site}/#organization`,
                  name: "Urgent Electrical Services",
                  image: `${site}/assets/urgent_electrical_logo.svg`,
                  url: site,
                  telephone: "01157780622",
                  priceRange: "££",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "17 Regent Street",
                    addressLocality: "Nottingham",
                    postalCode: "NG1 5BQ",
                    addressRegion: "Nottinghamshire",
                    addressCountry: "GB",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: 52.9548,
                    longitude: -1.1581,
                  },
                  openingHoursSpecification: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ],
                    opens: "00:00",
                    closes: "23:59",
                  },
                  areaServed: [
                    "Nottingham",
                    "Nottinghamshire",
                    "Derby",
                    "Leicester",
                    "Loughborough",
                    "East Midlands",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${anton.variable} font-sans antialiased overflow-x-clip w-full min-w-0`}
        suppressHydrationWarning
      >
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
