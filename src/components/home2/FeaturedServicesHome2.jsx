"use client";

import { useState, useEffect, useCallback } from "react";
import { FEATURED_SERVICES, priceIncVat } from "@/data/featuredServices";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";

function usePerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const u = () => {
      if (window.innerWidth >= 1280) setN(4);
      else if (window.innerWidth >= 768) setN(2);
      else setN(1);
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return n;
}

export default function FeaturedServicesHome2() {
  const per = usePerView();
  const [i, setI] = useState(0);
  const max = Math.max(0, FEATURED_SERVICES.length - per);
  const pct = 100 / per;
  useEffect(() => setI((x) => Math.min(x, max)), [max]);
  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), []);
  const next = useCallback(() => setI((x) => Math.min(max, x + 1)), [max]);

  return (
    <section className="home2-section bg-white overflow-x-clip" aria-labelledby="home2-featured-heading">
      <div className={CONTAINER}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader id="home2-featured-heading" eyebrow="Featured" title="Popular service packages" align="left" compact />
          <div className="flex gap-2 shrink-0">
            <button type="button" onClick={prev} disabled={i === 0} className="home2-btn home2-btn--outline w-11 h-11 p-0" aria-label="Previous">
              ←
            </button>
            <button type="button" onClick={next} disabled={i >= max} className="home2-btn home2-btn--primary w-11 h-11 p-0" aria-label="Next">
              →
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${i * pct}%)` }}>
            {FEATURED_SERVICES.map((s) => (
              <div key={s.id} className="shrink-0 px-2" style={{ width: `${pct}%` }}>
                <article className="home2-card overflow-hidden h-full flex flex-col">
                  <div className="h-36 bg-[var(--h2-surface)] relative">
                    <img src={s.image} alt="" className="w-full h-full object-cover" />
                    {s.tag && (
                      <span className="absolute top-2 left-2 bg-[var(--h2-red)] text-white text-[10px] font-bold px-2 py-0.5 rounded">{s.tag}</span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-[var(--h2-navy)] mb-2 line-clamp-2 flex-1">{s.name}</h3>
                    <p className="text-xl font-extrabold text-[var(--h2-red)]">£{priceIncVat(s.priceExc)}</p>
                    <a href="#book" className="home2-btn home2-btn--primary w-full mt-3 text-sm py-2.5">
                      Select
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
