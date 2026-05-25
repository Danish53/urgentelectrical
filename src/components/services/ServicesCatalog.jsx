"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BOOKABLE_SERVICES, SERVICE_CATEGORIES } from "@/data/servicesPage";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import ServiceCard from "./ServiceCard";

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
    else document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      id="services-catalog"
      className="py-10 sm:py-16 lg:py-20 bg-white overflow-x-clip scroll-mt-28 relative z-[1]"
      aria-labelledby="services-catalog-heading"
    >
      <div className={SERVICES_PAGE_CONTAINER}>
        <SectionHeader
          id="services-catalog-heading"
          eyebrow="Our Services"
          title="Book electrical services online"
          description="Transparent pricing with NICEIC approved engineers — select a service for full details."
          align="center"
        />

        <div
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10 -mx-0.5 px-0.5"
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
                className={`relative shrink-0 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-colors ${
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

        {filtered.length === 0 ? (
          <p className="text-center text-[var(--home1-muted)] py-14">No services in this category.</p>
        ) : (
          <ul
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 list-none p-0 m-0"
          >
            {filtered.map((service, i) => (
              <li key={service.id} className="min-w-0">
                <ServiceCard service={service} imagePriority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
