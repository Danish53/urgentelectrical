import { getSiteUrl } from "@/lib/siteUrl";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account/", "/login/", "/checkout", "/home1", "/home2"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
