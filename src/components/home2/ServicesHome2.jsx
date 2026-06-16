"use client";

import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices } from "@/hooks/useServices";
import ServicesSliderSkeleton from "@/components/skeletons/ServicesSliderSkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import Slider from "./Slider";
import AppImage from "@/components/common/AppImage";

function ServiceSlideCard({ service }) {
  const price = service.priceIncVat ?? service.price;

  return (
    <article className={`home2-service-slide ${service.tag ? "relative" : ""}`}>
      {service.tag ? (
        <span className="absolute top-3 right-3 z-10 bg-[var(--h2-red)] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
          {service.tag}
        </span>
      ) : null}
      <div className="home2-service-slide-image relative overflow-hidden">
        <AppImage
          src={service.image}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          fallback={
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm font-semibold px-4 text-center"
              style={{ backgroundColor: service.color }}
            >
              {service.name}
            </div>
          }
        />
      </div>
      <div className="home2-service-slide-body">
        <h3 className="font-bold text-[var(--h2-navy)] text-[15px] leading-snug mb-2 line-clamp-2 min-h-[2.75rem]">
          {service.name}
        </h3>
        <p className="text-2xl font-extrabold text-[var(--h2-red)]">£{price}</p>
        <p className="text-xs text-[var(--h2-muted)] mb-4">Inc. VAT · Fixed price</p>
        <Link
          href={service.bookHref ?? "/checkout"}
          className="home2-btn home2-btn--primary w-full mt-auto text-sm py-3"
        >
          Book now
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default function ServicesHome2() {
  const dispatch = useAppDispatch();
  const { bookable, loading, failed, error } = useBookableServices();

  return (
    <section
      id="home2-services"
      className="home2-section home2-section--surface overflow-x-clip scroll-mt-28"
      aria-labelledby="home2-services-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="home2-services-heading"
          eyebrow="Our services"
          title="Fixed-price electrical services"
          description="Browse our most popular jobs — transparent pricing, professional engineers, book online in minutes."
        />

        {loading ? (
          <ServicesSliderSkeleton count={3} />
        ) : failed ? (
          <ServicesLoadError message={error} onRetry={() => dispatch(fetchServices())} />
        ) : (
          <Slider perView={1} perViewMd={2} perViewLg={3} ariaLabel="Electrical services carousel">
            {bookable.map((s) => (
              <ServiceSlideCard key={s.id} service={s} />
            ))}
          </Slider>
        )}

        <p className="text-center text-[var(--h2-muted)] text-sm mt-8">
          Custom job? Call{" "}
          <a href="tel:01157780622" className="font-semibold text-[var(--h2-red)] hover:underline">
            0115 778 0622
          </a>
        </p>
      </div>
    </section>
  );
}
