import BlogPageClient from "@/components/blog/BlogPageClient";
import { BLOG_LISTING_JSON_LD, buildBlogListingJsonLd, buildBlogListingMetadata } from "@/data/blogs";
import { blogListingHref, parseBlogListingParams } from "@/lib/blogs/blogListingUrl";
import { getBlogCategories, getBlogPostsPage } from "@/lib/blogs/getBlogs";
import { getSiteUrl } from "@/lib/siteUrl";
import "../home1/home1.css";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const categories = await getBlogCategories();
  const { page, category } = parseBlogListingParams(params, categories);
  const canonical = `${getSiteUrl()}${blogListingHref({ page, category })}`;
  const meta = buildBlogListingMetadata();

  return {
    metadataBase: new URL(getSiteUrl()),
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      ...meta.openGraph,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.openGraph?.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical },
  };
}

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const categories = await getBlogCategories();
  const { page, category } = parseBlogListingParams(params, categories);
  let initialPosts = [];
  let initialMeta = null;

  try {
    const result = await getBlogPostsPage({ page, category, categories });
    initialPosts = result.posts;
    initialMeta = result.meta;
  } catch {
    initialPosts = [];
  }

  const jsonLd = initialPosts.length
    ? buildBlogListingJsonLd(initialPosts)
    : BLOG_LISTING_JSON_LD;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogPageClient
        categories={categories}
        initialPosts={initialPosts}
        initialMeta={initialMeta}
        initialPage={page}
        initialCategory={category}
      />
    </>
  );
}
