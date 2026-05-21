import { notFound } from "next/navigation";
import BlogDetailClient from "@/components/blog/BlogDetailClient";
import { BLOG_ARTICLE_BODY } from "@/data/blogArticles";
import {
  buildBlogPostJsonLd,
  buildBlogPostMetadata,
  getAllBlogSlugs,
  getBlogBySlug,
  getRelatedPosts,
} from "@/data/blogs";
import "../../home1/home1.css";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) return { title: "Article not found" };
  return buildBlogPostMetadata(post);
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  if (!post) notFound();

  const sections = BLOG_ARTICLE_BODY[slug] ?? [post.excerpt];
  const related = getRelatedPosts(post);
  const jsonLd = buildBlogPostJsonLd(post, sections);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogDetailClient post={post} sections={sections} related={related} />
    </>
  );
}
