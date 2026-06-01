import BlogPageClient from "@/components/blog/BlogPageClient";
import { BLOG_LISTING_JSON_LD, buildBlogListingJsonLd } from "@/data/blogs";
import { getBlogCategories, getBlogPostsPage } from "@/lib/blogs/getBlogs";
import "../home1/home1.css";

export { metadata } from "./layout";

export const revalidate = 3600;

export default async function BlogPage() {
  const categories = await getBlogCategories();
  let initialPosts = [];
  let initialMeta = null;

  try {
    const result = await getBlogPostsPage({ page: 1, category: "all", categories });
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
      />
    </>
  );
}
