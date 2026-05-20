"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/data/howItWorks";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

export default function HowItWorksHome1() {
  const reduceMotion = useReducedMotion();

  return (
    <section className={`home1-section-surface ${SECTION_PY} overflow-x-clip`} aria-labelledby="home1-how-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home1-how-heading"
          eyebrow="How it works"
          title="Booked, confirmed & sorted in four simple steps"
          description="Getting a trusted electrician has never been easier — book online in under 2 minutes."
        />

        <motion.ol
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 list-none p-0 m-0"
          variants={reduceMotion ? undefined : STAGGER_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={STAGGER_VIEWPORT}
        >
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <motion.li key={step.num} variants={STAGGER_ITEM} className="home1-card p-6 sm:p-7 relative">
              {i < HOW_IT_WORKS_STEPS.length - 1 && (
                <span
                  className="hidden lg:block absolute top-10 left-[calc(100%+4px)] w-[calc(100%-8px)] h-0.5 bg-gradient-to-r from-[var(--home1-red)]/40 to-transparent -translate-x-1/2 z-0"
                  aria-hidden="true"
                />
              )}
              <span
                className="inline-flex w-12 h-12 rounded-2xl text-white font-black text-lg items-center justify-center mb-5 shadow-md"
                style={{ background: "var(--home1-red)", boxShadow: "0 8px 20px rgba(211,35,31,0.3)" }}
              >
                {step.num}
              </span>
              <h3 className="font-bold text-[var(--home1-text)] text-lg mb-2 relative z-10">{step.title}</h3>
              <p className="text-[var(--home1-muted)] text-[14px] leading-relaxed relative z-10">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
