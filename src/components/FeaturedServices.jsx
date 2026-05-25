"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useFeaturedServices } from "@/hooks/useServices";
import FeaturedServicesSkeleton from "@/components/skeletons/FeaturedServicesSkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const BRAND_RED = "#E32B2B";
const NAVY = "#2D3748";
const SLIDE_MS = 900;

function ChevronLeft() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
      <path d="M2 3h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 00.9-.6L20 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ServiceImage({ service }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-[140px] sm:h-[152px] rounded-xl mb-4 shrink-0 overflow-hidden">
      {!failed && (
        <img
          src={service.image}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${failed ? "flex" : "hidden"}`}
        style={{ backgroundColor: service.color }}
        aria-hidden={!failed}
      >
        <span className="text-white text-xs font-semibold tracking-wide">Your image here</span>
        <span className="text-white/70 text-[10px] px-2 text-center">{service.image}</span>
      </div>
    </div>
  );
}

function SliderNavButton({ direction, onClick, disabled }) {
  const label = direction === "prev" ? "Previous services" : "Next services";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`featured-nav-btn absolute top-1/2 z-30 disabled:opacity-35 disabled:cursor-not-allowed ${
        direction === "prev" ? "left-0 sm:-left-1" : "right-0 sm:-right-1"
      }`}
      aria-label={label}
    >
      {direction === "prev" ? <ChevronLeft /> : <ChevronRight />}
    </button>
  );
}

function ServiceCard({ service }) {
  const price = service.priceIncVat;

  return (
    <article className="featured-service-card group relative flex h-full min-h-[400px] flex-col rounded-2xl border border-[#E32B2B] bg-white p-4 sm:p-5 cursor-pointer overflow-hidden transition-all duration-500 ease-out delay-0 hover:delay-150 hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(227,43,43,0.14)]">
      <span
        className="featured-service-card-border absolute top-0 left-0 right-0 h-[4px] z-10 rounded-t-2xl pointer-events-none bg-[#E32B2B]"
        aria-hidden="true"
      />

      {service.tag && (
        <span className="absolute top-3 right-3 z-20 bg-[#E32B2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
          {service.tag}
        </span>
      )}

      <ServiceImage service={service} />

      <h3 className="font-bold text-[#1a1a1a] text-[15px] sm:text-base leading-snug mb-2 line-clamp-3">
        {service.name}
      </h3>

      <p className="text-[#9ca3af] text-sm mb-5">
        £{price} <span className="text-[#6b7280]">Inc VAT</span>
      </p>

      <div className="mt-auto flex gap-2 items-stretch">
        <a
          href="/checkout"
          className="featured-btn-select flex-1 flex items-center justify-center bg-[#E32B2B] hover:bg-[#c42424] text-white font-semibold text-sm rounded-lg transition-colors duration-300"
        >
          Select Option
        </a>
        <a
          href="/checkout"
          className="featured-btn-cart w-12 shrink-0 flex items-center justify-center bg-[#E32B2B] hover:bg-[#c42424] rounded-lg transition-colors duration-300"
          aria-label={`Add ${service.name} to booking`}
        >
          <CartIcon />
        </a>
      </div>
    </article>
  );
}

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setSlidesPerView(4);
      else if (window.innerWidth >= 768) setSlidesPerView(2);
      else setSlidesPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

export default function FeaturedServices() {
  const dispatch = useAppDispatch();
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const { services, loading, failed } = useFeaturedServices();

  const maxIndex = Math.max(0, services.length - slidesPerView);

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
      className="bg-[#f5f5f5] py-14 sm:py-16 lg:py-20 overflow-x-clip"
      aria-labelledby="featured-services-heading"
    >
      <div className={SECTION_CONTAINER}>
        <h2
          id="featured-services-heading"
          className="font-sans text-[26px] sm:text-[30px] lg:text-[32px] font-bold mb-8 sm:mb-10"
          style={{ color: NAVY }}
        >
          Featured Services
        </h2>

        {loading ? (
          <FeaturedServicesSkeleton count={4} />
        ) : failed ? (
          <ServicesLoadError onRetry={() => dispatch(fetchServices())} />
        ) : (
          <div className="relative px-8 sm:px-10 lg:px-12">
            <SliderNavButton direction="prev" onClick={goPrev} disabled={index === 0} />
            <SliderNavButton direction="next" onClick={goNext} disabled={index >= maxIndex} />

            <div className="overflow-hidden min-w-0">
              <div
                className="featured-slider-track flex ease-in-out"
                style={{
                  transform: `translateX(-${index * slideWidthPercent}%)`,
                  transitionDuration: `${SLIDE_MS}ms`,
                }}
              >
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="shrink-0 px-2 sm:px-2.5"
                    style={{ width: `${slideWidthPercent}%` }}
                  >
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && !failed && services.length > 0 ? (
        <div className="flex justify-center gap-2 mt-6 md:hidden" role="tablist" aria-label="Service slides">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                i === index ? "w-6 bg-[#E32B2B]" : "w-2 bg-[#d1d5db]"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-selected={i === index}
            />
          ))}
        </div>
        ) : null}
      </div>
    </section>
  );
}
