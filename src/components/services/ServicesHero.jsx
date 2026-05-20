"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CONTAINER } from "@/components/home1/constants";
import { IconArrow } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { SERVICES_PAGE_TRUST } from "@/data/servicesPage";
import { EASE_SMOOTH, HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

export default function ServicesHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="services-hero relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-14 sm:pb-16"
      aria-labelledby="services-hero-heading"
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
          className="max-w-3xl"
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
            <span className="text-white/90">Our Services</span>
          </motion.nav>

          <motion.span
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="home1-eyebrow home1-eyebrow--light inline-flex mb-5"
          >
            Our Services
          </motion.span>

          <motion.h1
            id="services-hero-heading"
            variants={reduceMotion ? undefined : HERO_TITLE}
            className="font-sans text-[32px] sm:text-[42px] lg:text-[48px] text-white font-extrabold leading-[1.08] tracking-tight mb-5"
          >
            Explore our electrical services &amp;{" "}
            <span className="text-[#ff5a3c]">resources</span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed mb-8 max-w-2xl"
          >
            Explore our comprehensive collection of informative pages and resources. Fixed transparent
            pricing, NICEIC approved engineers, and same-day booking across Nottingham &amp; the East Midlands.
          </motion.p>

          <motion.div
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10"
          >
            <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-hero-phone">
              {FOOTER_PHONE}
            </a>
            <Link href="/#book" className="home1-btn-primary text-sm py-3 px-5">
              Book online
              <IconArrow className="w-4 h-4" />
            </Link>
            <a href="#services-catalog" className="home1-btn-outline text-sm py-3 px-5">
              View all services
            </a>
          </motion.div>

          <motion.ul
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-2xl"
          >
            {SERVICES_PAGE_TRUST.map((s) => (
              <li key={s.label} className="home1-hero-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
