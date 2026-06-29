import {
  buildBlogCategoriesFromApi,
  buildBlogPostFromDetail,
  buildBlogPostFromListItem,
} from "@/lib/blogs/buildBlogPost";
import {
  fetchAllBlogs,
  fetchBlogBySlug,
  fetchBlogCategories,
  fetchBlogsPage,
} from "@/services/blogApiService";
import { cache } from "react";

/**
 * @returns {Promise<Array<{ id: string, slug: string, label: string }>>}
 */
export const getBlogCategories = cache(async function getBlogCategories() {
  try {
    const api = await fetchBlogCategories();
    return buildBlogCategoriesFromApi(api);
  } catch {
    return [{ id: "all", slug: "all", label: "All articles" }];
  }
});

/**
 * @param {import("@/services/blogApiService").ApiBlogListItem[]} blogs
 * @param {string} categorySlug
 * @param {Array<{ id: string, slug: string, label: string }>} categories
 */
function mapListWithCategory(blogs, categorySlug, categories) {
  const categoryLabel =
    categorySlug === "all"
      ? "Article"
      : categories.find((c) => c.slug === categorySlug)?.label ?? "Article";

  return blogs.map((item, index) =>
    buildBlogPostFromListItem(item, {
      categorySlug: categorySlug === "all" ? "all" : categorySlug,
      categoryLabel,
      featured: categorySlug === "all" && index === 0,
    })
  );
}

/**
 * @param {{ page?: number, category?: string, categories?: Array<{ slug: string, label: string }> }} [options]
 */
export async function getBlogPostsPage(options = {}) {
  const page = options.page ?? 1;
  const category = options.category ?? "all";
  const categories = options.categories ?? (await getBlogCategories());

  const { blogs, meta, links } = await fetchBlogsPage({ page, category });
  const posts = mapListWithCategory(blogs, category, categories);

  return { posts, meta, links, categories };
}

/** All posts (all pages) for sitemap and static generation. */
export async function getAllBlogPosts() {
  const categories = await getBlogCategories();

  try {
    const { blogs } = await fetchAllBlogs();
    return mapListWithCategory(blogs, "all", categories);
  } catch {
    return [];
  }
}

/**
 * @param {string} slug
 */
export const getBlogBySlug = cache(async function getBlogBySlug(slug) {
  const data = await fetchBlogBySlug(slug);
  return buildBlogPostFromDetail(data);
});

/**
 * @param {{ slug: string }} post
 * @param {Awaited<ReturnType<typeof getAllBlogPosts>>} [allPosts]
 * @param {number} [limit]
 */
export async function getRelatedBlogPosts(post, allPosts, limit = 3) {
  const pool = allPosts ?? (await getAllBlogPosts());
  return pool.filter((p) => p.slug !== post.slug).slice(0, limit);
}

export async function getAllBlogSlugs() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => p.slug);
}
