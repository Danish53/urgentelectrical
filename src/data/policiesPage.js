import { getSiteUrl, getOgImageUrl, OG_IMAGE_PATH } from "@/lib/siteUrl";
import { getPolicyImageUrl } from "@/services/policyApiService";

export function buildPoliciesListingMetadata() {
  const site = getSiteUrl();
  const canonical = `${site}/policies`;
  const title = "Policies | Privacy, Cookies & Terms";
  const description =
    "Read Urgent Electrical privacy policy, cookie policy, terms of service, and company legal information for customers in Nottingham and the East Midlands.";

  return {
    title,
    description,
    keywords: [
      "Urgent Electrical privacy policy",
      "cookie policy electrician",
      "terms of service Nottingham",
      "electrical company policies UK",
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
          alt: "Urgent Electrical Services policies",
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
 * @param {import("@/services/policyApiService").ApiPolicyDetail} policy
 */
export function buildPolicyDetailMetadata(policy) {
  const site = getSiteUrl();
  const canonical = `${site}/policies/${policy.slug}`;
  const title = policy.seo_title?.trim() || policy.title;
  const description =
    policy.seo_description?.trim() ||
    `Read the full ${policy.title} for Urgent Electrical Services — NICEIC approved electricians in Nottingham and the East Midlands.`;
  const imageUrl = getPolicyImageUrl(policy) || getOgImageUrl();

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
        ? [{ url: imageUrl, width: 1200, height: 630, alt: policy.title }]
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
 * @param {import("@/services/policyApiService").ApiPolicyDetail} policy
 */
export function buildPolicyDetailJsonLd(policy) {
  const site = getSiteUrl();
  const canonical = `${site}/policies/${policy.slug}`;
  const description =
    policy.seo_description?.trim() ||
    `Company policy: ${policy.title} — Urgent Electrical Services.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "Policies", item: `${site}/policies` },
          { "@type": "ListItem", position: 3, name: policy.title, item: canonical },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: policy.seo_title?.trim() || policy.title,
        description,
        isPartOf: { "@id": `${site}/#website` },
        publisher: { "@id": `${site}/#organization` },
      },
    ],
  };
}
