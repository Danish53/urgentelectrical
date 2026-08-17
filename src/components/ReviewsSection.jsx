"use client";

import { useState, useEffect, useCallback } from "react";
import { CUSTOMER_REVIEWS, REVIEWS_RATING } from "@/data/reviews";
import { CONTAINER } from "@/components/home1/constants";

const SECTION_CONTAINER = CONTAINER;
const DARK = "#1a1a1a";
const RED = "#d32f2f";
const SLIDE_MS = 900;

function Stars({ className = "text-[#f5b800]", size = "text-lg" }) {
  return (
    <span className={`inline-flex gap-0.5 ${size} ${className}`} aria-hidden="true">
      {"★★★★★".split("").map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </span>
  );
}

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" aria-hidden="true">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="bg-white rounded-lg shadow-[0_2px_14px_rgba(0,0,0,0.07)] px-7 sm:px-9 py-8 sm:py-10 h-full flex flex-col min-h-[260px]">
      <Stars />
      <blockquote className="mt-4 sm:mt-5 mb-6 sm:mb-8 flex-1">
        <p className="text-[#333333] text-[15px] sm:text-[16px] leading-[1.7] italic">
          &ldquo;{review.text}&rdquo;
        </p>
      </blockquote>
      <footer>
        <cite className="not-italic font-bold text-[#1a1a1a] text-[15px] sm:text-base">{review.name}</cite>
      </footer>
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

export default function ReviewsSection() {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, CUSTOMER_REVIEWS.length - slidesPerView);

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
    <section aria-labelledby="reviews-section-heading">
      {/* Dark header */}
      <div style={{ backgroundColor: DARK }}>
        <div className={`${SECTION_CONTAINER} py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
          <h2
            id="reviews-section-heading"
            className="text-white text-[15px] sm:text-base font-bold uppercase tracking-[0.08em]"
          >
            What Our Customers Say
          </h2>
          <div className="flex items-center gap-2.5">
            <Stars className="text-white/90 text-sm" size="text-sm" />
            <span className="text-white/90 text-[13px] sm:text-sm font-medium">
              {REVIEWS_RATING.score} — {REVIEWS_RATING.count} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Carousel area */}
      <div className="bg-[#f5f5f5] relative py-10 sm:py-12 lg:py-14 pb-14 sm:pb-16">
        <div className={`${SECTION_CONTAINER} relative`}>
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="reviews-nav-btn absolute left-0 sm:left-2 lg:-left-2 top-1/2 -translate-y-1/2 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous reviews"
          >
            <ChevronLeft />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={index >= maxIndex}
            className="reviews-nav-btn absolute right-0 sm:right-2 lg:-right-2 top-1/2 -translate-y-1/2 z-20 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next reviews"
          >
            <ChevronRight />
          </button>

          <div className="overflow-hidden mx-10 sm:mx-12 lg:mx-14">
            <div
              className="reviews-slider-track flex ease-in-out"
              style={{
                transform: `translateX(-${index * slideWidthPercent}%)`,
                transitionDuration: `${SLIDE_MS}ms`,
              }}
            >
              {CUSTOMER_REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="shrink-0 px-2 sm:px-3"
                  style={{ width: `${slideWidthPercent}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center items-center gap-2.5 mt-8 sm:mt-10" role="group" aria-label="Review slides">
            {CUSTOMER_REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(Math.min(i, maxIndex))}
                className={`rounded-full transition-all duration-500 ease-in-out ${
                  i === index ? "w-2.5 h-2.5 bg-[#2563eb]" : "w-2 h-2 bg-[#d1d5db] hover:bg-[#9ca3af]"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Dark footer strip */}
      <div style={{ backgroundColor: DARK }}>
        <div className={`${SECTION_CONTAINER} py-5 sm:py-6 text-center`}>
          <p className="text-white text-[13px] sm:text-sm font-bold uppercase tracking-[0.1em]">
            Your Local Electrician in Nottingham
          </p>
        </div>
      </div>
    </section>
  );
}
