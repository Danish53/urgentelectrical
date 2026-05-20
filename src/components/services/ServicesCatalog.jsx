"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  BOOKABLE_SERVICES,
  SERVICE_CATEGORIES,
  priceIncVatFromString,
} from "@/data/servicesPage";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import { IconArrow } from "@/components/home1/icons";
import { EASE_SMOOTH } from "@/lib/motion";

function ServiceCard({ service }) {
  const [failed, setFailed] = useState(false);
  const price = priceIncVatFromString(service.price);

  return (
    <motion.article
      layout
      id={service.slug}
      className="home1-card home1-card-shine h-full flex flex-col overflow-hidden group scroll-mt-32"
      itemScope
      itemType="https://schema.org/Service"
    >
      <Link href={service.href} className="block h-44 relative overflow-hidden bg-[var(--home1-surface)] shrink-0">
        {!failed && (
          <img
            src={service.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        )}
        {failed && (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-semibold text-sm px-4 text-center"
            style={{ backgroundColor: service.color }}
            aria-hidden="true"
          >
            {service.name}
          </div>
        )}
        {service.tag && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide"
            style={{ background: "var(--home1-red)" }}
          >
            {service.tag}
          </span>
        )}
      </Link>
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <h3 className="font-bold text-[var(--home1-text)] text-[15px] leading-snug mb-2" itemProp="name">
          <Link href={service.href} className="hover:text-[var(--home1-red)] transition-colors line-clamp-2">
            {service.name}
          </Link>
        </h3>
        <p className="text-[var(--home1-muted)] text-[13px] leading-relaxed mb-4 flex-1" itemProp="description">
          {service.description}
        </p>
        <p className="text-2xl font-extrabold mb-0.5" style={{ color: "var(--home1-red)" }} itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span itemProp="price">£{price}</span>
          <meta itemProp="priceCurrency" content="GBP" />
        </p>
        <p className="text-[var(--home1-muted)] text-xs font-medium mb-5">Inc. VAT · Fixed price</p>
        <div className="flex flex-col gap-2 mt-auto">
          <Link href={service.href} className="w-full text-center text-[13px] font-bold text-[var(--home1-red)] py-2.5 rounded-xl border border-[rgba(211,35,31,0.35)] hover:bg-[var(--home1-red-soft)] transition-colors">
            View details
          </Link>
          <Link href={service.bookHref} className="home1-btn-primary w-full text-sm py-3.5">
            Book this service
            <IconArrow className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function ServicesCatalog() {
  const [active, setActive] = useState("all");
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(
    () => (active === "all" ? BOOKABLE_SERVICES : BOOKABLE_SERVICES.filter((s) => s.category === active)),
    [active]
  );

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
    if (!hash) return;
    const matchCat = SERVICE_CATEGORIES.find((c) => c.id === hash);
    if (matchCat) setActive(matchCat.id);
  }, []);

  return (
    <section
      id="services-catalog"
      className={`${SECTION_PY} bg-white overflow-x-clip scroll-mt-24`}
      aria-labelledby="services-catalog-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="services-catalog-heading"
          eyebrow="Fixed-price menu"
          title="Book electrical services online"
          description="Select a service for instant pricing. All jobs include VAT and are carried out by NICEIC approved engineers."
          align="center"
        />

        <div
          className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
          role="tablist"
          aria-label="Filter services by category"
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat.id)}
                className={`relative px-4 py-2.5 rounded-xl text-[13px] font-bold transition-colors ${
                  isActive ? "text-white" : "text-[var(--home1-muted)] hover:text-[var(--home1-text)] bg-[var(--home1-surface)]"
                }`}
              >
                {isActive && !reduceMotion && (
                  <motion.span
                    layoutId="services-tab-pill"
                    className="absolute inset-0 rounded-xl bg-[var(--home1-red)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    aria-hidden="true"
                  />
                )}
                {isActive && reduceMotion && (
                  <span className="absolute inset-0 rounded-xl bg-[var(--home1-red)]" aria-hidden="true" />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.ul
            key={active}
            className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 list-none p-0 m-0"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: EASE_SMOOTH }}
          >
            {filtered.map((service, i) => (
              <motion.li
                key={service.id}
                initial={reduceMotion ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : i * 0.06, duration: 0.5, ease: EASE_SMOOTH }}
                className="min-w-0"
              >
                <ServiceCard service={service} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--home1-muted)] py-12">No services in this category.</p>
        )}
      </div>
    </section>
  );
}
