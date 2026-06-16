import { ALL_LOCATIONS } from "@/data/locationDetails";
import { getAllBlogPosts } from "@/lib/blogs/getBlogs";
import { getSiteUrl } from "@/lib/siteUrl";
import { getBookableServices } from "@/lib/services/getServices";
import { fetchLocationsPage } from "@/services/locationsApiService";
import { fetchAllOtherServices, fetchPagesList } from "@/services/pagesApiService";
import { fetchPolicies } from "@/services/policyApiService";

async function getLocationSitemapEntries(site) {
  try {
    const entries = [];
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage) {
      const parsed = await fetchLocationsPage(page);
      parsed.locations.forEach((loc) => {
        entries.push({
          url: `${site}/locations/${loc.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      });
      lastPage = parsed.pagination?.lastPage ?? page;
      page += 1;
    }

    if (entries.length) return entries;
  } catch {
    // Fall back to static list when API is unavailable at build time.
  }

  return ALL_LOCATIONS.map((loc) => ({
    url: loc.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
}

async function getPolicySitemapEntries(site) {
  try {
    const policies = await fetchPolicies();
    return policies.map((policy) => ({
      url: `${site}/policies/${policy.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

async function getPagesSitemapEntries(site) {
  try {
    const { pages } = await fetchAllOtherServices();
    if (pages.length) {
      return pages.map((page) => ({
        url: `${site}/pages/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }
  } catch {
    /* fall through */
  }

  try {
    const pages = await fetchPagesList();
    return pages.map((page) => ({
      url: `${site}/pages/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const site = getSiteUrl();
  const bookable = await getBookableServices();

  const servicePages = bookable.map((s) => ({
    url: s.canonicalUrl,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const locationPages = await getLocationSitemapEntries(site);
  const policyPages = await getPolicySitemapEntries(site);
  const infoPages = await getPagesSitemapEntries(site);

  const blogPosts = await getAllBlogPosts();
  const blogPages = blogPosts.map((p) => ({
    url: p.canonicalUrl,
    lastModified: new Date(p.publishedISO),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    {
      url: site,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${site}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${site}/locations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${site}/pages`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${site}/policies`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${site}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    {
      url: `${site}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.88,
    },
    ...servicePages,
    ...locationPages,
    ...infoPages,
    ...policyPages,
    ...blogPages,
  ];
}
