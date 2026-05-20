import { BOOKABLE_SERVICES } from "@/data/servicesPage";

const SITE_URL = "https://www.urgentelectrical.services";

export default function sitemap() {
  const servicePages = BOOKABLE_SERVICES.map((s) => ({
    url: s.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
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
    ...servicePages,
  ];
}
