import { motion, useReducedMotion } from "framer-motion";
import { WHY_CHOOSE_US_CARDS } from "@/data/whyChooseUs";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";
import { CONTAINER } from "@/components/home1/constants";

const SECTION_CONTAINER = CONTAINER;
const BRAND_RED = "#A31D1D";

function IconDispatch() {
  return (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="7" r="4.2" fill="white" />
      <text x="17" y="8.6" textAnchor="middle" fill={BRAND_RED} fontSize="5.5" fontWeight="700" fontFamily="system-ui, sans-serif">
        24
      </text>
    </svg>
  );
}

function IconRapidResponse() {
  return (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="6"
        width="14"
        height="12"
        rx="1.5"
        stroke="white"
        strokeWidth="1.6"
        strokeDasharray="3 2.5"
      />
      <path
        d="M15 12H9M11 10l-2 2 2 2"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProblemSolved() {
  return (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10" cy="8.5" r="3.2" stroke="white" strokeWidth="1.7" />
      <path d="M5.5 19.5v-1.2a4.5 4.5 0 019 0v1.2" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="17.5" cy="9" r="2.2" stroke="white" strokeWidth="1.5" />
      <path d="M17.5 10.6v2.2M16.4 11.7h2.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconCovered() {
  return (
    <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8" r="2.8" stroke="white" strokeWidth="1.6" />
      <path d="M4.5 18.5v-1a4 4 0 018 0v1" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="15.5" cy="8" r="2.8" stroke="white" strokeWidth="1.6" />
      <path d="M11.5 18.5v-1a4 4 0 018 0v1" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const CARD_ICONS = [IconDispatch, IconRapidResponse, IconProblemSolved, IconCovered];

function FeatureCard({ card, index }) {
  const Icon = CARD_ICONS[index];

  return (
    <motion.article
      variants={STAGGER_ITEM}
      className="why-choose-card group relative bg-white rounded-2xl border border-[#ececec] shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-8 h-full flex flex-col overflow-hidden transition-all duration-300 ease-out will-change-transform hover:scale-[1.03] hover:border-transparent hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] hover:z-10"
    >
      <span
        className="why-choose-card-border absolute top-0 left-0 right-0 h-[5px] z-10 pointer-events-none rounded-t-2xl"
        style={{ backgroundColor: BRAND_RED }}
        aria-hidden="true"
      />

      <div className="flex items-start justify-between gap-3 mb-6">
        <div
          className="w-12 h-12 shrink-0 rounded-[10px] flex items-center justify-center"
          style={{ backgroundColor: BRAND_RED }}
          aria-hidden="true"
        >
          <Icon />
        </div>
        <span
          className="text-[62px] sm:text-[68px] font-bold leading-[0.8] select-none tabular-nums tracking-tight"
          style={{ color: "rgba(163, 29, 29, 0.14)" }}
          aria-hidden="true"
        >
          {card.num}
        </span>
      </div>

      <h3 className="font-bold text-[#1a1a1a] text-xl leading-snug mb-3">{card.title}</h3>
      <p className="text-[#5A5856] text-[14px] leading-relaxed font-normal flex-1">{card.description}</p>
    </motion.article>
  );
}

export default function WhyChooseUs() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="bg-[#f5f5f5] py-16 sm:py-20 lg:py-[88px] overflow-x-clip"
      aria-labelledby="why-choose-us-heading"
    >
      <div className={SECTION_CONTAINER}>
        <header className="text-center max-w-[900px] mx-auto mb-12 sm:mb-14 lg:mb-[60px]">
          <p
            className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] mb-4"
            style={{ color: BRAND_RED }}
          >
            Why Choose Us
          </p>
          <h2
            id="why-choose-us-heading"
            className="font-sans text-[30px] sm:text-[36px] lg:text-[42px] font-extrabold text-[#1a1a1a] leading-[1.18] tracking-[-0.02em] mb-5"
            style={{ fontWeight: 800 }}
          >
            Trusted local electricians in
            <br />
            Nottingham &amp; East Midlands
          </h2>
          <p className="font-sans text-[#6b7280] text-[14px] sm:text-[15px] leading-relaxed font-normal max-w-[720px] mx-auto">
            Established in 2014, hundreds of five-star reviews, and a commitment to first-visit fixes every time.
          </p>
        </header>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6 py-4 overflow-x-clip"
          variants={reduceMotion ? undefined : STAGGER_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={STAGGER_VIEWPORT}
        >
          {WHY_CHOOSE_US_CARDS.map((card, index) => (
            <FeatureCard key={card.num} card={card} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
