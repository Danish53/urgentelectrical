"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_POST } from "@/data/blogs";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import BlogCard from "./BlogCard";

export default function BlogListing() {
  const [active, setActive] = useState("all");
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    if (active === "all") return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.category === active);
  }, [active]);

  const showFeatured = active === "all";
  const gridPosts = showFeatured ? filtered.filter((p) => p.slug !== FEATURED_POST.slug) : filtered;

  return (
    <section
      className="py-10 sm:py-16 lg:py-20 bg-white overflow-x-clip relative z-[1]"
      aria-labelledby="blog-list-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <SectionHeader
          id="blog-list-heading"
          eyebrow="Latest articles"
          title="Guides, safety tips & industry news"
          description="Stay informed on electrical compliance, domestic upgrades, and commercial testing across Nottinghamshire."
          align="center"
        />

        <div
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10"
          role="tablist"
          aria-label="Filter articles by category"
        >
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat.id)}
                className={`relative shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-colors ${
                  isActive ? "text-white" : "text-[var(--home1-muted)] hover:text-[var(--home1-text)] bg-[var(--home1-surface)]"
                }`}
              >
                {isActive && !reduceMotion && (
                  <motion.span
                    layoutId="blog-tab-pill"
                    className="absolute inset-0 rounded-xl bg-[var(--home1-red)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                {isActive && reduceMotion && (
                  <span className="absolute inset-0 rounded-xl bg-[var(--home1-red)]" aria-hidden="true" />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {gridPosts.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-16">No articles in this category yet.</p>
        ) : (
          <ul
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0"
          >
            {gridPosts.map((post) => (
              <li key={post.slug} className="min-w-0">
                <BlogCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
