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
import { SECTION_PY, SERVICE_DETAIL_CONTAINER } from "@/components/home1/constants";
import { IconCalendar, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import {
  getStaticVariantById,
  STATIC_SERVICE_VARIANTS,
  STATIC_VARIANT_DEFAULT_ID,
  buildStaticVariantPriceDisplay,
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
          sizes="(max-width: 1023px) 100vw, 400px"
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
    </figure>
  );
}

function ServicePriceBar({ priceDisplay }) {
  const ariaLabel = priceDisplay.label ?? `${priceDisplay.amounts} ${priceDisplay.suffix ?? ""}`.trim();

  return (
    <div className="p-0" role="status" aria-label={ariaLabel} aria-live="polite">
      <span className="home1-service-product-price-amounts p-0 m-0">{priceDisplay.amounts}</span>
      {priceDisplay.suffix ? (
        <span className="home1-service-product-price-vat ml-2 text-xs text-gray-500">{priceDisplay.suffix}</span>
      ) : null}
    </div>
  );
}

function ServiceVariantPicker({ variants, selectedId, onSelect, idPrefix = "main", theme = "light" }) {
  const labelId = `${idPrefix}-variant-label`;
  return (
    <div className={`home1-service-product-variants home1-service-product-variants--${theme}`}>
      <p id={labelId} className="home1-service-product-variants-label">
        Choose your Variant
      </p>
      <div className="home1-service-product-variant-list mt-2" role="group" aria-labelledby={labelId}>
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

const TRUST_PILLS = ["NICEIC approved", "Fixed pricing", "12-month warranty"];

function ServiceTrustStrip({ theme = "light", className = "" }) {
  return (
    <ul
      className={`home1-service-trust-strip home1-service-trust-strip--${theme}${className ? ` ${className}` : ""}`}
    >
      {TRUST_PILLS.map((item) => (
        <li key={item}>
          <IconCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function ServiceSelectedPrice({ priceIncVat, theme = "light", variantLabel }) {
  return (
    <div className={`home1-service-selected-price-card my-4 home1-service-selected-price-card--${theme}`} aria-live="polite">
      <div className="home1-service-selected-price-card-top">
        <span className="home1-service-selected-price-label">
          {variantLabel ? `Selected · ${variantLabel}` : "Your price"}
        </span>
        <span className="home1-service-selected-price-vat">Inc. VAT</span>
      </div>
      <p className="home1-service-selected-price-value">
        <strong>£{priceIncVat}</strong>
      </p>
    </div>
  );
}

function ServiceBookingButtons({ bookHref, compact = false, variant = "default" }) {
  return (
    <div
      className={`home1-service-product-actions${compact ? " home1-service-product-actions--compact" : ""}${variant === "hero" ? " home1-service-product-actions--hero" : ""}`}
    >
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
  showButtons = true,
  variantsScrollable = false,
}) {
  const price = selectedVariant?.priceIncVat ?? service.priceIncVat;

  return (
    <div
      className={`home1-service-product-checkout${variantsScrollable ? " home1-service-product-checkout--scroll-variants" : ""}`}
    >
      {showStaticVariants && (
        <div className={variantsScrollable ? "home1-service-hero-variants-scroll" : undefined}>
          <ServiceVariantPicker
            variants={STATIC_SERVICE_VARIANTS}
            selectedId={selectedId}
            onSelect={onSelectVariant}
            idPrefix={idPrefix}
            theme={theme}
          />
        </div>
      )}
      <ServiceSelectedPrice
        priceIncVat={price}
        theme={theme}
        variantLabel={selectedVariant?.label}
      />
      {showButtons && <ServiceBookingButtons bookHref={service.bookHref} />}
    </div>
  );
}

function ServiceDetailSection({ id, number, title, subtitle, children, className = "" }) {
  return (
    <section
      id={id}
      className={`home1-service-detail-section ${className}`.trim()}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <header className="home1-service-detail-section-head">
        <span className="home1-service-detail-section-num" aria-hidden="true">
          {number}
        </span>
        <div className="home1-service-detail-section-titles p-0 m-0">
          <h2 id={id ? `${id}-heading` : undefined} className="home1-service-detail-section-title">
            {title}
          </h2>
          {subtitle && <p className="home1-service-detail-section-subtitle">{subtitle}</p>}
        </div>
      </header>
      <div className="home1-service-detail-section-body">{children}</div>
    </section>
  );
}

function buildContentSections(service) {
  const items = [
    {
      id: "about",
      title: "About this service",
      subtitle: "What we do and who this is for",
      className: "home1-service-detail-about",
      render: () => (
        <div className="home1-service-detail-prose">
          {service.longDescription.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
      ),
    },
  ];

  if (service.includes.length > 0) {
    items.push({
      id: "included",
      title: "What's included",
      subtitle: "Clear scope with no hidden extras",
      className: "home1-service-detail-includes-section",
      render: () => (
        <>
          <ul className="home1-service-detail-includes">
            {service.includes.map((item) => (
              <li key={item} className="home1-service-detail-include-item">
                <span className="home1-service-detail-include-icon" aria-hidden="true">
                  <IconCheck className="w-3.5 h-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (service.features.length > 0) {
    items.push({
      id: "benefits",
      title: "Key benefits",
      subtitle: "Outcomes you can expect from this service",
      render: () => (
        <ul className="home1-service-detail-list">
          {service.features.map((f) => (
            <li key={f}>
              <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0 mt-0.5" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      ),
    });
  }

  if (service.faqs.length > 0) {
    items.push({
      id: "faqs",
      title: "Frequently asked questions",
      subtitle: "Common questions before you book",
      render: () => <ServiceFaq faqs={service.faqs} />,
    });
  }

  return items.map((item, index) => ({
    ...item,
    number: String(index + 1).padStart(2, "0"),
  }));
}

function ServiceDetailJumpNav({ sections }) {
  if (sections.length < 2) return null;

  const labels = {
    about: "Overview",
    included: "Included",
    benefits: "Benefits",
    faqs: "FAQs",
  };

  return (
    <nav className="home1-service-detail-jump" aria-label="On this page">
      <span className="home1-service-detail-jump-label">On this page</span>
      <ul className="home1-service-detail-jump-list">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>{labels[s.id] ?? s.title}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ServiceDetailProduct({ service, selectedId, onSelectVariant, selectedVariant, sectionRef }) {
  const priceDisplay = buildStaticVariantPriceDisplay();

  return (
    <section className="home1-service-product" aria-labelledby="service-detail-heading">
      <div className="home1-service-product-bg" aria-hidden="true" />
      <div className={`${SERVICE_DETAIL_CONTAINER} home1-service-product-inner`}>

        <div className="home1-service-hero-card">
          <div className="home1-service-hero-card-grid">
            <div className="home1-service-hero-content min-w-0">
              <div className="home1-service-hero-meta">
                <span className="home1-service-product-category">{service.categoryLabel}</span>
                {service.tag && (
                  <span className="home1-service-hero-tag">{service.tag}</span>
                )}
                <span className="home1-service-hero-availability">
                  <span className="home1-service-hero-availability-dot" aria-hidden="true" />
                  Same-day slots
                </span>
              </div>

              <h1 id="service-detail-heading" className="home1-service-hero-title">
                {service.name}
              </h1>

              <p className="home1-service-hero-lead">{service.description}</p>

              <div className="home1-service-hero-price-row">
                <div className="home1-service-hero-price-block">
                  <span className="home1-service-hero-price-label">Starting from</span>
                  <ServicePriceBar priceDisplay={priceDisplay} />
                </div>
              </div>

              <div className="home1-service-hero-book-panel">
                <ServiceBookingBlock
                  service={service}
                  selectedId={selectedId}
                  onSelectVariant={onSelectVariant}
                  selectedVariant={selectedVariant}
                  idPrefix="main"
                  theme="light"
                  showButtons
                />
              </div>
            </div>

            <div className="home1-service-hero-image-col">
              <div className="home1-service-hero-image-stack">
                <div className="home1-service-hero-media-frame">
                  <div className="home1-service-hero-media-glow" aria-hidden="true" />
                  <div className="home1-service-product-media-wrap">
                    <ServiceProductImage service={service} />
                  </div>
                </div>
                <ServiceTrustStrip theme="light" className="home1-service-hero-trust-below" />
              </div>
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
      <div className="home1-service-sidebar-head">
        <p className="home1-service-detail-sidebar-label">Quick book</p>
        <h3 className="home1-service-sidebar-title">Book this service</h3>
        {service.tag && <span className="home1-service-detail-sidebar-tag">{service.tag}</span>}
      </div>

      <div className="home1-service-sidebar-panel">
        <ServiceBookingBlock
          service={service}
          selectedId={selectedId}
          onSelectVariant={onSelectVariant}
          selectedVariant={selectedVariant}
          idPrefix="sidebar"
          theme="dark"
          showButtons
        />
      </div>

      <p className="home1-service-sidebar-foot">Secure booking · Same-day slots where available</p>
    </aside>
  );
}

function ServiceFaq({ faqs }) {
  const [openId, setOpenId] = useState(faqs[0]?.q ? 0 : -1);
  if (!faqs.length) return null;

  return (
    <div className="home1-service-detail-faq">
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

  const contentSections = useMemo(() => buildContentSections(service), [service]);

  return (
    <div className="home1-page home1-service-detail-page w-full min-w-0">
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

        <section className="home1-service-detail-body p-0" aria-label="Service information">
          <div className="home1-service-detail-body-bg" aria-hidden="true" />
          <div className={SERVICE_DETAIL_CONTAINER}>
            <ServiceDetailJumpNav sections={contentSections} />

            <div className="home1-service-detail-layout">
              <div className="home1-service-detail-main min-w-0">
                {contentSections.map((section) => (
                  <ServiceDetailSection
                    key={section.id}
                    id={section.id}
                    number={section.number}
                    title={section.title}
                    subtitle={section.subtitle}
                    className={section.className ?? ""}
                  >
                    {section.render()}
                  </ServiceDetailSection>
                ))}
              </div>

              <aside className="home1-service-detail-aside min-w-0" aria-label="Book this service">
                <PricingCard
                  service={service}
                  selectedVariant={selectedVariant}
                  selectedId={selectedId}
                  onSelectVariant={setSelectedId}
                />
              </aside>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface pt-0`}>
              <div className={SERVICE_DETAIL_CONTAINER}>
                <SectionHeader eyebrow="Related" className="pb-3" title="You may also need" align="left" compact />
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
