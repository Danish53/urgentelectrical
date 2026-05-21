import { BLOG_POSTS } from "@/data/blogs";
import { BOOKABLE_SERVICES } from "@/data/servicesPage";

const SITE_URL = "https://www.urgentelectrical.services";

export default function sitemap() {
  const servicePages = BOOKABLE_SERVICES.map((s) => ({
    url: s.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const blogPages = BLOG_POSTS.map((p) => ({
    url: p.canonicalUrl,
    lastModified: new Date(p.publishedISO),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...servicePages,
    ...blogPages,
  ];
}
