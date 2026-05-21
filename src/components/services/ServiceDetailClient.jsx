"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import MotionSection from "@/components/MotionSection.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import ServiceCard from "@/components/services/ServiceCard";
import SectionHeader from "@/components/home1/SectionHeader";
import { CONTAINER, SECTION_PY } from "@/components/home1/constants";
import { IconArrow, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { HERO_CONTAINER } from "@/lib/motion";

function DetailHeroImage({ service }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center text-white font-bold px-4 text-center"
        style={{ backgroundColor: service.color }}
      >
        {service.name}
      </div>
    );
  }
  return (
    <Image
      src={service.image}
      alt={service.name}
      fill
      priority
      sizes="(max-width: 1280px) 100vw, 1200px"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function ServiceDetailImage({ service }) {
  return (
    <figure className="home1-service-detail-banner relative">
      <DetailHeroImage service={service} />
      {service.tag && (
        <span className="absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-[var(--home1-red)]">
          {service.tag}
        </span>
      )}
    </figure>
  );
}

function PricingSidebar({ service }) {
  return (
    <aside className="home1-service-detail-sidebar" aria-label="Book this service">
      <p className="home1-service-detail-sidebar-label">Fixed price</p>
      <div className="home1-service-detail-price">
        <strong>£{service.priceIncVat}</strong>
        <span>Inc. VAT · No hidden fees</span>
      </div>
      {service.tag && (
        <span className="inline-block mb-4 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase bg-[var(--home1-red)]">
          {service.tag}
        </span>
      )}
      <div className="flex flex-col gap-3">
        <Link href={service.bookHref} className="home1-btn-primary w-full text-sm py-3.5 justify-center">
          Book this service
          <IconArrow className="w-4 h-4" />
        </Link>
        <a
          href={`tel:${FOOTER_PHONE_TEL}`}
          className="home1-service-btn home1-service-btn--ghost w-full !text-white !bg-white/10 !border-white/20 hover:!bg-white/15 hover:!border-white/30"
        >
          <IconPhone className="w-4 h-4" />
          {FOOTER_PHONE}
        </a>
      </div>
      <ul className="home1-service-detail-sidebar-trust">
        {["NICEIC approved", "12-month warranty", "Same-day booking"].map((t) => (
          <li key={t}>
            <IconCheck className="w-4 h-4 text-[#4ADE80] shrink-0" />
            {t}
          </li>
        ))}
      </ul>
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
  const reduceMotion = useReducedMotion();

  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        {/* Hero — centered title & description */}
        <section
          className="home1-service-detail-hero relative bg-black overflow-x-clip pt-[118px] lg:pt-[122px] pb-12 sm:pb-14"
          aria-labelledby="service-detail-heading"
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${CONTAINER} relative z-10`}>
            <motion.div
              className="home1-service-detail-hero-inner mt-5"
              variants={reduceMotion ? undefined : HERO_CONTAINER}
              initial={reduceMotion ? false : "hidden"}
              animate={reduceMotion ? undefined : "visible"}
            >
              {/* <nav
                aria-label="Breadcrumb"
                className="home1-service-detail-breadcrumb flex flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-white/50 mb-5"
              >
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/80">{service.name}</span>
              </nav> */}

              {/* <span className="home1-eyebrow home1-eyebrow--light inline-flex mb-4">{service.categoryLabel}</span> */}

              <h1
                id="service-detail-heading"
                className="text-white text-[28px] sm:text-[38px] lg:text-[44px] font-extrabold leading-[1.08] tracking-tight mb-4 max-w-3xl mx-auto"
              >
                {service.name}
              </h1>

              <p className="text-white/80 text-[15px] sm:text-[16px] leading-relaxed mb-6 max-w-2xl mx-auto">
                {service.description}
              </p>

              {/* <div className="home1-service-detail-hero-price mx-auto mb-6">
                <strong>£{service.priceIncVat}</strong>
                <span>Inc. VAT · Fixed price · No hidden fees</span>
              </div> */}

              {/* <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                <Link href={service.bookHref} className="home1-btn-primary text-sm py-3 px-6 justify-center">
                  Book this service
                  <IconArrow className="w-4 h-4" />
                </Link>
                <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-hero-phone justify-center">
                  {FOOTER_PHONE}
                </a>
              </div> */}
            </motion.div>
          </div>
        </section>

        {/* Full image, then content below */}
        <section className={`home1-service-detail-body bg-white ${SECTION_PY}`}>
          <div className={CONTAINER}>
            <ServiceDetailImage service={service} />

            <div className="grid lg:grid-cols-[1fr_300px] gap-10 lg:gap-12 items-start mt-10 sm:mt-12">
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
                          <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {service.includes.length > 0 && (
                  <section className="home1-service-detail-block" aria-labelledby="service-includes-heading">
                    <h2 id="service-includes-heading" className="text-xl font-extrabold text-[var(--home1-text)] mb-4">
                      What&apos;s included
                    </h2>
                    <ul className="home1-service-detail-includes">
                      {service.includes.map((item) => (
                        <li key={item}>{item}</li>
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

              <div className="hidden lg:block home1-service-detail-book min-w-0 lg:sticky lg:top-28">
                <PricingSidebar service={service} />
              </div>
            </div>

            <div className="lg:hidden mt-8">
              <PricingSidebar service={service} />
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <MotionSection variant="fade-up">
            <section className={`${SECTION_PY} home1-section-surface`}>
              <div className={CONTAINER}>
                <SectionHeader
                  eyebrow="Related"
                  title="You may also need"
                  align="left"
                  compact
                />
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
