"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import RelatedServicesSlider from "@/components/services/RelatedServicesSlider";
import SectionHeader from "@/components/home1/SectionHeader";
import { SECTION_PY, SERVICE_DETAIL_CONTAINER } from "@/components/home1/constants";
import { IconCalendar, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { buildCheckoutHref } from "@/lib/checkoutHref";
import { getVariantById } from "@/lib/services/buildBookableServiceFromDetail";
import {
  formatGbpDisplay,
  formatGbpFromExc,
  getDisplayPrice,
  getVatSuffix,
} from "@/lib/pricing";

function ServiceProductImage({ service, fit = "cover" }) {
  const [failed, setFailed] = useState(false);
  const objectClass = fit === "contain" ? "object-contain" : "object-cover";

  return (
    <figure
      className={`home1-service-product-media relative${fit === "contain" ? " home1-service-product-media--contain" : ""}`}
    >
      {!failed ? (
        <Image
          src={service.image}
          alt={`${service.name} — electrical service Nottingham`}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 400px"
          className={objectClass}
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

const SLIM_FOOTER_TRUST = ["Fully insured", "NICEIC approved", "Secure booking", "365 days a year"];

const SLIM_ASIDE_TRUST_BADGES = ["Fully insured", "NICEIC certified", "~45 min ETA", "UK-wide cover"];

function ServiceSlimPriceRibbon({ priceDisplay, incVat, isEmergency }) {
  const vatLabel = getVatSuffix(incVat);

  let startExc = priceDisplay.amount ?? priceDisplay.min;
  let endExc = priceDisplay.max;

  if (priceDisplay.type === "range" && priceDisplay.min != null && priceDisplay.max != null) {
    startExc = priceDisplay.min;
    endExc = priceDisplay.max;
  }

  const startText = formatGbpFromExc(startExc, incVat, { trimZeros: true });
  const endText =
    priceDisplay.type === "range" && endExc != null
      ? formatGbpDisplay(getDisplayPrice(endExc, incVat))
      : null;

  const ariaLabel =
    priceDisplay.type === "range" && endText
      ? `FROM ${startText} – ${endText} ${vatLabel}`
      : `${startText} ${vatLabel}`;

  return (
    <div className="home1-service-slim-price-ribbon" role="status" aria-live="polite" aria-label={ariaLabel}>
      <div className="home1-service-slim-price-ribbon-main">
        <span className="home1-service-slim-price-from-label">{priceDisplay.prefix ?? "FROM"}</span>
        <div className="flex items-center gap-2">
        <div className="home1-service-slim-price-line text-2xl font-bold">
          <span className="home1-service-selected-price-vat text-2xl font-bold">{startText}</span>
          {endText ? <span className="home1-service-selected-price-vat text-2xl font-bold"> – {endText}</span> : null}
        </div>
        <span className="home1-service-slim-price-vat">{vatLabel}</span>
        </div>
      </div>
      <div className="home1-service-slim-price-ribbon-meta">
        <span className="home1-service-slim-eta-pill">{isEmergency ? "~45 min response" : "Same-day slots"}</span>
        <span className="home1-service-slim-eta-pill">No callout fee</span>
      </div>
    </div>
  );
}

function ServiceSlimHeroImage({ service }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="home1-service-slim-figure">
      {!failed ? (
        <Image
          src={service.image}
          alt={`${service.name} — electrical service Nottingham`}
          width={640}
          height={480}
          priority
          sizes="(max-width: 899px) 100vw, (min-width: 900px) 380px, 34vw"
          className="home1-service-slim-img"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="home1-service-slim-img-fallback"
          style={{ backgroundColor: service.color }}
        >
          {service.name}
        </div>
      )}
    </figure>
  );
}

function ServiceSlimAsideFill() {
  return (
    <div className="home1-service-slim-aside-fill" aria-label="Why choose us">
      <div className="home1-service-slim-aside-fill-bg" aria-hidden="true" />
      <div className="home1-service-slim-aside-fill-content">
        <ul className="home1-service-slim-trust-grid">
          {SLIM_ASIDE_TRUST_BADGES.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ServiceSlimHeroAside({ service }) {
  return (
    <div className="home1-service-slim-aside" style={{paddingRight: '0px'}}>
      <div className="home1-service-slim-media-box">
        <ServiceSlimHeroImage service={service} />
      </div>
      <ServiceSlimAsideFill />
    </div>
  );
}

function ServiceVariantPicker({
  variants,
  selectedId,
  onSelect,
  idPrefix = "main",
  theme = "light",
  label = "Choose your Variant",
  className = "",
}) {
  const labelId = `${idPrefix}-variant-label`;
  return (
    <div className={`home1-service-product-variants home1-service-product-variants--${theme}${className ? ` ${className}` : ""}`}>
      <p id={labelId} className="home1-service-product-variants-label">
        {label}
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

function ServiceSelectedPrice({ priceExcVat, incVat, theme = "light", variantLabel, className = "" }) {
  const displayAmount = getDisplayPrice(priceExcVat, incVat);

  return (
    <div
      aria-live="polite"
    >
      <p className="home1-service-selected-price-value flex items-end gap-2">
        <strong>{formatGbpDisplay(displayAmount)}</strong>
        <span className="home1-service-slim-price-vat">{getVatSuffix(incVat)}</span>
      </p>
    </div>
  );
}

function ServiceBookingButtons({ onBook, bookHref, compact = false, variant = "default" }) {
  return (
    <div
      className={`home1-service-product-actions${compact ? " home1-service-product-actions--compact" : ""}${variant === "hero" ? " home1-service-product-actions--hero" : ""}${variant === "slim" ? " home1-service-product-actions--slim" : ""}`}
    >
      {onBook ? (
        <button type="button" onClick={onBook} className="home1-service-product-btn home1-service-product-btn--book">
          <IconCalendar className="w-5 h-5 shrink-0" aria-hidden="true" />
          Book Now
        </button>
      ) : (
        <Link href={bookHref} className="home1-service-product-btn home1-service-product-btn--book">
          <IconCalendar className="w-5 h-5 shrink-0" aria-hidden="true" />
          Book Now
        </Link>
      )}
      <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-service-product-btn home1-service-product-btn--call">
        <IconPhone className="w-5 h-5 shrink-0" aria-hidden="true" />
        Call Now
      </a>
    </div>
  );
}

function ServiceBookingBlock({
  service,
  variants,
  selectedId,
  onSelectVariant,
  selectedVariant,
  onBook,
  variantError,
  idPrefix = "main",
  theme = "light",
  showVariants = true,
  showButtons = true,
  variantsScrollable = false,
}) {
  const { incVat } = useVatPreference();
  const variantOptions = variants ?? service.variants ?? [];

  return (
    <div
      className={`home1-service-product-checkout${variantsScrollable ? " home1-service-product-checkout--scroll-variants" : ""}`}
    >
      {showVariants && variantOptions.length > 0 ? (
        <div className={variantsScrollable ? "home1-service-hero-variants-scroll" : undefined}>
          <ServiceVariantPicker
            variants={variantOptions}
            selectedId={selectedId}
            onSelect={(id) => {
              onSelectVariant(id);
            }}
            idPrefix={idPrefix}
            theme={theme}
          />
          {variantError ? (
            <p className="home1-service-variant-error" role="alert">
              {variantError}
            </p>
          ) : null}
        </div>
      ) : null}
      {selectedVariant ? (
        <ServiceSelectedPrice
          priceExcVat={selectedVariant.priceExcVat ?? selectedVariant.price}
          incVat={incVat}
          theme={theme}
          variantLabel={selectedVariant.label}
        />
      ) : null}
      {showButtons && <ServiceBookingButtons onBook={onBook} bookHref={service.bookHref} />}
    </div>
  );
}

function ServiceDetailSection({ id, number, title, subtitle, children, className = "" }) {
  const headingId = id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      className={`home1-service-detail-section ${className}`.trim()}
      aria-labelledby={headingId}
    >
      <header className="home1-service-detail-section-head">
        {number ? (
          <span className="home1-service-detail-section-num" aria-hidden="true">
            {number}
          </span>
        ) : null}
        <div className="home1-service-detail-section-titles">
          <h2 id={headingId} className="home1-service-detail-section-title">
            {title}
          </h2>
          {subtitle ? <p className="home1-service-detail-section-subtitle">{subtitle}</p> : null}
        </div>
      </header>
      <div className="home1-service-detail-section-body">{children}</div>
    </section>
  );
}

function buildContentSections(service) {
  const items = [];

  if (service.longDescription?.length) {
    items.push({
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
    });
  }

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

function ServiceDetailProduct({
  service,
  selectedId,
  onSelectVariant,
  selectedVariant,
  onBook,
  variantError,
}) {
  const { incVat } = useVatPreference();
  const variants = service.variants ?? [];
  const priceDisplay = service.priceDisplay;
  const isEmergency =
    service.category === "emergency" ||
    service.name?.toLowerCase().includes("emergency") ||
    service.slug?.includes("emergency");
  const dispatchNote = isEmergency ? "Immediate dispatch available" : "Book online — fixed pricing";

  return (
    <section className="home1-service-product home1-service-product--slim" aria-labelledby="service-detail-heading">
      <div className="home1-service-product-bg" aria-hidden="true" />
      <div className={`${SERVICE_DETAIL_CONTAINER} home1-service-product-inner`}>
        <div className="home1-service-slim-hero">
          <ServiceSlimHeroAside service={service} />

          <div className="home1-service-slim-main min-w-0">
            <div className="home1-service-slim-meta">
              <span className="home1-service-slim-category">{service.categoryLabel}</span>
              <span className="home1-service-slim-meta-dot" aria-hidden="true">
                ·
              </span>
              <span className="home1-service-slim-dispatch">{dispatchNote}</span>
            </div>

            <h1 id="service-detail-heading" className="home1-service-slim-title">
              {service.name}
            </h1>

            <p className="home1-service-slim-lead">{service.description}</p>

            <ServiceSlimPriceRibbon priceDisplay={priceDisplay} incVat={incVat} isEmergency={isEmergency} />

            <div className="home1-service-slim-book">
              {variants.length > 0 ? (
                <>
                  <ServiceVariantPicker
                    variants={variants}
                    selectedId={selectedId}
                    onSelect={onSelectVariant}
                    idPrefix="slim"
                    theme="light"
                    label="Select a variant"
                    className="home1-service-slim-variants"
                  />
                  {variantError ? (
                    <p className="home1-service-variant-error" role="alert">
                      {variantError}
                    </p>
                  ) : null}
                </>
              ) : null}
              {selectedVariant ? (
                <ServiceSelectedPrice
                  priceExcVat={selectedVariant.priceExcVat ?? selectedVariant.price}
                  incVat={incVat}
                  variantLabel={selectedVariant.label}
                  theme="light"
                  className="home1-service-slim-selected-price"
                />
              ) : null}
              <ServiceBookingButtons onBook={onBook} bookHref={service.bookHref} variant="slim" />
            </div>

            <p className="home1-service-slim-foot-trust">
              {SLIM_FOOTER_TRUST.map((item, i) => (
                <span key={item}>
                  {i > 0 ? <span className="home1-service-slim-foot-sep" aria-hidden="true"> | </span> : null}
                  {item}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ service, selectedVariant, selectedId, onSelectVariant, onBook, variantError }) {
  return (
    <aside className="home1-service-detail-sidebar home1-service-detail-sidebar--sticky" aria-label="Book this service">
      <div className="home1-service-sidebar-head">
        <p className="home1-service-detail-sidebar-label">Quick book</p>
        <h3 className="home1-service-sidebar-title">Book this service</h3>
        {service.tag && <span className="home1-service-detail-sidebar-tag">{service.tag}</span>}
      </div>

      <div className="home1-service-sidebar-panel">
        <ServiceBookingBlock
          service={service}
          variants={service.variants}
          selectedId={selectedId}
          onSelectVariant={onSelectVariant}
          selectedVariant={selectedVariant}
          onBook={onBook}
          variantError={variantError}
          idPrefix="sidebar"
          theme="light"
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
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("");
  const [variantError, setVariantError] = useState("");

  const selectedVariant = useMemo(
    () => getVariantById(service, selectedId),
    [service, selectedId]
  );

  const hasVariants = (service.variants?.length ?? 0) > 0;

  const handleSelectVariant = useCallback((id) => {
    setSelectedId(id);
    setVariantError("");
  }, []);

  const handleBook = useCallback(() => {
    if (hasVariants && !selectedId) {
      setVariantError("Please select a variant to continue with your booking.");
      return;
    }

    setVariantError("");
    router.push(
      buildCheckoutHref({
        service: service.name,
        slug: service.slug,
        variantId: selectedId || undefined,
        variantLabel: selectedVariant?.label,
      })
    );
  }, [hasVariants, selectedId, selectedVariant, service.name, service.slug, router]);

  const contentSections = useMemo(() => buildContentSections(service), [service]);

  return (
    <div className="home1-page home1-service-detail-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <ServiceDetailProduct
          service={service}
          selectedId={selectedId}
          onSelectVariant={handleSelectVariant}
          selectedVariant={selectedVariant}
          onBook={handleBook}
          variantError={variantError}
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
                  onSelectVariant={handleSelectVariant}
                  onBook={handleBook}
                  variantError={variantError}
                />
              </aside>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface home1-related-section pt-0`}>
              <div className={SERVICE_DETAIL_CONTAINER}>
                <SectionHeader eyebrow="Related" className="pb-3" title="You may also need" align="left" compact />
                <RelatedServicesSlider services={related} />
              </div>
            </section>
          </MotionSection>
        )}

        <CTAHome1 bookHref={service.bookHref} />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
