"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { useBookingOptions } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { EASE_SMOOTH, HERO_CONTAINER, HERO_FORM, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

const MARQUEE_ITEMS = [
  {
    label: "12-month warranty",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 14.3 7.2 16.7l.9-5.3L4.2 7.6l5.4-.8L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "NICEIC Approved",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 003.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "1-hour response",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "24/7 always available",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 2l2.4 4.8 5.4.8-3.9 3.8.9 5.3L12 14.3 7.2 16.7l.9-5.3L4.2 7.6l5.4-.8L12 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Fully insured",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 3l7 3v6c0 4.4-2.9 8.4-7 9-4.1-.6-7-4.6-7-9V6l7-3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "No hidden fees",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function MarqueePill({ item }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] text-white text-[13px] font-medium whitespace-nowrap shrink-0">
      <span className="text-[#E31E24] shrink-0">{item.icon}</span>
      {item.label}
    </span>
  );
}

function MarqueeStrip({ id }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="flex items-center gap-3 shrink-0" aria-hidden={id !== "a"}>
      {items.map((item, i) => (
        <MarqueePill key={`${id}-${item.label}-${i}`} item={item} />
      ))}
    </div>
  );
}

function HeroMarquee() {
  return (
    <div className="w-full overflow-hidden" aria-hidden="true">
      <div className="hero-marquee-track flex items-center gap-3 w-max flex-nowrap">
        <MarqueeStrip id="a" />
        <MarqueeStrip id="b" />
        <MarqueeStrip id="c" />
        <MarqueeStrip id="d" />
      </div>
    </div>
  );
}

export default function Hero() {
  const router = useRouter();
  const { options, loading: servicesLoading } = useBookingOptions();
  const [service, setService] = useState("");
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    if (options.length && !service) {
      setService(options[0].name);
    }
  }, [options, service]);
  const reduceMotion = useReducedMotion();

  function handleBookSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (service) params.set("service", service);
    if (postcode.trim()) params.set("postcode", postcode.trim().toUpperCase());
    const qs = params.toString();
    router.push(qs ? `/checkout?${qs}` : "/checkout");
  }

  return (
    <section
      className="relative bg-black overflow-hidden pt-[118px] lg:pt-[122px]"
      aria-labelledby="hero-heading"
    >
      <motion.div
        className="hero-grid-bg absolute inset-0 pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_SMOOTH }}
      />
      <motion.div
        className="hero-top-glow absolute inset-0 pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: EASE_SMOOTH }}
      />
      <motion.div
        className="hero-bottom-glow absolute inset-0 pointer-events-none"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE_SMOOTH }}
      />

      <motion.div
        className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 sm:pt-12 pb-10"
        variants={reduceMotion ? undefined : HERO_CONTAINER}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
      >
        <motion.p
          variants={reduceMotion ? undefined : HERO_ITEM}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22C55E]/45 bg-[#22C55E]/10 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse shrink-0" aria-hidden="true" />
          <span className="text-[#22C55E] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em]">
            Engineers available now in your area
          </span>
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={reduceMotion ? undefined : HERO_TITLE}
          className="font-sans text-[28px] sm:text-[40px] lg:text-[48px] text-white leading-[1.1] tracking-tight mb-5"
          style={{ fontWeight: 800 }}
        >
          Book a trusted electrician <span className="text-[#ff5a3c]">in minutes</span>
        </motion.h1>

        <motion.p
          variants={reduceMotion ? undefined : HERO_ITEM}
          className="font-sans text-white text-[14px] sm:text-[15px] lg:text-[15px] font-normal leading-normal mb-7"
        >
          No call-out fees. Fixed transparent pricing. NICEIC approved engineers across Nottingham &amp; East Midlands.
        </motion.p>

        <motion.p
          variants={reduceMotion ? undefined : HERO_ITEM}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/5 mb-8"
        >
          <svg className="w-4 h-4 text-[#F59E0B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" strokeLinecap="round" />
          </svg>
          <span className="text-[#F59E0B] text-[13px] font-medium">
            Confirmed instantly — slots filling fast today
          </span>
        </motion.p>

        <motion.form
          id="book"
          variants={reduceMotion ? undefined : HERO_FORM}
          className="w-full max-w-[920px] mx-auto text-left bg-[#0a0a0a]/95 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm"
          aria-label="Book an electrician online"
          onSubmit={handleBookSubmit}
        >
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">Check availability and book your electrician</legend>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
              <div>
                <label
                  htmlFor="hero-service"
                  className="flex items-center gap-2 text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.1em] mb-2"
                >
                  <svg className="w-4 h-4 shrink-0 text-[#E31E24]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" >
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                  </svg>
                  Service needed
                </label>
                {servicesLoading ? (
                  <FormFieldSkeleton dark className="rounded-xl !bg-[#1a1a1a]" />
                ) : (
                  <select
                    id="hero-service"
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                    disabled={!options.length}
                    className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3.5 text-[14px] text-white font-medium focus:outline-none focus:border-[#E31E24]/60 focus:ring-1 focus:ring-[#E31E24]/30 transition-all appearance-none cursor-pointer"
                  >
                    {options.map((s) => (
                      <option key={s.name} value={s.name} className="bg-[#141414]">
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label
                  htmlFor="hero-postcode"
                  className="flex items-center gap-2 text-[#ffffff] text-[12px] font-semibold uppercase tracking-[0.1em] mb-2"
                >
                  <svg className="w-3.5 h-3.5 shrink-0 text-[#E31E24]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Your postcode
                </label>
                <input
                  id="hero-postcode"
                  name="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. NG1 1AA"
                  autoComplete="postal-code"
                  className="w-full bg-[#141414] border border-white/15 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder:text-[#6b7280] font-medium focus:outline-none focus:border-[#E31E24]/60 focus:ring-1 focus:ring-[#E31E24]/30 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="hero-cta-shine flex-1 min-w-0 flex items-center justify-center gap-2 sm:gap-3 bg-[#E31E24] hover:bg-[#c41a1f] text-white font-bold text-[14px] sm:text-[15px] py-3.5 sm:py-4 px-4 rounded-xl transition-all duration-200 shadow-[0_8px_30px_rgba(227,30,36,0.45)] hover:shadow-[0_12px_40px_rgba(227,30,36,0.55)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-4-4" strokeLinecap="round" />
                </svg>
                <span className="truncate">Check Availability &amp; Book Now</span>
                <svg className="w-5 h-5 shrink-0 hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h12M13 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <a
                href={`tel:${FOOTER_PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto sm:min-w-[148px] px-5 py-3.5 sm:py-4 rounded-xl border border-white/25 bg-white/[0.06] text-white font-bold text-[14px] sm:text-[15px] hover:bg-[#E31E24]/15 hover:border-[#E31E24]/45 transition-all duration-200"
              >
                <svg className="w-5 h-5 shrink-0 text-[#E31E24]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
                </svg>
                <span className="whitespace-nowrap">{FOOTER_PHONE}</span>
              </a>
            </div>
          </fieldset>
        </motion.form>
      </motion.div>

      <motion.aside
        className="relative z-10 pb-12 sm:pb-14"
        aria-label="Trust highlights"
        initial={reduceMotion ? false : { opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.9, ease: EASE_SMOOTH }}
      >
        <HeroMarquee />

        <footer className="max-w-4xl mx-auto px-4 sm:px-6 text-center mt-10 space-y-2">
          <p className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em]">
            Trusted across the East Midlands since 2014
          </p>
          <p className="text-white text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em] leading-relaxed">
            Trusted local electricians in{" "}
            <strong className="text-[#E31E24] font-bold">Nottingham &amp; East Midlands</strong>
          </p>
        </footer>
      </motion.aside>
    </section>
  );
}
