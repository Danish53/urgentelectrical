"use client";

import { useState } from "react";
import Image from "next/image";
import Home2Image from "./Home2Image";
import { SERVICES as BOOKING_SERVICES } from "@/data/services";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { CONTAINER } from "./constants";
import { IconArrow, IconCheck, IconPhone } from "./icons";

export default function HeroHome2() {
  const [service, setService] = useState("Portable Appliance Testing (PAT)");
  const [postcode, setPostcode] = useState("");

  return (
    <section
      className="home2-hero home2-section overflow-x-clip pt-[118px] lg:pt-[122px] pb-14 lg:pb-20"
      aria-labelledby="home2-hero-heading"
    >
      <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
      <div className="hero-bottom-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

      <div className={`${CONTAINER} relative z-10`}>
        <div className="grid lg:grid-cols-2 xl:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-3 mb-6">
              <Image
                src="/logoelec.jfif"
                alt="Urgent Electrical Services"
                width={56}
                height={56}
                className="rounded-xl ring-2 ring-[#D3231F]/50 shadow-lg"
                priority
              />
              <div className="text-left hidden sm:block">
                <p className="text-white font-bold text-[15px]">Urgent Electrical Services</p>
                <p className="text-[#ff5a3c] text-[10px] font-bold uppercase tracking-[0.16em]">24 HR Emergency Response</p>
              </div>
            </div>

            <span className="home2-hero-badge-dark mb-5">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" aria-hidden="true" />
              Engineers available now · Nottingham
            </span>

            <h1
              id="home2-hero-heading"
              className="text-[30px] sm:text-[42px] lg:text-[50px] font-extrabold text-white leading-[1.06] tracking-tight mb-5"
            >
              Book a trusted electrician{" "}
              <span className="text-[#ff5a3c]">in minutes</span>
            </h1>

            <p className="text-white/80 text-[15px] leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
              No call-out fees. Fixed transparent pricing. NICEIC approved engineers across Nottingham &amp; the East Midlands.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              <a href={`tel:${FOOTER_PHONE_TEL}`} className="home2-btn home2-btn--white">
                <IconPhone />
                {FOOTER_PHONE}
              </a>
              <a href="#home2-services" className="home2-btn home2-btn--outline-light">
                View services
                <IconArrow />
              </a>
            </div>

            <ul className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm font-semibold text-white/70">
              {["NICEIC Approved", "Fully Insured", "Est. 2014"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <IconCheck className="text-[#4ADE80] w-4 h-4" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2 space-y-5">
            <div className="home2-hero-visual relative hidden sm:block min-h-[200px] lg:min-h-[220px]">
              <Home2Image src="/featured/emergency-24.jpg" alt="Emergency electrician on call" priority sizes="(max-width: 768px) 100vw, 560px" />
              <div className="home2-hero-visual-overlay" aria-hidden="true" />
              <p className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg z-10">
                24/7 emergency electricians
              </p>
            </div>

            <div className="home2-hero-form p-6 sm:p-7 relative">
              <p className="text-[#ff5a3c] text-[10px] font-bold uppercase tracking-[0.16em] mb-1">Instant booking</p>
              <h2 className="text-white text-xl font-bold mb-5">Check availability &amp; book</h2>
              <form id="book" className="space-y-4" aria-label="Book an electrician">
                <div>
                  <label htmlFor="home2-service" className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 block">
                    Service
                  </label>
                  <select
                    id="home2-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="home2-input cursor-pointer w-full"
                    required
                  >
                    {BOOKING_SERVICES.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="home2-postcode" className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1.5 block">
                    Postcode
                  </label>
                  <input
                    id="home2-postcode"
                    type="text"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                    placeholder="e.g. NG1 1AA"
                    className="home2-input w-full"
                    autoComplete="postal-code"
                  />
                </div>
                <button type="submit" className="home2-btn home2-btn--primary w-full">
                  Check Availability
                  <IconArrow />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
