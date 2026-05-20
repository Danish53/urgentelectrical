import { motion, useReducedMotion } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/data/howItWorks";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const BRAND_RED = "#D32F2F";
const LINE_COLOR = "#f3d4d4";

function StepItem({ step, index, total }) {
  const isLast = index === total - 1;

  return (
    <motion.li
      variants={STAGGER_ITEM}
      className="how-it-step group relative flex flex-col items-center text-center list-none px-2 cursor-pointer"
    >
      <div className="relative z-10 mb-5 sm:mb-6">
        <div
          className="how-step-circle flex h-[64px] w-[64px] sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full border-2 border-[#e0e0e0] bg-white transition-all duration-500 ease-out delay-0 group-hover:delay-150 group-hover:border-[#D32F2F] group-hover:bg-[#D32F2F] group-hover:shadow-[0_0_0_10px_rgba(211,47,47,0.12),0_10px_28px_rgba(211,47,47,0.28)]"
          aria-hidden="true"
        >
          <span className="text-[22px] sm:text-2xl font-bold leading-none text-[#D32F2F] transition-colors duration-500 ease-out delay-0 group-hover:delay-150 group-hover:text-white">
            {step.num}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-[#1a1a1a] text-[17px] sm:text-lg leading-snug mb-3 transition-colors duration-500 ease-out delay-0 group-hover:delay-150 group-hover:text-[#D32F2F] max-w-[280px]">
        {step.title}
      </h3>
      <p className="text-[#666666] text-[14px] sm:text-[15px] leading-relaxed font-normal max-w-[300px] mx-auto">
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

export default function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24 overflow-x-clip"
      aria-labelledby="how-it-works-heading"
    >
      <div className={SECTION_CONTAINER}>
        <header className="text-center max-w-[900px] mx-auto mb-12 sm:mb-14 lg:mb-16">
          <p
            className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-4"
            style={{ color: BRAND_RED }}
          >
            How It Works
          </p>
          <h2
            id="how-it-works-heading"
            className="font-sans text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[#1a1a1a] leading-[1.2] tracking-[-0.02em] mb-4"
            style={{ fontWeight: 800 }}
          >
            Booked, confirmed &amp; sorted
            <br />
            in four simple steps
          </h2>
          <p className="font-sans text-[#666666] text-[14px] sm:text-[15px] leading-relaxed max-w-[560px] mx-auto">
            Getting a trusted electrician has never been easier. Book online in under 2 minutes.
          </p>
        </header>

        <div className="relative">
          {/* Desktop horizontal connector line */}
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
              <StepItem
                key={step.num}
                step={step}
                index={index}
                total={HOW_IT_WORKS_STEPS.length}
              />
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
