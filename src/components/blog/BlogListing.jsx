"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BLOG_CATEGORIES, BLOG_POSTS, FEATURED_POST } from "@/data/blogs";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import BlogCard from "./BlogCard";
import { EASE_SMOOTH } from "@/lib/motion";

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
    <section className={`${SECTION_PY} bg-white overflow-x-clip`} aria-labelledby="blog-list-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="blog-list-heading"
          eyebrow="Latest articles"
          title="Guides, safety tips & industry news"
          description="Stay informed on electrical compliance, domestic upgrades, and commercial testing across Nottinghamshire."
          align="center"
        />

        <div
          className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
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
                className={`relative px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
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

        <AnimatePresence mode="popLayout">
          <motion.ul
            key={active}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 list-none p-0 m-0"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            {gridPosts.map((post, i) => (
              <motion.li
                key={post.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.5, ease: EASE_SMOOTH }}
              >
                <BlogCard post={post} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {gridPosts.length === 0 && (
          <p className="text-center text-[var(--home1-muted)] py-16">No articles in this category yet.</p>
        )}
      </div>
    </section>
  );
}
