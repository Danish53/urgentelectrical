"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useBookingOptions } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER } from "./constants";
import { IconArrow, IconPhone } from "./icons";
import { EASE_SMOOTH, HERO_CONTAINER, HERO_FORM, HERO_ITEM, HERO_TITLE } from "@/lib/motion";
import {
  AVAILABILITY_OPEN,
  getEngineerAvailability,
} from "@/lib/engineerAvailability";

const MARQUEE_ITEMS = [
  "12-month warranty",
  "NICEIC Approved",
  "1-hour response",
  "24/7 always available",
  "Fully insured",
  "No hidden fees",
];

function MarqueePill({ label }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 bg-white/[0.04] text-white text-[13px] font-medium whitespace-nowrap shrink-0">
      <span className="text-[#D3231F]" aria-hidden="true">
        ✦
      </span>
      {label}
    </span>
  );
}

function MarqueeStrip({ id }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="flex items-center gap-3 shrink-0" aria-hidden={id !== "a"}>
      {items.map((label, i) => (
        <MarqueePill key={`${id}-${label}-${i}`} label={label} />
      ))}
    </div>
  );
}

function HeroMarqueeHome1() {
  return (
    <div className="home1-hero-marquee-fade w-full overflow-hidden py-1" aria-hidden="true">
      <div className="hero-marquee-track flex items-center gap-3 w-max flex-nowrap">
        <MarqueeStrip id="a" />
        <MarqueeStrip id="b" />
        <MarqueeStrip id="c" />
        <MarqueeStrip id="d" />
      </div>
    </div>
  );
}

const HERO_STATS = [
  { value: "24/7", label: "Emergency" },
  { value: "60 min", label: "Avg response" },
  { value: "NICEIC", label: "Approved" },
  { value: "2014", label: "Est. since" },
];

export default function HeroHome1() {
  const router = useRouter();
  const { options, loading: servicesLoading } = useBookingOptions();
  const [service, setService] = useState("");

  useEffect(() => {
    if (options.length && !service) {
      setService(options[0].name);
    }
  }, [options, service]);
  const [postcode, setPostcode] = useState("");
  const [availability, setAvailability] = useState(AVAILABILITY_OPEN);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setAvailability(getEngineerAvailability());
  }, []);

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
      id="hero"
      className="home1-hero relative bg-black overflow-x-clip pt-[118px] lg:pt-[152px] scroll-mt-0"
      aria-labelledby="home1-hero-heading"
    >
      <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-bottom-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
      <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

      <div className={`${CONTAINER} relative z-10 pb-8`}>
        <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            variants={reduceMotion ? undefined : HERO_CONTAINER}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            className="text-center lg:text-left mt-3"
          >
            {/* <motion.div
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="inline-flex items-center gap-3 mb-7 lg:mb-8"
            >
              <div className="relative shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Urgent Electrical Services"
                  width={56}
                  height={56}
                  className="rounded-xl object-contain ring-2 ring-[#D3231F]/40 shadow-[0_8px_32px_rgba(211,35,31,0.35)]"
                  priority
                />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-white font-bold text-[15px] leading-tight">Urgent Electrical Services</p>
                <p className="text-[#D3231F] text-[10px] font-bold uppercase tracking-[0.16em] mt-0.5">
                  24 HR Emergency Response
                </p>
              </div>
            </motion.div> */}

            <motion.div
              variants={reduceMotion ? undefined : HERO_ITEM}
              id="availabilityBadge"
              className={`home1-hero-availability${availability.limited ? " home1-hero-availability--limited" : ""}`}
            >
              <span className="home1-hero-availability-dot" aria-hidden="true" />
              <span id="availabilityText" className="home1-hero-availability-text">
                {availability.heroText}
              </span>
            </motion.div>

            <motion.h1
              id="home1-hero-heading"
              variants={reduceMotion ? undefined : HERO_TITLE}
              className="font-sans text-[30px] sm:text-[42px] lg:text-[50px] xl:text-[52px] text-white font-extrabold leading-[1.08] tracking-tight mb-5"
            >
              Book a trusted electrician{" "}
              <span className="text-[#ff5a3c]">in minutes</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="text-white/80 text-[14px] sm:text-[15px] leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0"
            >
              No call-out fees. Fixed transparent pricing. NICEIC approved engineers across Nottingham &amp; the East Midlands.
            </motion.p>

            <motion.div
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#F59E0B]/35 bg-[#F59E0B]/8 mb-8"
            >
              {/* <span className="text-[#FBBF24] text-sm" aria-hidden="true">
                ⏱
              </span> */}
              <span className="text-[#FCD34D] text-[13px] font-medium">
                Confirmed instantly — slots filling fast today
              </span>
            </motion.div>

            <motion.div
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="flex flex-row flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-8"
            >
              <a
                href={`tel:${FOOTER_PHONE_TEL}`}
                className="home1-hero-phone text-[13px] sm:text-[15px] px-3 py-2.5 sm:px-5 sm:py-3 whitespace-nowrap shrink-0"
              >
                <IconPhone className="text-[#D3231F] w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                {FOOTER_PHONE}
              </a>
              <Link
                href="/services"
                className="hero-cta-shine home1-btn-primary text-[13px] sm:text-sm py-2.5 px-3 sm:py-3 sm:px-5 whitespace-nowrap shrink-0"
              >
                Book online
                <IconArrow className="w-4 h-4 shrink-0" />
              </Link>
            </motion.div>

            {/* <motion.ul
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-xl mx-auto lg:mx-0"
            >
              {HERO_STATS.map((s) => (
                <li key={s.label} className="home1-hero-stat">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </motion.ul> */}
          </motion.div>

          {/* Right — dark booking form */}
          <motion.div
            variants={reduceMotion ? undefined : HERO_FORM}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            className="relative home1-hero-booking p-5 sm:p-7 lg:p-8 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <p className="text-[#D3231F] text-[10px] font-bold uppercase tracking-[0.16em] mb-1">Online booking</p>
                <h2 className="text-white text-xl sm:text-2xl font-bold">Check availability</h2>
              </div>
              <span className="hidden sm:flex w-11 h-11 rounded-xl bg-[#D3231F]/20 items-center justify-center text-[#ff5a3c]" aria-hidden="true">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L3 14h8l-1 8 10-12h-7l1-8z" />
                </svg>
              </span>
            </div>

            <form id="book" className="space-y-4" aria-label="Book an electrician online" onSubmit={handleBookSubmit}>
              <div>
                <label
                  htmlFor="home1-service"
                  className="flex items-center gap-2 text-white/90 text-[11px] font-bold uppercase tracking-[0.1em] mb-2"
                >
                  <svg className="w-4 h-4 text-[#D3231F]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                  </svg>
                  Service needed
                </label>
                {servicesLoading ? (
                  <FormFieldSkeleton dark />
                ) : (
                  <select
                    id="home1-service"
                    name="service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                    disabled={!options.length}
                    className="home1-hero-input cursor-pointer appearance-none"
                  >
                    {options.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label
                  htmlFor="home1-postcode"
                  className="flex items-center gap-2 text-white/90 text-[11px] font-bold uppercase tracking-[0.1em] mb-2"
                >
                  <svg className="w-3.5 h-3.5 text-[#D3231F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" strokeLinecap="round" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Your postcode
                </label>
                <input
                  id="home1-postcode"
                  name="postcode"
                  type="text"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  placeholder="e.g. NG1 1AA"
                  autoComplete="postal-code"
                  className="home1-hero-input"
                />
              </div>

              <div className="px-3 sm:px-0">
                <button
                  type="submit"
                  className="hero-cta-shine w-full flex items-center justify-center gap-2 sm:gap-3 bg-[#D3231F] hover:bg-[#b71c1c] text-white font-bold text-[14px] sm:text-[15px] py-4 rounded-xl transition-all duration-200 shadow-[0_8px_30px_rgba(211,35,31,0.45)] hover:shadow-[0_12px_40px_rgba(211,35,31,0.55)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20l-4-4" strokeLinecap="round" />
                  </svg>
                  Check Availability &amp; Book Now
                  <IconArrow className="w-5 h-5 shrink-0" />
                </button>
              </div>
            </form>

            <p className="mt-5 text-center text-white/45 text-[11px] font-medium">
              Free quote · No obligation · Secure booking
            </p>
          </motion.div>
        </div>
      </div>

      {/* Trust marquee + footer strip */}
      <aside className="relative z-10 border-t border-white/[0.06] pt-4 pb-12 sm:pb-14" aria-label="Trust highlights">
        <HeroMarqueeHome1 />
        <footer className={`${CONTAINER} text-center mt-8 space-y-2`}>
          <p className="text-white/70 text-[11px] font-bold uppercase tracking-[0.14em]">
            Trusted across the East Midlands since 2014
          </p>
          <p className="text-white/90 text-[11px] sm:text-xs font-bold uppercase tracking-[0.1em]">
            Trusted local electricians in{" "}
            <strong className="text-[#D3231F]">Nottingham &amp; East Midlands</strong>
          </p>
        </footer>
      </aside>
    </section>
  );
}
