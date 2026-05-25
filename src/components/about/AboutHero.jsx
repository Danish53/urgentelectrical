"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { IconCheck } from "@/components/home1/icons";
import { ABOUT_HERO } from "@/data/aboutPage";
import { HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="home1-about-hero relative bg-black overflow-x-clip pb-10 sm:pb-12 lg:pb-14"
      style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
      aria-labelledby="about-hero-heading"
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
            id="about-hero-heading"
            variants={reduceMotion ? undefined : HERO_TITLE}
            className="text-white text-[26px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-5"
          >
            {ABOUT_HERO.title}{" "}
            <span className="text-[#ff5a3c]">{ABOUT_HERO.titleAccent}</span>
          </motion.h1>

          <motion.p
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="text-white/80 text-[14px] sm:text-[16px] leading-relaxed mb-5 sm:mb-6 max-w-2xl mx-auto"
          >
            {ABOUT_HERO.description}
          </motion.p>

          <motion.ul
            variants={reduceMotion ? undefined : HERO_ITEM}
            className="flex flex-wrap justify-center gap-2 list-none p-0 m-0"
          >
            {ABOUT_HERO.highlights.map((h) => (
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
