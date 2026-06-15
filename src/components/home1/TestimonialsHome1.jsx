"use client";

import { useState, useEffect, useCallback } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import TestimonialAvatar from "@/components/testimonials/TestimonialAvatar";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";

function useSlidesPerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const u = () => {
      if (window.innerWidth >= 1024) setN(3);
      else if (window.innerWidth >= 640) setN(2);
      else setN(1);
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);
  return n;
}

export default function TestimonialsHome1({ limit }) {
  const { testimonials: reviews } = useTestimonials(limit ? { limit } : {});
  const perView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, reviews.length - perView);
  const canScroll = reviews.length > perView;

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <section
      id="testimonials"
      className={`${SECTION_PY} bg-white overflow-x-clip scroll-mt-28`}
      aria-labelledby="home1-reviews-heading"
    >
      <div className={CONTAINER}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeader
            id="home1-reviews-heading"
            eyebrow="Customer reviews"
            title="Customer testimonials"
            description="Feedback from domestic and commercial clients across Nottingham."
            align="left"
            compact
          />
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={prev}
              disabled={!canScroll || index === 0}
              className="home1-nav-btn home1-nav-btn--ghost"
              aria-label="Previous testimonials"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canScroll || index >= maxIndex}
              className="home1-nav-btn home1-nav-btn--primary"
              aria-label="Next testimonials"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
          >
            {reviews.map((t) => (
              <article
                key={t.id}
                className="shrink-0 px-2.5"
                style={{ width: `${100 / perView}%` }}
              >
                <div className="home1-card h-full p-6 sm:p-7 flex flex-col min-h-[260px]">
                  <p className="text-[#F59E0B] text-sm tracking-wide mb-4" aria-hidden="true">
                    ★★★★★
                  </p>
                  <p className="text-[var(--home1-muted)] text-[14px] leading-relaxed flex-1 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--home1-border)]">
                    <TestimonialAvatar item={t} />
                    <div>
                      <p className="font-bold text-[var(--home1-text)] text-sm">{t.name}</p>
                      <p className="text-[var(--home1-muted)] text-xs">{t.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
