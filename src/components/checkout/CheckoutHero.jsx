"use client";

import Image from "next/image";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { formatGbpDisplay, getDisplayPrice, getVatSuffix } from "@/lib/pricing";

export default function CheckoutHero({ service, variantLabel, variantPriceExc }) {
  const { incVat } = useVatPreference();

  if (!service) return null;

  const priceExc = variantPriceExc ?? service.priceExcVat ?? service.price;
  const displayPrice = getDisplayPrice(priceExc, incVat);

  return (
    <section className="home1-checkout-hero" aria-label="Booking overview">
      <div className="home1-checkout-hero-bg" aria-hidden="true" />
      <div className="home1-checkout-hero-inner">
        <div className="home1-checkout-hero-media">
          {service.image ? (
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(max-width: 1023px) 100vw, 220px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="home1-checkout-hero-media-fallback" style={{ backgroundColor: service.color }} />
          )}
        </div>

        <div className="home1-checkout-hero-copy min-w-0">
          <div className="home1-checkout-hero-meta">
            <span className="home1-checkout-hero-category">{service.categoryLabel}</span>
            <span className="home1-checkout-hero-dot" aria-hidden="true">
              ·
            </span>
            <span>Secure checkout</span>
          </div>
          <h1 className="home1-checkout-hero-title">{service.name}</h1>
          {variantLabel ? (
            <p className="home1-checkout-hero-variant">
              Selected option: <strong>{variantLabel}</strong>
            </p>
          ) : null}
          <p className="home1-checkout-hero-price">
            <span className="home1-checkout-hero-price-value">{formatGbpDisplay(displayPrice)}</span>
            <span className="home1-checkout-hero-price-vat">{getVatSuffix(incVat)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
