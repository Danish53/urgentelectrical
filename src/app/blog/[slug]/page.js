import { notFound } from "next/navigation";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import {
  buildBlogPostJsonLd,
  buildBlogPostMetadata,
} from "@/data/blogs";
import { getAllBlogSlugs, getBlogBySlug, getRelatedBlogPosts } from "@/lib/blogs/getBlogs";
import "../../home1/home1.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const post = await getBlogBySlug(slug);
    if (!post) return { title: "Article not found" };
    return buildBlogPostMetadata(post);
  } catch {
    return { title: "Article not found" };
  }
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;

  let post;
  try {
    post = await getBlogBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) notFound();

  const related = await getRelatedBlogPosts(post);
  const sections = post.htmlContent ? [] : [post.excerpt];
  const jsonLd = buildBlogPostJsonLd(post, sections, post.htmlContent);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogDetailClient post={post} sections={sections} related={related} />
    </>
  );
}
