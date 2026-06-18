"use client";

import { useState, useEffect, useCallback } from "react";
import { useTestimonials } from "@/hooks/useTestimonials";
import TestimonialAvatar from "@/components/testimonials/TestimonialAvatar";
import { CONTAINER } from "@/components/home1/constants";

const SECTION_CONTAINER = CONTAINER;
const BG = "#e1e6e4";
const NAVY = "#1e293b";
const RED = "#e64a19";
const SLIDE_MS = 900;

function Stars() {
  return (
    <span className="text-[#f5b800] text-base tracking-tight shrink-0" aria-hidden="true">
      ★★★★★
    </span>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" aria-hidden="true">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TestimonialCard({ item }) {
  return (
    <article className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 sm:p-7 h-full flex flex-col min-h-[280px]">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <TestimonialAvatar item={item} className="w-11 h-11 sm:w-12 sm:h-12" rounded="rounded-full" />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-[#e0e0e0] flex items-center justify-center text-[8px]"
              style={{ color: RED }}
              aria-hidden="true"
            >
              ★
            </span>
          </div>
          <p className="font-bold text-[#1a1a1a] text-[15px] sm:text-base truncate">{item.name}</p>
        </div>
        <Stars />
      </div>

      <blockquote className="flex-1 mb-6">
        <p className="text-[#4a4a4a] text-[14px] sm:text-[15px] leading-[1.7] italic">
          &ldquo;{item.text}&rdquo;
        </p>
      </blockquote>

      <p className="text-[#9ca3af] text-[12px] sm:text-[13px] text-right mt-auto">{item.date}</p>
    </article>
  );
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

export default function TestimonialsSection() {
  const { testimonials } = useTestimonials();
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, testimonials.length - slidesPerView);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(maxIndex, i + 1));
  }, [maxIndex]);

  const slideWidthPercent = 100 / slidesPerView;

  return (
    <section
      className="py-14 sm:py-16 lg:py-20"
      style={{ backgroundColor: BG }}
      aria-labelledby="testimonials-heading"
    >
      <div className={`${SECTION_CONTAINER} text-center`}>
        <p className="text-[#5a5a5a] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3">
          Testimonials
        </p>
        <h2
          id="testimonials-heading"
          className="font-bold text-[28px] sm:text-[34px] lg:text-[38px] leading-tight mb-10 sm:mb-12"
          style={{ color: NAVY }}
        >
          Hear From Our Customers
        </h2>

        <div className="relative px-10 sm:px-12 lg:px-14">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="testimonial-nav-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous testimonials"
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={index >= maxIndex}
            className="testimonial-nav-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next testimonials"
          >
            <ChevronRight />
          </button>

          <div className="overflow-hidden">
            <div
              className="testimonial-slider-track flex ease-in-out text-left"
              style={{
                transform: `translateX(-${index * slideWidthPercent}%)`,
                transitionDuration: `${SLIDE_MS}ms`,
              }}
            >
              {testimonials.map((item) => (
                <div
                  key={item.id}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 mt-8 sm:mt-10" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(Math.min(i, maxIndex))}
              className={`rounded-full transition-all duration-500 ease-in-out ${
                i === index ? "w-2.5 h-2.5 bg-[#2563eb]" : "w-2 h-2 bg-[#c5cec9] hover:bg-[#9ca3af]"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-selected={i === index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
