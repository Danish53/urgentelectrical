"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import { IconArrow, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { EASE_SMOOTH, HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

function DetailImage({ service, priority = false }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg px-6 text-center"
        style={{ backgroundColor: service.color }}
      >
        {service.name}
      </div>
    );
  }
  return (
    <img
      src={service.image}
      alt={service.name}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function PricingCard({ service }) {
  return (
    <aside className="home1-card p-6 sm:p-7 lg:sticky lg:top-28">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--home1-red)] mb-2">Fixed price</p>
      <p className="text-3xl sm:text-4xl font-extrabold text-[var(--home1-text)] mb-1">£{service.priceIncVat}</p>
      <p className="text-[var(--home1-muted)] text-sm font-medium mb-6">Inc. VAT · No hidden fees</p>
      {service.tag && (
        <span className="inline-block mb-5 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide bg-[var(--home1-red)]">
          {service.tag}
        </span>
      )}
      <div className="flex flex-col gap-3">
        <Link href={service.bookHref} className="home1-btn-primary w-full text-sm py-3.5">
          Book this service
          <IconArrow className="w-4 h-4" />
        </Link>
        <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-btn-primary w-full text-sm py-3.5 !bg-[var(--home1-charcoal)] hover:!bg-[#333]">
          <IconPhone className="w-4 h-4" />
          {FOOTER_PHONE}
        </a>
      </div>
      <ul className="mt-6 pt-6 border-t border-[var(--home1-border)] space-y-2.5 text-[13px] text-[var(--home1-muted)]">
        {["NICEIC approved", "12-month warranty", "East Midlands coverage", "Same-day booking"].map((t) => (
          <li key={t} className="flex items-center gap-2">
            <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0" />
            {t}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function RelatedCard({ service }) {
  const [failed, setFailed] = useState(false);
  return (
    <Link href={service.href} className="home1-card home1-card-shine overflow-hidden group block h-full">
      <div className="h-36 relative bg-[var(--home1-surface)] overflow-hidden">
        {!failed ? (
          <img
            src={service.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-semibold px-3 text-center" style={{ backgroundColor: service.color }}>
            {service.name}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[14px] leading-snug text-[var(--home1-text)] line-clamp-2 mb-2">{service.name}</h3>
        <p className="text-[var(--home1-red)] font-extrabold text-lg">£{service.priceIncVat}</p>
        <span className="inline-flex items-center gap-1 mt-3 text-[13px] font-bold text-[var(--home1-red)]">
          View details <IconArrow className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

function FaqList({ faqs, reduceMotion }) {
  const [open, setOpen] = useState(0);
  if (!faqs.length) return null;

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={item.q}
            className="home1-card overflow-hidden"
            initial={false}
            layout={!reduceMotion}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="home1-faq-trigger w-full flex items-center justify-between gap-4 p-5 text-left font-bold text-[15px] text-[var(--home1-text)]"
              aria-expanded={isOpen}
            >
              {item.q}
              <span className={`text-[var(--home1-red)] text-xl shrink-0 transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden="true">
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[14px] leading-relaxed text-[var(--home1-muted)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function ServiceDetailClient({ service, related }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main className="w-full min-w-0">
        {/* Hero */}
        <section className="relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-10 sm:pb-14" aria-labelledby="service-detail-heading">
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${CONTAINER} relative z-10`}>
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <motion.div
                variants={reduceMotion ? undefined : HERO_CONTAINER}
                initial={reduceMotion ? false : "hidden"}
                animate={reduceMotion ? undefined : "visible"}
              >
                <motion.nav
                  variants={reduceMotion ? undefined : HERO_ITEM}
                  aria-label="Breadcrumb"
                  className="flex flex-wrap items-center gap-2 text-[12px] font-semibold text-white/50 mb-5"
                >
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                  <span aria-hidden="true">/</span>
                  <Link href="/services" className="hover:text-white transition-colors">
                    Services
                  </Link>
                  <span aria-hidden="true">/</span>
                  <span className="text-white/85 line-clamp-1">{service.name}</span>
                </motion.nav>

                <motion.span variants={reduceMotion ? undefined : HERO_ITEM} className="home1-eyebrow home1-eyebrow--light inline-flex mb-4">
                  {service.categoryLabel}
                </motion.span>

                <motion.h1
                  id="service-detail-heading"
                  variants={reduceMotion ? undefined : HERO_TITLE}
                  className="text-white text-[28px] sm:text-[38px] lg:text-[42px] font-extrabold leading-[1.1] tracking-tight mb-4"
                >
                  {service.name}
                </motion.h1>

                <motion.p variants={reduceMotion ? undefined : HERO_ITEM} className="text-white/80 text-[15px] leading-relaxed mb-6 max-w-xl">
                  {service.description}
                </motion.p>

                <motion.div variants={reduceMotion ? undefined : HERO_ITEM} className="flex flex-wrap gap-3">
                  <Link href={service.bookHref} className="home1-btn-primary text-sm py-3 px-5">
                    Book from £{service.priceIncVat}
                    <IconArrow className="w-4 h-4" />
                  </Link>
                  <Link href="/services" className="home1-btn-outline text-sm py-3 px-5">
                    All services
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={reduceMotion ? undefined : HERO_ITEM}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: EASE_SMOOTH }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[340px] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
              >
                <DetailImage service={service} priority />
                {service.tag && (
                  <span className="absolute top-4 left-4 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-[var(--home1-red)]">
                    {service.tag}
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className={`${SECTION_PY} bg-white`}>
          <div className={CONTAINER}>
            <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-12 items-start">
              <div className="min-w-0 space-y-10 sm:space-y-12">
                <MotionSection variant="fade-up">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--home1-text)] mb-4">About this service</h2>
                    <div className="space-y-4 text-[15px] leading-relaxed text-[var(--home1-muted)]">
                      {service.longDescription.map((para) => (
                        <p key={para.slice(0, 40)}>{para}</p>
                      ))}
                    </div>
                  </div>
                </MotionSection>

                {service.features.length > 0 && (
                  <MotionSection variant="fade-up" delay={0.05}>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--home1-text)] mb-5">Why choose us</h2>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {service.features.map((f) => (
                        <li key={f} className="flex gap-3 p-4 rounded-xl bg-[var(--home1-surface)] border border-[var(--home1-border)]">
                          <IconCheck className="w-5 h-5 text-[var(--home1-red)] shrink-0 mt-0.5" />
                          <span className="text-[14px] font-medium text-[var(--home1-text)] leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </MotionSection>
                )}

                {service.includes.length > 0 && (
                  <MotionSection variant="fade-up" delay={0.08}>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--home1-text)] mb-5">What&apos;s included</h2>
                    <ul className="space-y-3">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-[14px] text-[var(--home1-muted)]">
                          <span className="w-6 h-6 rounded-full bg-[var(--home1-red-soft)] text-[var(--home1-red)] flex items-center justify-center text-xs font-bold shrink-0">
                            ✓
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </MotionSection>
                )}

                {service.faqs.length > 0 && (
                  <MotionSection variant="fade-up" delay={0.1}>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--home1-text)] mb-5">Common questions</h2>
                    <FaqList faqs={service.faqs} reduceMotion={reduceMotion} />
                  </MotionSection>
                )}
              </div>

              <MotionSection variant="fade-left" className="min-w-0">
                <PricingCard service={service} />
              </MotionSection>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface overflow-x-clip`}>
              <div className={CONTAINER}>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--home1-text)] mb-8 text-center sm:text-left">
                  Related services
                </h2>
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 list-none p-0 m-0">
                  {related.map((s) => (
                    <li key={s.slug}>
                      <RelatedCard service={s} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </MotionSection>
        )}

        <MotionSection variant="fade-up">
          <CTAHome1 bookHref="/#book" />
        </MotionSection>
      </main>
      <MotionSection variant="fade-up">
        <Footer />
      </MotionSection>
      <FloatingCTA />
    </div>
  );
}
