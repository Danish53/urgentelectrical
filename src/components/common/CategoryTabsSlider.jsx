"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function ChevronLeft({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * @param {{
 *   categories: Array<{ id: string, label: string }>,
 *   active: string,
 *   disabled?: boolean,
 *   onChange: (id: string) => void,
 *   layoutId: string,
 *   ariaLabel: string,
 * }} props
 */
export default function CategoryTabsSlider({
  categories,
  active,
  disabled = false,
  onChange,
  layoutId,
  ariaLabel,
}) {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const tabRefs = useRef(/** @type {Map<string, HTMLButtonElement>} */ (new Map()));
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const hasOverflow = canScrollLeft || canScrollRight;

  const updateScrollState = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    setCanScrollLeft(viewport.scrollLeft > 4);
    setCanScrollRight(viewport.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateScrollState();

    viewport.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(updateScrollState);
      observer.observe(viewport);
    }

    return () => {
      viewport.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      observer?.disconnect();
    };
  }, [categories, updateScrollState]);

  useEffect(() => {
    const activeTab = tabRefs.current.get(active);
    activeTab?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      inline: hasOverflow ? "center" : "nearest",
      block: "nearest",
    });
  }, [active, hasOverflow, reduceMotion]);

  function scrollTabs(direction) {
    const viewport = viewportRef.current;
    if (!viewport) return;

    viewport.scrollBy({
      left: direction * Math.max(viewport.clientWidth * 0.72, 220),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }

  return (
    <div
      className={`home1-category-tabs-slider${hasOverflow ? "" : " home1-category-tabs-slider--static"}`}
    >
      {hasOverflow ? (
        <button
          type="button"
          className="home1-category-tabs-slider__btn home1-category-tabs-slider__btn--prev"
          onClick={() => scrollTabs(-1)}
          disabled={disabled || !canScrollLeft}
          aria-label="Scroll categories left"
        >
          <ChevronLeft />
        </button>
      ) : null}

      <div ref={viewportRef} className="home1-category-tabs-slider__viewport">
        <div className="home1-category-tabs-slider__track" role="tablist" aria-label={ariaLabel}>
          {categories.map((cat) => {
            const isActive = active === cat.id;

            return (
              <button
                key={cat.id}
                ref={(node) => {
                  if (node) tabRefs.current.set(cat.id, node);
                  else tabRefs.current.delete(cat.id);
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={disabled}
                onClick={() => onChange(cat.id)}
                className={`home1-category-tabs-slider__tab${
                  isActive ? " home1-category-tabs-slider__tab--active" : ""
                }`}
              >
                {isActive && !reduceMotion ? (
                  <motion.span
                    layoutId={layoutId}
                    className="home1-category-tabs-slider__pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                ) : null}
                {isActive && reduceMotion ? (
                  <span className="home1-category-tabs-slider__pill" aria-hidden="true" />
                ) : null}
                <span className="home1-category-tabs-slider__label">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasOverflow ? (
        <button
          type="button"
          className="home1-category-tabs-slider__btn home1-category-tabs-slider__btn--next"
          onClick={() => scrollTabs(1)}
          disabled={disabled || !canScrollRight}
          aria-label="Scroll categories right"
        >
          <ChevronRight />
        </button>
      ) : null}
    </div>
  );
}
