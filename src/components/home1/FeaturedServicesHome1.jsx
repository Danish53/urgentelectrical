"use client";

import { useState, useEffect, useCallback } from "react";
import { FEATURED_SERVICES, priceIncVat } from "@/data/featuredServices";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconArrow } from "./icons";

const SLIDE_MS = 700;

function useSlidesPerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const u = () => {
      if (window.innerWidth >= 1280) setN(3);
      else if (window.innerWidth >= 768) setN(2);
      else setN(1);
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return n;
}

function ServiceCardHome1({ service }) {
  const [failed, setFailed] = useState(false);
  const price = priceIncVat(service.priceExc);

  return (
    <article className="home1-card home1-card-shine h-full flex flex-col overflow-hidden group">
      <div className="h-40 relative overflow-hidden bg-[var(--home1-surface)]">
        {!failed && (
          <img src={service.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setFailed(true)} />
        )}
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: service.color }}>
            {service.name}
          </div>
        )}
        {service.tag && (
          <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide" style={{ background: "var(--home1-red)" }}>
            {service.tag}
          </span>
        )}
      </div>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="font-bold text-[var(--home1-text)] text-[15px] leading-snug mb-3 line-clamp-2 min-h-[2.5rem]">{service.name}</h3>
        <p className="text-2xl font-extrabold mb-1" style={{ color: "var(--home1-red)" }}>
          £{price}
        </p>
        <p className="text-[var(--home1-muted)] text-xs font-medium mb-5">Inc. VAT · Fixed price</p>
        <a href="#book" className="home1-btn-primary mt-auto w-full text-sm py-3.5">
          Book this service
          <IconArrow className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

export default function FeaturedServicesHome1() {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, FEATURED_SERVICES.length - slidesPerView);
  const slidePct = 100 / slidesPerView;

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <section className={`${SECTION_PY} bg-white overflow-x-clip`} aria-labelledby="home1-featured-heading">
      <div className={CONTAINER}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeader
            id="home1-featured-heading"
            eyebrow="Featured services"
            title="Popular fixed-price electrical jobs"
            description="Transparent pricing — select a service and book in minutes."
            align="left"
            compact
          />
          <div className="flex gap-2 shrink-0 sm:mb-2">
            <button type="button" onClick={goPrev} disabled={index === 0} className="home1-nav-btn home1-nav-btn--ghost" aria-label="Previous">
              ←
            </button>
            <button type="button" onClick={goNext} disabled={index >= maxIndex} className="home1-nav-btn home1-nav-btn--primary" aria-label="Next">
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <div className="flex transition-transform ease-out" style={{ transform: `translateX(-${index * slidePct}%)`, transitionDuration: `${SLIDE_MS}ms` }}>
            {FEATURED_SERVICES.map((s) => (
              <div key={s.id} className="shrink-0 px-2.5" style={{ width: `${slidePct}%` }}>
                <ServiceCardHome1 service={s} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
