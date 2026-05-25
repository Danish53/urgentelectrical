"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices, useFeaturedServices } from "@/hooks/useServices";
import FeaturedServicesSkeleton from "@/components/skeletons/FeaturedServicesSkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
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
  const dispatch = useAppDispatch();
  const per = usePerView();
  const [i, setI] = useState(0);
  const { bookable } = useBookableServices();
  const { services, loading, failed } = useFeaturedServices();

  const max = Math.max(0, services.length - per);
  const pct = 100 / per;

  useEffect(() => setI((x) => Math.min(x, max)), [max]);
  const prev = useCallback(() => setI((x) => Math.max(0, x - 1)), []);
  const next = useCallback(() => setI((x) => Math.min(max, x + 1)), [max]);

  function resolveHref(name) {
    return bookable.find((s) => s.name === name)?.href ?? "/services";
  }

  return (
    <section className="home2-section bg-white overflow-x-clip" aria-labelledby="home2-featured-heading">
      <div className={CONTAINER}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <SectionHeader id="home2-featured-heading" eyebrow="Featured" title="Popular service packages" align="left" compact />
          {!loading && services.length > 0 ? (
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={prev} disabled={i === 0} className="home2-btn home2-btn--outline w-11 h-11 p-0" aria-label="Previous">
                ←
              </button>
              <button type="button" onClick={next} disabled={i >= max} className="home2-btn home2-btn--primary w-11 h-11 p-0" aria-label="Next">
                →
              </button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <FeaturedServicesSkeleton compact count={4} />
        ) : failed ? (
          <ServicesLoadError onRetry={() => dispatch(fetchServices())} />
        ) : services.length === 0 ? (
          <p className="text-center text-[var(--h2-muted)] py-10">No services available.</p>
        ) : (
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${i * pct}%)` }}>
              {services.map((s) => (
                <div key={s.id} className="shrink-0 px-2" style={{ width: `${pct}%` }}>
                  <article className="home2-card overflow-hidden h-full flex flex-col">
                    <div className="h-36 bg-[var(--h2-surface)] relative">
                      {s.image ? (
                        <img src={s.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="ue-skeleton w-full h-full rounded-none" />
                      )}
                      {s.tag ? (
                        <span className="absolute top-2 left-2 bg-[var(--h2-red)] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {s.tag}
                        </span>
                      ) : null}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-sm text-[var(--h2-navy)] mb-2 line-clamp-2 flex-1">
                        <Link href={resolveHref(s.name)} className="hover:text-[var(--h2-red)]">
                          {s.name}
                        </Link>
                      </h3>
                      <p className="text-xl font-extrabold text-[var(--h2-red)]">£{s.priceIncVat}</p>
                      <Link
                        href={bookable.find((b) => b.name === s.name)?.bookHref ?? "/checkout"}
                        className="home2-btn home2-btn--primary w-full mt-3 text-sm py-2.5"
                      >
                        Select
                      </Link>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
