"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CONTAINER } from "@/components/home1/constants";
import { HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

export default function BlogHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-14 sm:pb-16"
      aria-labelledby="blog-hero-heading"
    >
      <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

      <div className={`${CONTAINER} relative z-10`}>
        <motion.div
          variants={reduceMotion ? undefined : HERO_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.nav
            variants={reduceMotion ? undefined : HERO_ITEM}
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-white/50 mb-6"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/90">Blog &amp; news</span>
          </motion.nav>

          <motion.span variants={reduceMotion ? undefined : HERO_ITEM} className="home1-eyebrow home1-eyebrow--light inline-flex mb-5">
            Insights &amp; guides
          </motion.span>

          <motion.h1
            id="blog-hero-heading"
            variants={reduceMotion ? undefined : HERO_TITLE}
            className="text-white text-[32px] sm:text-[42px] lg:text-[48px] font-extrabold leading-[1.08] tracking-tight mb-5"
          >
            Electrical tips from{" "}
            <span className="text-[#ff5a3c]">local experts</span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mx-auto"
          >
            Practical advice on safety, compliance, and home electrics — written by NICEIC approved electricians
            serving Nottingham and the East Midlands.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
