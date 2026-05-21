"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BOOKABLE_SERVICES, SERVICE_CATEGORIES } from "@/data/servicesPage";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import SectionHeader from "@/components/home1/SectionHeader";
import ServiceCard from "./ServiceCard";
import { EASE_SMOOTH } from "@/lib/motion";

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
      className={`${SECTION_PY} bg-white overflow-x-clip scroll-mt-28`}
      aria-labelledby="services-catalog-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="services-catalog-heading"
          eyebrow="Our Services"
          title="Book electrical services online"
          description="Transparent pricing with NICEIC approved engineers — select a service for full details."
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
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH }}
          >
            {filtered.map((service, i) => (
              <motion.li
                key={service.id}
                initial={reduceMotion ? false : { opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduceMotion ? 0 : i * 0.05, duration: 0.45, ease: EASE_SMOOTH }}
                className="min-w-0"
              >
                <ServiceCard service={service} imagePriority={i < 3} />
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="text-center text-[var(--home1-muted)] py-14">No services in this category.</p>
        )}
      </div>
    </section>
  );
}
