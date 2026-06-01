import { ALL_LOCATIONS } from "@/data/locationDetails";
import { getAllBlogPosts } from "@/lib/blogs/getBlogs";
import { getBookableServices } from "@/lib/services/getServices";

const SITE_URL = "https://www.urgentelectrical.services";

export default async function sitemap() {
  const bookable = await getBookableServices();

  const servicePages = bookable.map((s) => ({
    url: s.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const locationPages = ALL_LOCATIONS.map((loc) => ({
    url: loc.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPosts = await getAllBlogPosts();
  const blogPages = blogPosts.map((p) => ({
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
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${SITE_URL}/checkout`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...servicePages,
    ...locationPages,
    ...blogPages,
  ];
}
