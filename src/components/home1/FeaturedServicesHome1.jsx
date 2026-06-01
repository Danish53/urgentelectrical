"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { buildCheckoutHref } from "@/lib/checkoutHref";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices, useFeaturedServices } from "@/hooks/useServices";
import FeaturedServicesSkeleton from "@/components/skeletons/FeaturedServicesSkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconArrow } from "./icons";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { getDisplayPrice, getVatSuffix } from "@/lib/pricing";

const SLIDE_MS = 700;
const HOME_LIMIT = 4;

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

function resolveHref(serviceName, bookable) {
  const match = bookable.find((s) => s.name === serviceName);
  return match?.href ?? "/services";
}

function ServiceCardHome1({ service, detailHref, imagePriority = false }) {
  const [failed, setFailed] = useState(false);
  const { incVat } = useVatPreference();
  const priceExc = service.priceExcVat ?? service.price;
  const displayPrice = getDisplayPrice(priceExc, incVat);
  const vatLabel = getVatSuffix(incVat);
  const alt = `${service.name} — electrical service Nottingham`;

  return (
    <article className="home1-card home1-card-shine home1-service-card h-full flex flex-col overflow-hidden group">
      <Link href={detailHref} className="home1-service-media block shrink-0" aria-label={`View ${service.name}`}>
        {!failed ? (
          <Image
            src={service.image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 280px"
            className="object-cover"
            priority={imagePriority}
            loading={imagePriority ? undefined : "lazy"}
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm px-3 text-center"
            style={{ backgroundColor: service.color }}
          >
            {service.name}
          </div>
        )}
        {service.tag && <span className="home1-service-tag">{service.tag}</span>}
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <h3 className="font-bold text-[var(--home1-text)] text-[15px] leading-snug mb-2 line-clamp-2">
          <Link href={detailHref} className="hover:text-[var(--home1-red)] transition-colors">
            {service.name}
          </Link>
        </h3>
        <p className="text-2xl font-extrabold leading-none mb-0.5" style={{ color: "var(--home1-red)" }}>
          £{displayPrice}
        </p>
        <p className="text-[var(--home1-muted)] text-xs font-medium mb-4">{vatLabel} · Fixed price</p>

        <div className="home1-service-actions">
          <Link href={detailHref} className="home1-service-btn home1-service-btn--ghost">
            Details
          </Link>
          <Link href={buildCheckoutHref({ service: service.name })} className="home1-service-btn home1-service-btn--primary">
            Book now
            <IconArrow className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedServicesHome1({ compact = false }) {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const { bookable } = useBookableServices();
  const dispatch = useAppDispatch();
  const { services: featuredList, loading, failed } = useFeaturedServices({
    limit: compact ? HOME_LIMIT : undefined,
  });

  const services = featuredList;

  const maxIndex = Math.max(0, services.length - slidesPerView);
  const slidePct = 100 / slidesPerView;

  useEffect(() => setIndex((i) => Math.min(i, maxIndex)), [maxIndex]);
  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  return (
    <section
      id="services"
      className={`${SECTION_PY} bg-white overflow-x-clip scroll-mt-28`}
      aria-labelledby="home1-featured-heading"
    >
      <div className={CONTAINER}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeader
            id="home1-featured-heading"
            eyebrow="Our services"
            title={compact ? "Fixed-price electrical services" : "Popular fixed-price electrical jobs"}
            description={
              compact
                ? "Book online with transparent pricing — NICEIC approved engineers across Nottingham."
                : "Transparent pricing — select a service and book in minutes."
            }
            align="left"
            compact
          />
          {compact ? (
            <Link href="/services" className="home1-btn-primary text-sm py-3 px-5 shrink-0 sm:mb-2 w-fit">
              View all services
              <IconArrow className="w-4 h-4" />
            </Link>
          ) : (
            <div className="flex gap-2 shrink-0 sm:mb-2">
              <button type="button" onClick={goPrev} disabled={index === 0} className="home1-nav-btn home1-nav-btn--ghost" aria-label="Previous">
                ←
              </button>
              <button type="button" onClick={goNext} disabled={index >= maxIndex} className="home1-nav-btn home1-nav-btn--primary" aria-label="Next">
                →
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <FeaturedServicesSkeleton compact={compact} count={compact ? HOME_LIMIT : 3} />
        ) : failed ? (
          <ServicesLoadError onRetry={() => dispatch(fetchServices())} />
        ) : services.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-10">No services available right now.</p>
        ) : compact ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <ServiceCardHome1
                key={s.id}
                service={s}
                detailHref={resolveHref(s.name, bookable)}
                imagePriority={i < 2}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform ease-out"
              style={{ transform: `translateX(-${index * slidePct}%)`, transitionDuration: `${SLIDE_MS}ms` }}
            >
              {services.map((s, i) => (
                <div key={s.id} className="shrink-0 px-2.5" style={{ width: `${slidePct}%` }}>
                  <ServiceCardHome1 service={s} detailHref={resolveHref(s.name, bookable)} imagePriority={i === 0} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
