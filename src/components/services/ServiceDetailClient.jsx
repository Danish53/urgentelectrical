"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import ServiceCard from "@/components/services/ServiceCard";
import ServiceDetailStickyBar from "@/components/services/ServiceDetailStickyBar";
import SectionHeader from "@/components/home1/SectionHeader";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import { IconCalendar, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import {
  getStaticVariantById,
  STATIC_SERVICE_VARIANTS,
  STATIC_VARIANT_DEFAULT_ID,
  STATIC_VARIANT_PRICE_DISPLAY,
} from "@/data/serviceVariantsStatic";

function ServiceProductImage({ service }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="home1-service-product-media relative">
      {!failed ? (
        <Image
          src={service.image}
          alt={`${service.name} — electrical service Nottingham`}
          fill
          priority
          sizes="(max-width: 640px) 280px, 340px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold px-4 text-center text-lg"
          style={{ backgroundColor: service.color }}
        >
          {service.name}
        </div>
      )}
      {service.tag && (
        <span className="absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-[var(--home1-red)]">
          {service.tag}
        </span>
      )}
    </figure>
  );
}

function ServicePriceBar({ priceDisplay }) {
  return (
    <p className="home1-service-product-price-bar" role="status" aria-live="polite">
      {priceDisplay.type === "range" ? (
        <>
          <span className="home1-service-product-price-from">{priceDisplay.prefix}</span>
          <span className="home1-service-product-price-amounts">{priceDisplay.amounts}</span>
          <span className="home1-service-product-price-vat">{priceDisplay.suffix}</span>
        </>
      ) : (
        <>
          <span className="home1-service-product-price-amounts">{priceDisplay.amounts}</span>
          <span className="home1-service-product-price-vat">{priceDisplay.suffix}</span>
        </>
      )}
    </p>
  );
}

function ServiceVariantPicker({ variants, selectedId, onSelect, idPrefix = "main", theme = "light" }) {
  const labelId = `${idPrefix}-variant-label`;
  return (
    <div className={`home1-service-product-variants home1-service-product-variants--${theme}`}>
      <p id={labelId} className="home1-service-product-variants-label">
        Select a variant
      </p>
      <div className="home1-service-product-variant-list" role="group" aria-labelledby={labelId}>
        {variants.map((variant) => {
          const isActive = variant.id === selectedId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              className={`home1-service-product-variant${isActive ? " is-active" : ""}`}
              aria-pressed={isActive}
            >
              {variant.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ServiceSelectedPrice({ priceIncVat, theme = "light" }) {
  return (
    <p className={`home1-service-product-selected-price home1-service-product-selected-price--${theme}`} aria-live="polite">
      <strong>£{priceIncVat}</strong>
      <span>Inc. VAT</span>
    </p>
  );
}

function ServiceBookingButtons({ bookHref, compact = false }) {
  return (
    <div className={`home1-service-product-actions${compact ? " home1-service-product-actions--compact" : ""}`}>
      <Link href={bookHref} className="home1-service-product-btn home1-service-product-btn--book">
        <IconCalendar className="w-5 h-5 shrink-0" aria-hidden="true" />
        Book Now
      </Link>
      <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-service-product-btn home1-service-product-btn--call">
        <IconPhone className="w-5 h-5 shrink-0" aria-hidden="true" />
        Call Now
      </a>
    </div>
  );
}

function ServiceBookingBlock({
  service,
  selectedId,
  onSelectVariant,
  selectedVariant,
  idPrefix = "main",
  theme = "light",
  showStaticVariants = true,
}) {
  const price = selectedVariant?.priceIncVat ?? service.priceIncVat;

  return (
    <div className="home1-service-product-checkout">
      {showStaticVariants && (
        <ServiceVariantPicker
          variants={STATIC_SERVICE_VARIANTS}
          selectedId={selectedId}
          onSelect={onSelectVariant}
          idPrefix={idPrefix}
          theme={theme}
        />
      )}
      <ServiceSelectedPrice priceIncVat={price} theme={theme} />
      <ServiceBookingButtons bookHref={service.bookHref} />
    </div>
  );
}

function ServiceDetailProduct({ service, selectedId, onSelectVariant, selectedVariant, sectionRef }) {
  return (
    <section className="home1-service-product bg-white" aria-labelledby="service-detail-heading">
      <div className={`${CONTAINER} home1-service-product-inner`}>
        {/* <nav
          aria-label="Breadcrumb"
          className="home1-service-product-breadcrumb flex flex-wrap items-center gap-2 text-[12px] font-semibold text-[var(--home1-muted)] mb-5 sm:mb-6"
        >
          <Link href="/" className="hover:text-[var(--home1-red)] transition-colors">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/services" className="hover:text-[var(--home1-red)] transition-colors">
            Services
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--home1-text)]">{service.name}</span>
        </nav> */}

        <div className="home1-service-product-card">
          <div className="home1-service-product-grid">
            <ServiceProductImage service={service} />

            <div className="home1-service-product-panel min-w-0">
              <h1 id="service-detail-heading" className="home1-service-product-title">
                {service.name}
              </h1>

              <ServicePriceBar priceDisplay={STATIC_VARIANT_PRICE_DISPLAY} />

              <ServiceBookingBlock
                service={service}
                selectedId={selectedId}
                onSelectVariant={onSelectVariant}
                selectedVariant={selectedVariant}
                idPrefix="main"
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
      <div ref={sectionRef} className="home1-service-product-scroll-end" aria-hidden="true" />
    </section>
  );
}

function PricingCard({ service, selectedVariant, selectedId, onSelectVariant }) {
  return (
    <aside className="home1-service-detail-sidebar" aria-label="Book this service">
      {service.tag && (
        <span className="inline-block mb-4 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-[var(--home1-red)]">
          {service.tag}
        </span>
      )}

      <ServiceBookingBlock
        service={service}
        selectedId={selectedId}
        onSelectVariant={onSelectVariant}
        selectedVariant={selectedVariant}
        idPrefix="sidebar"
        theme="dark"
      />

      {/* <ul className="home1-service-detail-sidebar-trust">
        {["NICEIC approved", "12-month warranty", "Same-day booking"].map((t) => (
          <li key={t}>
            <IconCheck className="w-4 h-4 text-[#4ADE80] shrink-0" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul> */}
    </aside>
  );
}

function ServiceFaq({ faqs }) {
  const [openId, setOpenId] = useState(faqs[0]?.q ? 0 : -1);
  if (!faqs.length) return null;

  return (
    <div className="home1-service-detail-faq space-y-3">
      {faqs.map((item, i) => {
        const isOpen = openId === i;
        return (
          <div key={item.q} data-open={isOpen} className="home1-faq-item home1-card overflow-hidden">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? -1 : i)}
              className="home1-faq-trigger w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-[15px] text-[var(--home1-text)]"
              aria-expanded={isOpen}
            >
              <span className="pr-2">{item.q}</span>
              <span
                className={`text-[var(--home1-red)] text-xl shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-[14px] leading-relaxed text-[var(--home1-muted)] border-t border-[var(--home1-border)]">
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ServiceDetailClient({ service, related }) {
  const productSectionRef = useRef(null);
  const [selectedId, setSelectedId] = useState(STATIC_VARIANT_DEFAULT_ID);

  const selectedVariant = useMemo(
    () => getStaticVariantById(selectedId),
    [selectedId]
  );

  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <ServiceDetailStickyBar
        service={service}
        selectedId={selectedId}
        onSelectVariant={setSelectedId}
        selectedVariant={selectedVariant}
        observeRef={productSectionRef}
      />
      <main id="main-content" className="w-full min-w-0">
        <ServiceDetailProduct
          service={service}
          selectedId={selectedId}
          onSelectVariant={setSelectedId}
          selectedVariant={selectedVariant}
          sectionRef={productSectionRef}
        />

        <section className={`home1-service-detail-body bg-white ${SECTION_PY} !pt-0`}>
          <div className={CONTAINER}>
            <div className="grid lg:grid-cols-[1fr_350px] gap-10 lg:gap-12 items-start">
              <div className="min-w-0">
                <article className="home1-service-detail-block home1-service-detail-about">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--home1-text)] mb-4">About this service</h2>
                  <div className="space-y-3 text-[15px] leading-relaxed text-[var(--home1-muted)]">
                    {service.longDescription.map((para) => (
                      <p key={para.slice(0, 48)}>{para}</p>
                    ))}
                  </div>
                </article>

                {service.features.length > 0 && (
                  <section className="home1-service-detail-block" aria-labelledby="service-features-heading">
                    <h2 id="service-features-heading" className="text-xl font-extrabold text-[var(--home1-text)] mb-4">
                      Key benefits
                    </h2>
                    <ul className="home1-service-detail-list">
                      {service.features.map((f) => (
                        <li key={f}>
                          <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0 mt-0.5" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {service.faqs.length > 0 && (
                  <section className="home1-service-detail-block" aria-labelledby="service-faq-heading">
                    <h2 id="service-faq-heading" className="text-xl font-extrabold text-[var(--home1-text)] mb-4">
                      FAQs
                    </h2>
                    <ServiceFaq faqs={service.faqs} />
                  </section>
                )}
              </div>

              <div className="hidden lg:block min-w-0">
                <PricingCard
                  service={service}
                  selectedVariant={selectedVariant}
                  selectedId={selectedId}
                  onSelectVariant={setSelectedId}
                />
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface`}>
              <div className={CONTAINER}>
                <SectionHeader eyebrow="Related" title="You may also need" align="left" compact />
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
                  {related.map((s, i) => (
                    <li key={s.slug}>
                      <ServiceCard service={s} imagePriority={i === 0} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </MotionSection>
        )}

        <CTAHome1 bookHref="/#book" />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
