"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CONTAINER } from "@/components/home1/constants";
import { IconArrow, IconCheck } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { BOOKABLE_SERVICES } from "@/data/servicesPage";
import { EASE_SMOOTH, HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

const HIGHLIGHTS = ["Fixed prices inc. VAT", "NICEIC approved", "Same-day booking"];

export default function ServicesHero() {
  const reduceMotion = useReducedMotion();
  const popularCount = BOOKABLE_SERVICES.length;

  return (
    <section
      className="relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-12 sm:pb-14"
      aria-labelledby="services-hero-heading"
    >
      <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

      <div className={`${CONTAINER} relative z-10`}>
        <div className="grid gap-10 lg:gap-12 xl:gap-14 items-center justify-center mt-5">
          <motion.div
            variants={reduceMotion ? undefined : HERO_CONTAINER}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            className="min-w-0 flex flex-col items-center justify-center"
          >

            <motion.h1
              id="services-hero-heading"
              variants={reduceMotion ? undefined : HERO_TITLE}
              className="text-white text-[32px] sm:text-[42px] lg:text-[46px] font-extrabold leading-[1.08] tracking-tight mb-5"
            >
              Explore our electrical services &amp;{" "}
              <span className="text-[#ff5a3c]">resources</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed mb-6 max-w-xl"
            >
              Explore our comprehensive collection of informative pages and resources. Fixed transparent pricing
              across Nottingham &amp; the East Midlands.
            </motion.p>

            <motion.ul variants={reduceMotion ? undefined : HERO_ITEM} className="flex flex-wrap gap-2 mb-8 list-none p-0 m-0">
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-[12px] font-semibold text-white/90"
                >
                  <IconCheck className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                  {h}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
