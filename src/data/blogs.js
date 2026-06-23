import { getSiteUrl } from "@/lib/siteUrl";

const SITE = getSiteUrl();

export function buildBlogListingJsonLd(posts) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        ],
      },
      {
        "@type": "Blog",
        name: "Urgent Electrical Blog",
        description: "Electrical guides and news from Nottingham and the East Midlands.",
        url: `${SITE}/blog`,
        publisher: {
          "@type": "Organization",
          name: "Urgent Electrical Services",
          url: SITE,
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          url: p.canonicalUrl,
          datePublished: p.publishedISO,
          author: { "@type": "Organization", name: p.author },
        })),
      },
    ],
  };
}

/** 16:9 hero — used for Next/Image and schema.org */
export const BLOG_HERO_IMAGE_WIDTH = 1200;
export const BLOG_HERO_IMAGE_HEIGHT = 675;

export function getBlogImageAlt(post) {
  return `${post.title} — ${post.categoryLabel} electrical guide, Nottingham`;
}

export function getBlogImageUrl(post) {
  const image = post?.image;
  if (!image || typeof image !== "string") return `${SITE}/og-image.jpg`;
  const trimmed = image.trim();
  if (!trimmed || trimmed === SITE || trimmed === `${SITE}/`) return `${SITE}/og-image.jpg`;
  return trimmed.startsWith("http") ? trimmed : `${SITE}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
}

export function buildBlogListingMetadata() {
  return {
    title: "Blog & Electrical News | Nottingham Electricians",
    description:
      "Expert electrical guides, safety tips, and industry news from NICEIC approved electricians in Nottingham and the East Midlands.",
    keywords: [
      "electrical blog Nottingham",
      "electrician tips",
      "EICR landlord guide",
      "PAT testing advice",
      "emergency electrician advice",
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: `${SITE}/blog`,
      siteName: "Urgent Electrical Services",
      title: "Blog & News | Urgent Electrical Nottingham",
      description:
        "Read guides on EICR, PAT testing, emergency electrics, fuse boards, and commercial compliance from local experts.",
      images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Urgent Electrical blog" }],
    },
    alternates: { canonical: `${SITE}/blog` },
  };
}

export function buildBlogPostMetadata(post) {
  const imageUrl = getBlogImageUrl(post);
  const imageAlt = getBlogImageAlt(post);

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: [...post.keywords, "Urgent Electrical blog", "Nottingham electrician"],
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      locale: "en_GB",
      url: post.canonicalUrl,
      siteName: "Urgent Electrical Services",
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.publishedISO,
      section: post.categoryLabel,
      tags: post.keywords,
      images: [
        {
          url: imageUrl,
          width: BLOG_HERO_IMAGE_WIDTH,
          height: BLOG_HERO_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [imageUrl],
    },
    alternates: { canonical: post.canonicalUrl },
  };
}

export const BLOG_LISTING_JSON_LD = buildBlogListingJsonLd([]);

export function buildBlogPostJsonLd(post, sections = [], htmlContent = null) {
  const plain = htmlContent
    ? htmlContent.replace(/<[^>]+>/g, " ")
    : sections.join(" ");
  const wordCount = plain.split(/\s+/).filter(Boolean).length;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: post.canonicalUrl },
        ],
      },
      {
        "@type": "BlogPosting",
        "@id": `${post.canonicalUrl}#article`,
        headline: post.title,
        description: post.metaDescription,
        abstract: post.excerpt,
        image: {
          "@type": "ImageObject",
          url: getBlogImageUrl(post),
          width: BLOG_HERO_IMAGE_WIDTH,
          height: BLOG_HERO_IMAGE_HEIGHT,
          caption: getBlogImageAlt(post),
        },
        datePublished: post.publishedISO,
        dateModified: post.publishedISO,
        inLanguage: "en-GB",
        wordCount,
        articleSection: post.categoryLabel,
        keywords: post.keywords.join(", "),
        url: post.canonicalUrl,
        author: { "@type": "Organization", name: post.author, url: SITE },
        publisher: {
          "@type": "Organization",
          name: "Urgent Electrical Services",
          url: SITE,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": post.canonicalUrl },
        isPartOf: { "@type": "Blog", name: "Urgent Electrical Blog", url: `${SITE}/blog` },
        articleBody: plain,
      },
    ],
  };
}
