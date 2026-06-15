"use client";

import { motion, useReducedMotion } from "framer-motion";
import { WHY_CHOOSE_US_CARDS } from "@/data/whyChooseUs";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { WHY_CHOOSE_US_ICONS } from "./icons";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

export default function WhyChooseUsHome1() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-choose-us"
      className="pt-16 sm:pt-20 lg:pt-24 pb-10 sm:pb-12 lg:pb-14 overflow-x-clip bg-white scroll-mt-28"
      aria-labelledby="home1-why-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="home1-why-heading"
          eyebrow="Why choose us"
          title="Trusted local electricians in Nottingham & East Midlands"
          description="Established in 2014 — five-star reviews and first-visit fixes across Nottingham & the East Midlands."
        />

        <motion.div
          className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6"
          variants={reduceMotion ? undefined : STAGGER_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={STAGGER_VIEWPORT}
        >
          {WHY_CHOOSE_US_CARDS.map((card, index) => {
            const Icon = WHY_CHOOSE_US_ICONS[index] ?? WHY_CHOOSE_US_ICONS[0];

            return (
            <motion.article
              key={card.num}
              variants={STAGGER_ITEM}
              className="home1-card home1-card--accent home1-card-shine p-7 sm:p-8 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-5">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                  style={{ background: "var(--home1-red)" }}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[var(--home1-red)]/20 text-5xl font-black leading-none tabular-nums">{card.num}</span>
              </div>
              <h3 className="font-bold text-[var(--home1-text)] text-lg mb-3 leading-snug">{card.title}</h3>
              <p className="text-[var(--home1-muted)] text-[14px] leading-relaxed flex-1">{card.description}</p>
            </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
