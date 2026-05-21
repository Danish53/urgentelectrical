"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import BlogCard from "@/components/blog/BlogCard";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import { IconArrow } from "@/components/home1/icons";
import { HERO_CONTAINER, HERO_ITEM, HERO_TITLE, EASE_SMOOTH } from "@/lib/motion";

function ArticleImage({ post, priority }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-white font-bold" style={{ backgroundColor: post.color }}>
        {post.categoryLabel}
      </div>
    );
  }
  return (
    <img
      src={post.image}
      alt=""
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

export default function BlogDetailClient({ post, sections, related }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        <section className="relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-10 sm:pb-14">
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${CONTAINER} relative z-10 max-w-4xl`}>
            <motion.div
              variants={reduceMotion ? undefined : HERO_CONTAINER}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
            >
              <motion.nav
                variants={reduceMotion ? undefined : HERO_ITEM}
                aria-label="Breadcrumb"
                className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-white/50 mb-6"
              >
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/85 line-clamp-1">{post.title}</span>
              </motion.nav>

              <motion.div variants={reduceMotion ? undefined : HERO_ITEM} className="flex flex-wrap items-center gap-3 mb-4">
                <span className="home1-eyebrow home1-eyebrow--light">{post.categoryLabel}</span>
                <span className="text-white/50 text-[12px] font-semibold">
                  {post.publishedDisplay} · {post.readMinutes} min read
                </span>
              </motion.div>

              <motion.h1
                variants={reduceMotion ? undefined : HERO_TITLE}
                className="text-white text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.1] tracking-tight mb-6"
              >
                {post.title}
              </motion.h1>

              <motion.p variants={reduceMotion ? undefined : HERO_ITEM} className="text-white/80 text-[16px] leading-relaxed mb-8">
                {post.excerpt}
              </motion.p>

              <motion.div variants={reduceMotion ? undefined : HERO_ITEM} className="rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                <ArticleImage post={post} priority />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <article className={`${SECTION_PY} bg-white`}>
          <div className={`${CONTAINER} max-w-3xl`}>
            <div className="prose-blog space-y-5 text-[16px] leading-[1.75] text-[var(--home1-muted)]">
              {sections.map((para, i) => (
                <motion.p
                  key={i}
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.05, duration: 0.6, ease: EASE_SMOOTH }}
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--home1-border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-[14px] text-[var(--home1-muted)]">
                Written by <strong className="text-[var(--home1-text)]">{post.author}</strong>
              </p>
              <Link href="/services" className="home1-btn-primary text-sm py-3 px-5 w-fit">
                View our services
                <IconArrow className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface`}>
              <div className={CONTAINER}>
                <h2 className="text-2xl font-extrabold text-[var(--home1-text)] mb-8">Related articles</h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
                  {related.map((p) => (
                    <li key={p.slug}>
                      <BlogCard post={p} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </MotionSection>
        )}

        <MotionSection variant="fade-up">
          <CTAHome1 bookHref="/#book" />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
