"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/data/howItWorks";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const BRAND_RED = "#D3231F";
const LINE_COLOR = "#f3d4d4";

function StepItem({ step, index, total }) {
  const isLast = index === total - 1;

  return (
    <motion.li
      variants={STAGGER_ITEM}
      className="how-it-step group relative flex flex-col items-center text-center list-none px-2"
    >
      <div className="relative z-10 mb-5 sm:mb-6">
        <div
          className="how-step-circle flex h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full border-2 border-[#e5e7eb] bg-white transition-all duration-500 ease-out group-hover:border-[var(--home1-red,#D3231F)] group-hover:bg-[var(--home1-red,#D3231F)] group-hover:shadow-[0_0_0_10px_rgba(211,35,31,0.12),0_10px_28px_rgba(211,35,31,0.28)]"
          style={{ "--home1-red": BRAND_RED }}
          aria-hidden="true"
        >
          <span
            className="text-[22px] sm:text-2xl font-extrabold leading-none transition-colors duration-500 ease-out group-hover:text-white"
            style={{ color: BRAND_RED }}
          >
            {step.num}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-[var(--home1-text,#1a1a1a)] text-[17px] sm:text-lg leading-snug mb-3 transition-colors duration-500 ease-out group-hover:text-[var(--home1-red,#D3231F)] max-w-[280px]">
        {step.title}
      </h3>
      <p className="text-[var(--home1-muted,#666)] text-[14px] sm:text-[15px] leading-relaxed max-w-[300px] mx-auto">
        {step.description}
      </p>

      {!isLast && (
        <span
          className="sm:hidden block w-[2px] h-10 mt-10 shrink-0"
          style={{ backgroundColor: LINE_COLOR }}
          aria-hidden="true"
        />
      )}
    </motion.li>
  );
}

/**
 * @param {{
 *   sectionId?: string;
 *   headingId?: string;
 *   className?: string;
 *   eyebrow?: string;
 *   title?: React.ReactNode;
 *   description?: string;
 * }} props
 */
export default function HowItWorks({
  sectionId = "how-it-works",
  headingId = "how-it-works-heading",
  className = "bg-white py-16 sm:py-20 lg:py-24 overflow-x-clip",
  eyebrow = "How it works",
  title = (
    <>
      Booked, confirmed &amp; sorted
      <br />
      in four simple steps
    </>
  ),
  description = "Getting a trusted electrician has never been easier. Book online in under 2 minutes.",
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section id={sectionId} className={className} aria-labelledby={headingId}>
      <div className={SECTION_CONTAINER}>
        <header className="text-center max-w-[900px] mx-auto mb-12 sm:mb-14 lg:mb-16">
          <p
            className="home1-eyebrow inline-flex mb-4 mx-auto"
            style={{ color: BRAND_RED, background: "var(--home1-red-soft, #ffebee)" }}
          >
            {eyebrow}
          </p>
          <h2
            id={headingId}
            className="font-sans text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold text-[var(--home1-text,#1a1a1a)] leading-[1.15] tracking-tight mb-4"
          >
            {title}
          </h2>
          <p className="text-[var(--home1-muted,#666)] text-[15px] leading-relaxed max-w-[560px] mx-auto">
            {description}
          </p>
        </header>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-[36px] left-[12.5%] right-[12.5%] h-[2px] pointer-events-none z-0"
            style={{ backgroundColor: LINE_COLOR }}
            aria-hidden="true"
          />

          <motion.ol
            className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-10 lg:gap-6 list-none p-0 m-0"
            variants={reduceMotion ? undefined : STAGGER_CONTAINER}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "visible"}
            viewport={STAGGER_VIEWPORT}
          >
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <StepItem key={step.num} step={step} index={index} total={HOW_IT_WORKS_STEPS.length} />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
