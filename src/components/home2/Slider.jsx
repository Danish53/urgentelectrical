"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * @param {{
 *   children: React.ReactNode[];
 *   perView?: number;
 *   perViewMd?: number;
 *   perViewLg?: number;
 *   gap?: number;
 *   ariaLabel?: string;
 *   showDots?: boolean;
 * }} props
 */
export default function Slider({
  children,
  perView = 1,
  perViewMd = 2,
  perViewLg = 3,
  gap = 16,
  ariaLabel = "Carousel",
  showDots = true,
}) {
  const slides = Array.isArray(children) ? children : [children];
  const [per, setPer] = useState(perView);
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, slides.length - per);
  const slidePct = 100 / per;

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setPer(perViewLg);
      else if (w >= 640) setPer(perViewMd);
      else setPer(perView);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [perView, perViewMd, perViewLg]);

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  const pages = maxIndex + 1;

  return (
    <div className="home2-slider" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="flex items-center justify-end gap-2 mb-5">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="home2-slider-btn home2-slider-btn--ghost"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={index >= maxIndex}
          className="home2-slider-btn home2-slider-btn--primary"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * slidePct}%)`,
            gap: 0,
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="shrink-0 box-border"
              style={{ width: `${slidePct}%`, paddingLeft: gap / 2, paddingRight: gap / 2 }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showDots && pages > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Slide pages">
          {Array.from({ length: pages }).map((_, p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={index === p}
              aria-label={`Go to slide ${p + 1}`}
              onClick={() => setIndex(p)}
              className={`home2-slider-dot ${index === p ? "home2-slider-dot--active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
