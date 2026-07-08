"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import RelatedBlogsSlider from "@/components/blog/RelatedBlogsSlider";
import SectionHeader from "@/components/home1/SectionHeader";
import { SERVICE_DETAIL_CONTAINER } from "@/components/home1/constants";
import { IconArrow, IconCalendar, IconCheck } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { getBlogImageAlt, getBlogImageUrl } from "@/data/blogs";
import AppImage from "@/components/common/AppImage";

const SIDEBAR_TRUST = ["NICEIC approved", "Fixed pricing", "Same-day slots"];

function BlogHeroImage({ post, alt }) {
  const src = getBlogImageUrl(post);

  return (
    <AppImage
      src={src}
      alt={alt}
      width={1200}
      height={520}
      priority
      className="home1-blog-hero-media-img"
      fallback={
        <div
          className="home1-blog-hero-media-fallback"
          style={{ backgroundColor: post.color }}
          role="img"
          aria-label={alt}
        >
          {post.categoryLabel}
        </div>
      }
    />
  );
}

function BlogBreadcrumb({ title }) {
  return (
    <nav className="home1-blog-breadcrumb" aria-label="Breadcrumb">
      <ol
        className="home1-blog-breadcrumb-list"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li
          className="home1-blog-breadcrumb-item"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link href="/" itemProp="item">
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <li
          className="home1-blog-breadcrumb-item"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <Link href="/blog" itemProp="item">
            <span itemProp="name">Blog</span>
          </Link>
          <meta itemProp="position" content="2" />
        </li>
        <li
          className="home1-blog-breadcrumb-item home1-blog-breadcrumb-item--current"
          itemProp="itemListElement"
          itemScope
          itemType="https://schema.org/ListItem"
        >
          <span itemProp="name">{title}</span>
          <meta itemProp="position" content="3" />
        </li>
      </ol>
    </nav>
  );
}

function BlogTags({ post }) {
  if (!post.keywords?.length) return null;

  return (
    <div className="home1-blog-tags" aria-label="Article topics">
      <p className="home1-blog-tags-label">Topics</p>
      <ul className="home1-blog-tags-list">
        {post.keywords.map((tag) => (
          <li key={tag}>
            <span className="home1-blog-tag">{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlogSidebar({ post }) {
  return (
    <aside className="home1-blog-sidebar" aria-label="Article actions">
      <div className="home1-blog-sidebar-card">
        <p className="home1-blog-sidebar-label">Keep reading</p>
        <Link href="/blog" className="home1-blog-sidebar-link">
          <span>All articles</span>
          <IconArrow className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
        <Link href="/services" className="home1-blog-sidebar-link home1-blog-sidebar-link--primary">
          <span>Our services</span>
          <IconArrow className="w-4 h-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>

      <div className="home1-blog-sidebar-card home1-blog-sidebar-card--muted">
        <p className="home1-blog-sidebar-label">Need an electrician?</p>
        <p className="home1-blog-sidebar-text">
          Book online or call for NICEIC approved work across Nottingham &amp; the East Midlands.
        </p>
        <Link href="/services" className="home1-btn-primary home1-blog-sidebar-cta w-full justify-center">
          <IconCalendar className="w-4 h-4" aria-hidden="true" />
          Book online
        </Link>
        <a href={FOOTER_PHONE_TEL} className="home1-btn-outline home1-blog-sidebar-cta w-full justify-center">
          Call {FOOTER_PHONE}
        </a>
      </div>

      <ul className="home1-blog-sidebar-trust">
        {SIDEBAR_TRUST.map((item) => (
          <li key={item}>
            <IconCheck className="w-3.5 h-3.5 shrink-0 text-[var(--home1-red)]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="home1-blog-sidebar-meta">
        <p className="home1-blog-sidebar-label">Published</p>
        <time dateTime={post.publishedISO}>{post.publishedDisplay}</time>
        <p className="home1-blog-sidebar-meta-sub">
          {post.readMinutes} min read · {post.categoryLabel}
        </p>
      </div>
    </aside>
  );
}

export default function BlogDetailClient({ post, sections, related }) {
  const imageAlt = getBlogImageAlt(post);
  const heroLead =
    (post.excerpt && String(post.excerpt).trim()) ||
    (post.metaDescription && String(post.metaDescription).trim()) ||
    "";
  const authorInitials = post.author
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="home1-page home1-blog-detail-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <article
          className="home1-blog-article-wrap"
          itemScope
          itemType="https://schema.org/BlogPosting"
          lang="en-GB"
        >
          <link itemProp="mainEntityOfPage" href={post.canonicalUrl} />
          <link itemProp="image" href={getBlogImageUrl(post)} />
          <meta itemProp="description" content={post.metaDescription} />
          <meta itemProp="datePublished" content={post.publishedISO} />
          <meta itemProp="dateModified" content={post.publishedISO} />
          {post.keywords?.length > 0 && (
            <meta itemProp="keywords" content={post.keywords.join(", ")} />
          )}

          <header
            className="home1-blog-hero"
            style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1rem)" }}
          >
            <div className={`${SERVICE_DETAIL_CONTAINER} home1-blog-hero-inner`}>
              {/* <BlogBreadcrumb title={post.title} /> */}

              <div className="home1-blog-hero-card">
                <div className="home1-blog-hero-card-head">
                  <div className="home1-blog-hero-meta">
                    <span className="home1-blog-category-pill" itemProp="articleSection">
                      {post.categoryLabel}
                    </span>
                    <time
                      className="home1-blog-hero-date"
                      dateTime={post.publishedISO}
                      itemProp="datePublished"
                    >
                      {post.publishedDisplay}
                    </time>
                    <span className="home1-blog-hero-read">{post.readMinutes} min read</span>
                  </div>

                  <h1 className="home1-blog-hero-title" itemProp="headline">
                    {post.title}
                  </h1>
                  {heroLead ? (
                    <p className="home1-blog-hero-lead" itemProp="description">
                      {heroLead}
                    </p>
                  ) : null}
                </div>

                <figure className="home1-blog-hero-media">
                  <BlogHeroImage post={post} alt={imageAlt} />
                  <figcaption className="sr-only">{imageAlt}</figcaption>
                </figure>
              </div>
            </div>
          </header>

          <div className="home1-blog-body">
            <div className={`${SERVICE_DETAIL_CONTAINER} home1-blog-layout`}>
              <div className="home1-blog-main min-w-0">
                <div className="home1-blog-article-card">
                  <BlogTags post={post} />

                  <div className="home1-blog-prose" itemProp="articleBody">
                    {post.htmlContent ? (
                      <div
                        className="home1-blog-prose-html"
                        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                      />
                    ) : (
                      sections.map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    )}
                  </div>

                  <footer className="home1-blog-article-footer">
                    <div className="home1-blog-author">
                      <span className="home1-blog-author-avatar" aria-hidden="true">
                        {authorInitials}
                      </span>
                      <div>
                        <p className="home1-blog-author-label">Written by</p>
                        <p className="home1-blog-author-name" itemProp="author">
                          {post.author}
                        </p>
                        <p className="home1-blog-author-role">Urgent Electrical · Nottingham</p>
                      </div>
                    </div>
                    <Link href="/blog" className="home1-btn-outline text-sm py-3 px-5 w-full sm:w-fit justify-center shrink-0">
                      More articles
                      <IconArrow className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  </footer>
                </div>
              </div>

              <BlogSidebar post={post} />
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="home1-blog-related" aria-labelledby="blog-related-heading">
            <div className={SERVICE_DETAIL_CONTAINER}>
              <SectionHeader
                id="blog-related-heading"
                eyebrow="Continue reading"
                title="Related articles"
                description="More guides and tips from our Nottingham electricians."
                align="left"
                compact
              />
              <RelatedBlogsSlider posts={related} />
            </div>
          </section>
        )}

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
