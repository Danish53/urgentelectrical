import { slugify } from "@/lib/slugs";

const SITE = "https://www.urgentelectrical.services";

export const BLOG_CATEGORIES = [
  { id: "all", label: "All articles" },
  { id: "safety", label: "Safety" },
  { id: "domestic", label: "Domestic" },
  { id: "commercial", label: "Commercial" },
  { id: "guides", label: "Guides" },
  { id: "news", label: "News" },
];

const RAW_POSTS = [
  {
    title: "When to Call an Emergency Electrician in Nottingham",
    category: "safety",
    date: "2026-04-12",
    readMinutes: 6,
    image: "/featured/emergency-24.jpg",
    color: "#DC2626",
    featured: true,
    excerpt:
      "Power cuts, burning smells, or sparking sockets? Learn when to call a 24/7 emergency electrician and what to do before we arrive.",
    author: "Urgent Electrical Team",
    metaDescription:
      "Guide to emergency electrical situations in Nottingham — when to call a 24/7 electrician, safety steps, and typical response times.",
    keywords: ["emergency electrician Nottingham", "24 hour electrician", "electrical emergency guide"],
  },
  {
    title: "EICR Explained: What Nottingham Landlords Must Know",
    category: "guides",
    date: "2026-03-28",
    readMinutes: 8,
    image: "/featured/eicr.jpg",
    color: "#2563EB",
    excerpt:
      "Electrical Installation Condition Reports protect tenants and landlords. We break down codes, timelines, and fixed-price testing in Nottingham.",
    author: "Urgent Electrical Team",
    metaDescription:
      "Landlord EICR guide for Nottingham — legal requirements, C1/C2/C3 codes, renewal periods, and how to book fixed-price testing.",
    keywords: ["EICR Nottingham", "landlord electrical certificate", "rental property EICR"],
  },
  {
    title: "PAT Testing for Offices & Shops: A Practical Checklist",
    category: "commercial",
    date: "2026-03-15",
    readMinutes: 7,
    image: "/featured/pat.jpg",
    color: "#7C3AED",
    excerpt:
      "Portable Appliance Testing keeps workplaces compliant. Our checklist covers frequency, records, and what happens during a PAT visit.",
    author: "Urgent Electrical Team",
    metaDescription:
      "PAT testing checklist for Nottingham businesses — how often to test, what is inspected, and certificate requirements.",
    keywords: ["PAT testing Nottingham", "office PAT test", "portable appliance testing guide"],
  },
  {
    title: "5 Signs Your Fuse Box Needs Replacing",
    category: "domestic",
    date: "2026-02-20",
    readMinutes: 5,
    image: "/featured/fault-investigation.jpg",
    color: "#EA580C",
    excerpt:
      "Old consumer units without RCD protection put homes at risk. Here are five warning signs it's time for a modern fuse box upgrade.",
    author: "Urgent Electrical Team",
    metaDescription:
      "Fuse box replacement signs for Nottingham homes — plastic boards, tripping RCDs, and when to upgrade your consumer unit.",
    keywords: ["fuse box replacement Nottingham", "consumer unit upgrade", "old fuse board"],
  },
  {
    title: "Fire Alarm Testing: Commercial Compliance in Nottingham",
    category: "commercial",
    date: "2026-02-08",
    readMinutes: 6,
    image: "/featured/fire-alarm.jpg",
    color: "#D3231F",
    excerpt:
      "Weekly tests and professional servicing keep fire detection systems reliable. What the law expects and how we document your logbook.",
    author: "Urgent Electrical Team",
    metaDescription:
      "Fire alarm testing requirements for Nottingham commercial premises — servicing intervals, logbooks, and certification.",
    keywords: ["fire alarm testing Nottingham", "commercial fire alarm inspection"],
  },
  {
    title: "Why Your RCD Keeps Tripping — And How We Diagnose It",
    category: "domestic",
    date: "2026-01-22",
    readMinutes: 7,
    image: "/featured/emergency-lighting.jpg",
    color: "#16A34A",
    excerpt:
      "A tripping RCD is protecting you — but the cause matters. From faulty appliances to damaged cables, here's our fault-finding process.",
    author: "Urgent Electrical Team",
    metaDescription:
      "RCD keeps tripping? Nottingham electricians explain common causes, safe checks, and fixed-price fault investigation.",
    keywords: ["RCD keeps tripping", "electrical fault finding Nottingham"],
  },
  {
    title: "EV Charger Installation: Electrical Requirements in the East Midlands",
    category: "guides",
    date: "2026-01-10",
    readMinutes: 9,
    image: "/featured/eicr.jpg",
    color: "#1E40AF",
    excerpt:
      "Home and workplace EV chargers need the right supply capacity and protection. Planning, grants, and what a qualified installer checks first.",
    author: "Urgent Electrical Team",
    metaDescription:
      "EV charger installation guide for Nottingham and the East Midlands — supply checks, OZEV grants, and NICEIC installation standards.",
    keywords: ["EV charger installation Nottingham", "home EV charge point electrician"],
  },
  {
    title: "Emergency Lighting Tests: Staying Compliant in 2026",
    category: "safety",
    date: "2025-12-18",
    readMinutes: 6,
    image: "/featured/emergency-lighting.jpg",
    color: "#0D9488",
    excerpt:
      "Monthly flick tests and annual duration tests aren't optional for many buildings. How to maintain records and fix failed luminaires.",
    author: "Urgent Electrical Team",
    metaDescription:
      "Emergency lighting testing guide 2026 — function tests, duration tests, logbooks, and Nottingham compliance support.",
    keywords: ["emergency lighting testing Nottingham", "emergency lighting certificate"],
  },
];

export const BLOG_POSTS = RAW_POSTS.map((post) => {
  const slug = slugify(post.title);
  return {
    ...post,
    slug,
    id: slug,
    href: `/blog/${slug}`,
    canonicalUrl: `${SITE}/blog/${slug}`,
    categoryLabel: BLOG_CATEGORIES.find((c) => c.id === post.category)?.label ?? "Guides",
    publishedISO: post.date,
    publishedDisplay: new Date(post.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
});

export const FEATURED_POST = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];

export function getAllBlogSlugs() {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getBlogBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export function getRelatedPosts(post, limit = 3) {
  const same = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category);
  const other = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...same, ...other].slice(0, limit);
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
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: [...post.keywords, "Urgent Electrical blog", "Nottingham electrician"],
    openGraph: {
      type: "article",
      locale: "en_GB",
      url: post.canonicalUrl,
      siteName: "Urgent Electrical Services",
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.publishedISO,
      images: [{ url: post.image, alt: post.title }],
    },
    alternates: { canonical: post.canonicalUrl },
  };
}

export const BLOG_LISTING_JSON_LD = {
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
      blogPost: BLOG_POSTS.map((p) => ({
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

export function buildBlogPostJsonLd(post, sections) {
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
        headline: post.title,
        description: post.metaDescription,
        image: `${SITE}${post.image}`,
        datePublished: post.publishedISO,
        author: { "@type": "Organization", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "Urgent Electrical Services",
          url: SITE,
        },
        mainEntityOfPage: post.canonicalUrl,
        articleBody: sections.join(" "),
      },
    ],
  };
}
