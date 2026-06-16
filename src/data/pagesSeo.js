import { getSiteUrl, getOgImageUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { getPageImageUrl } from "@/services/pagesApiService";

export function buildPagesListingMetadata() {
  const site = getSiteUrl();
  const canonical = `${site}/pages`;
  const title = "Other Electrical Services & Guides";
  const description =
    "Browse specialist electrical guides and informative service pages from Urgent Electrical — expert help across Nottingham and the East Midlands.";

  return {
    title,
    description,
    keywords: [
      "electrical guides Nottingham",
      "electrician information East Midlands",
      "specialist electrical services",
      "Urgent Electrical guides",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: canonical,
      siteName: "Urgent Electrical Services",
      title,
      description,
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 1200,
          height: 630,
          alt: "Urgent Electrical service guides",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [getOgImageUrl()],
    },
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

/**
 * @param {import("@/services/pagesApiService").ApiInfoPageDetail} page
 */
export function buildPageDetailMetadata(page) {
  const site = getSiteUrl();
  const slug = page.slug;
  const canonical = `${site}/pages/${slug}`;
  const title = page.seo_title?.trim() || `${page.title} | Urgent Electrical`;
  const description =
    page.seo_description?.trim() ||
    page.description?.trim() ||
    `Learn about ${page.title} from NICEIC approved electricians at Urgent Electrical in Nottingham and the East Midlands.`;
  const imageUrl = getPageImageUrl(page) || getOgImageUrl();

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: "en_GB",
      url: canonical,
      siteName: "Urgent Electrical Services",
      title,
      description,
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: page.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [getOgImageUrl()],
    },
    alternates: { canonical },
    robots: { index: true, follow: true },
  };
}

/**
 * @param {import("@/services/pagesApiService").ApiInfoPageDetail} page
 */
export function buildPageDetailJsonLd(page) {
  const site = getSiteUrl();
  const canonical = `${site}/pages/${page.slug}`;
  const description =
    page.seo_description?.trim() ||
    page.description?.trim() ||
    `Information about ${page.title} from Urgent Electrical Services.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "Other services", item: `${site}/pages` },
          { "@type": "ListItem", position: 3, name: page.title, item: canonical },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: page.seo_title?.trim() || page.title,
        description,
        isPartOf: { "@id": `${site}/#website` },
        publisher: { "@id": `${site}/#organization` },
      },
    ],
  };
}
