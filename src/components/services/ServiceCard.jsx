"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrow } from "@/components/home1/icons";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { getDisplayPrice, getVatSuffix } from "@/lib/pricing";

export default function ServiceCard({ service, imagePriority = false }) {
  const [failed, setFailed] = useState(false);
  const { incVat } = useVatPreference();
  const priceExc = service.priceExcVat ?? service.price;
  const displayPrice = getDisplayPrice(priceExc, incVat);
  const vatLabel = getVatSuffix(incVat);
  const alt = `${service.name} — electrical service Nottingham`;

  return (
    <article
      id={service.slug}
      className="home1-card home1-card-shine home1-service-card h-full flex flex-col overflow-hidden group scroll-mt-32"
      itemScope
      itemType="https://schema.org/Service"
    >
      <Link href={service.href} className="home1-service-media block shrink-0" aria-label={`View ${service.name}`}>
        {!failed ? (
          <Image
            src={service.image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 360px"
            className="object-cover"
            priority={imagePriority}
            loading={imagePriority ? undefined : "lazy"}
            onError={() => setFailed(true)}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm px-4 text-center"
            style={{ backgroundColor: service.color }}
          >
            {service.name}
          </div>
        )}
        {service.tag && <span className="home1-service-tag">{service.tag}</span>}
        <span className="absolute bottom-3 right-3 z-[2] text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-black/55 text-white backdrop-blur-sm">
          {service.categoryLabel}
        </span>
      </Link>

      <div className="p-5 sm:p-6 flex flex-col flex-1 min-h-0">
        <h3 className="font-bold text-[var(--home1-text)] text-[15px] leading-snug mb-2 line-clamp-2" itemProp="name">
          <Link href={service.href} className="hover:text-[var(--home1-red)] transition-colors">
            {service.name}
          </Link>
        </h3>
        <p className="text-[var(--home1-muted)] text-[13px] leading-relaxed mb-4 flex-1 line-clamp-3" itemProp="description">
          {service.description}
        </p>
        <p
          className="text-2xl font-extrabold leading-none mb-0.5"
          style={{ color: "var(--home1-red)" }}
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
        >
          <span itemProp="price">£{displayPrice}</span>
          <meta itemProp="priceCurrency" content="GBP" />
        </p>
        <p className="text-[var(--home1-muted)] text-xs font-medium mb-4">{vatLabel} · Fixed price</p>

        <div className="home1-service-actions">
          <Link href={service.href} className="home1-service-btn home1-service-btn--ghost">
            Details
          </Link>
          <Link href={service.bookHref} className="home1-service-btn home1-service-btn--primary">
            Book now
            <IconArrow className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </article>
  );
}
