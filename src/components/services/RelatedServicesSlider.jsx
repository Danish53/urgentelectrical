"use client";

import { useState, useEffect, useCallback } from "react";
import ServiceCard from "@/components/services/ServiceCard";
import { useCarouselSwipe } from "@/hooks/useCarouselSwipe";

const SLIDE_MS = 600;
const DESKTOP_BP = 1024;

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

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      setSlidesPerView(window.innerWidth >= DESKTOP_BP ? 3 : 1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

function SliderArrow({ direction, onClick, disabled }) {
  const label = direction === "prev" ? "Previous related service" : "Next related service";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`home1-related-slider__btn home1-related-slider__btn--${direction}`}
      aria-label={label}
    >
      {direction === "prev" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

export default function RelatedServicesSlider({ services }) {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, services.length - slidesPerView);
  const slidePct = 100 / slidesPerView;
  const canSlide = services.length > slidesPerView;

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const { onTouchStart, onTouchEnd } = useCarouselSwipe({
    onPrev: goPrev,
    onNext: goNext,
    enabled: canSlide,
  });

  if (!services?.length) return null;

  return (
    <div className="home1-related-slider" aria-roledescription="carousel" aria-label="Related services">
      <div className="home1-related-slider__stage">
        {canSlide ? (
          <>
            <SliderArrow direction="prev" onClick={goPrev} disabled={index === 0} />
            <SliderArrow direction="next" onClick={goNext} disabled={index >= maxIndex} />
          </>
        ) : null}

        <div
          className="home1-related-slider__viewport home1-featured-slider__viewport"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <ul
            className="home1-related-slider__track"
            style={{
              transform: `translateX(-${index * slidePct}%)`,
              transitionDuration: `${SLIDE_MS}ms`,
            }}
          >
            {services.map((service, i) => (
              <li key={service.slug} className="home1-related-slider__slide" style={{ width: `${slidePct}%` }}>
                <ServiceCard service={service} imagePriority={i === 0 && index === 0} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {canSlide && maxIndex > 0 ? (
        <div className="home1-related-slider__dots" role="tablist" aria-label="Related service slides">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`home1-related-slider__dot${i === index ? " is-active" : ""}`}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
