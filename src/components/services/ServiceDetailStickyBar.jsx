"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONTAINER } from "@/components/home1/constants";
import { IconCalendar, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE_TEL } from "@/data/footer";
import { STATIC_SERVICE_VARIANTS } from "@/data/serviceVariantsStatic";

const SCROLL_SHOW_OFFSET = 12;

function getHeaderHeight() {
  if (typeof document === "undefined") return 118;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height");
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 118;
}

export function ServiceVariantPickerCompact({ variants, selectedId, onSelect, idPrefix = "sticky" }) {
  const labelId = `${idPrefix}-variant-label`;
  return (
    <div className="home1-service-sticky-variants-block">
      <p id={labelId} className="home1-service-sticky-variants-label">
        Select a variant
      </p>
      <div className="home1-service-sticky-variants" role="group" aria-labelledby={labelId}>
        {variants.map((variant) => {
          const isActive = variant.id === selectedId;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => onSelect(variant.id)}
              className={`home1-service-sticky-variant${isActive ? " is-active" : ""}`}
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

export default function ServiceDetailStickyBar({
  service,
  selectedId,
  onSelectVariant,
  selectedVariant,
  observeRef,
}) {
  const [visible, setVisible] = useState(false);
  const price = selectedVariant?.priceIncVat ?? service.priceIncVat;

  useEffect(() => {
    const sentinel = observeRef?.current;
    if (!sentinel) return;

    const update = () => {
      const headerH = getHeaderHeight();
      const hasScrolled = window.scrollY > SCROLL_SHOW_OFFSET;
      const rect = sentinel.getBoundingClientRect();
      const sectionFullyPast = rect.top < headerH;
      setVisible(hasScrolled && sectionFullyPast);
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const observer = new IntersectionObserver(update, {
      root: null,
      rootMargin: `-${getHeaderHeight()}px 0px 0px 0px`,
      threshold: 0,
    });
    observer.observe(sentinel);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [observeRef]);

  return (
    <div
      className={`home1-service-sticky-bar${visible ? " is-visible" : ""}`}
      aria-hidden={!visible}
      inert={visible ? undefined : true}
      role="region"
      aria-label="Quick book bar"
    >
      <div className={CONTAINER}>
        <div className="home1-service-sticky-bar-inner">
          <ServiceVariantPickerCompact
            variants={STATIC_SERVICE_VARIANTS}
            selectedId={selectedId}
            onSelect={onSelectVariant}
          />

          <div className="home1-service-sticky-meta">
            <p className="home1-service-sticky-price" aria-live="polite">
              <strong>£{price}</strong>
              <span>Inc. VAT</span>
            </p>

            <div className="home1-service-sticky-actions">
              <Link href={service.bookHref} className="home1-service-sticky-btn home1-service-sticky-btn--book">
                <IconCalendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Book Now</span>
              </Link>
              <a
                href={`tel:${FOOTER_PHONE_TEL}`}
                className="home1-service-sticky-btn home1-service-sticky-btn--call"
                aria-label="Call now"
              >
                <IconPhone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="sr-only">Call</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
