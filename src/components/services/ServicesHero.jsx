"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { IconCheck } from "@/components/home1/icons";
import { HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

const HIGHLIGHTS = ["Fixed prices inc. VAT", "NICEIC approved", "Same-day booking"];

export default function ServicesHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="home1-services-hero relative bg-black overflow-x-clip pb-10 sm:pb-12 lg:pb-14"
      style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
      aria-labelledby="services-hero-heading"
    >
      <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

      <div className={`${SERVICES_PAGE_CONTAINER} relative z-10`}>
        <motion.div
          variants={reduceMotion ? undefined : HERO_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? undefined : "visible"}
          className="min-w-0 flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <motion.h1
            id="services-hero-heading"
            variants={reduceMotion ? undefined : HERO_TITLE}
            className="text-white text-[26px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-5"
          >
            Explore our electrical services &amp;{" "}
            <span className="text-[#ff5a3c]">resources</span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="text-white/80 text-[14px] sm:text-[16px] leading-relaxed mb-5 sm:mb-6 max-w-xl mx-auto"
          >
            Explore our comprehensive collection of informative pages and resources. Fixed transparent pricing
            across Nottingham &amp; the East Midlands.
          </motion.p>

          <motion.ul
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="flex flex-wrap justify-center gap-2 mb-0 list-none p-0 m-0"
          >
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-[11px] sm:text-[12px] font-semibold text-white/90"
              >
                <IconCheck className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                {h}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
