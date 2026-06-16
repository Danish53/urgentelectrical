"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { IconArrow, IconCalendar, IconCheck, IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";

function LocationHeroImage({ location }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="home1-location-detail-hero-media">
      {!failed ? (
        <Image
          src={location.image}
          alt={location.imageAlt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 480px"
          className="object-cover"
          unoptimized={shouldUnoptimizeImage(location.image)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="home1-location-detail-hero-media-fallback" aria-hidden="true">
          <span>{location.name}</span>
        </div>
      )}
      <div className="home1-location-detail-hero-media-overlay" aria-hidden="true" />
    </div>
  );
}

function LocationFaq({ faqs }) {
  return (
    <div className="home1-location-detail-faqs">
      {faqs.map((faq) => (
        <details key={faq.id} className="home1-location-detail-faq">
          <summary>{faq.q}</summary>
          <p>{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export default function LocationDetailClient({ location, related }) {
  const nearby = location.nearby?.length ? location.nearby : related;

  return (
    <div className="home1-page home1-location-detail-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        {/* Hero — no breadcrumb */}
        <section
          className="home1-location-detail-hero relative bg-black overflow-x-clip"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
          aria-labelledby="location-detail-heading"
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
          <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

          <div className={`${SERVICES_PAGE_CONTAINER} relative z-10 pb-10 sm:pb-14 lg:pb-16`}>
            <Link href="/locations" className="home1-location-detail-back">
              <IconArrow className="w-4 h-4 rotate-180 shrink-0" aria-hidden="true" />
              All service areas
            </Link>

            <div className="home1-location-detail-hero-grid">
              <div className="home1-location-detail-hero-copy min-w-0">
                <span className="home1-location-detail-eyebrow">{location.hero.eyebrow}</span>

                <h1
                  id="location-detail-heading"
                  className="home1-location-detail-title"
                >
                  {location.hero.title}{" "}
                  <span className="text-[#ff5a3c]">{location.hero.titleAccent}</span>
                </h1>

                <p className="home1-location-detail-lead">{location.hero.description}</p>

                <ul className="home1-location-detail-pills list-none p-0 m-0">
                  {location.highlights.map((h) => (
                    <li key={h}>
                      <IconCheck className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="home1-location-detail-hero-actions">
                  <Link
                    href={location.bookHref}
                    className="home1-location-detail-btn home1-location-detail-btn--primary"
                  >
                    <IconCalendar className="w-5 h-5 shrink-0" aria-hidden="true" />
                    Book online
                  </Link>
                  <a
                    href={`tel:${FOOTER_PHONE_TEL}`}
                    className="home1-location-detail-btn home1-location-detail-btn--outline"
                  >
                    <IconPhone className="w-5 h-5 shrink-0" aria-hidden="true" />
                    {FOOTER_PHONE}
                  </a>
                </div>
              </div>

              <div className="home1-location-detail-hero-visual min-w-0">
                <LocationHeroImage location={location} />
                <div className="home1-location-detail-hero-badge">
                  <span className="home1-location-detail-hero-badge-label">Region</span>
                  <strong>{location.regionLabel}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content + sidebar */}
        <section className="home1-location-detail-body" aria-labelledby="location-about-heading">
          <div className={SERVICES_PAGE_CONTAINER}>
            <div className="home1-location-detail-layout">
              <div className="home1-location-detail-main min-w-0">
                <article id="about" className="home1-location-detail-block">
                  <h2 id="location-about-heading" className="home1-location-detail-h2">
                    Electricians in {location.name}
                  </h2>
                  <div className="home1-location-detail-prose">
                    {location.paragraphs.map((para) => (
                      <p key={para.slice(0, 40)}>{para}</p>
                    ))}
                  </div>
                  <p className="home1-location-detail-response">{location.responseNote}</p>
                </article>

                <article id="why" className="home1-location-detail-block">
                  <h2 className="home1-location-detail-h2">Why choose Urgent Electrical</h2>
                  <ul className="home1-location-detail-why-grid list-none p-0 m-0">
                    {location.whyChoose.map((item) => (
                      <li key={item}>
                        <span className="home1-location-detail-why-icon" aria-hidden="true">
                          <IconCheck className="w-4 h-4" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>

                <article id="faqs" className="home1-location-detail-block">
                  <h2 className="home1-location-detail-h2">Frequently asked questions</h2>
                  <p className="home1-location-detail-sub">
                    Common questions about electrical work in {location.name}
                  </p>
                  <LocationFaq faqs={location.faqs} />
                </article>
              </div>

              <aside className="home1-location-detail-aside" aria-label="Book an electrician">
                <div className="home1-location-detail-sidebar-card">
                  <p className="home1-location-detail-sidebar-label">Fast booking</p>
                  <h3 className="home1-location-detail-sidebar-title">
                    Need an electrician in {location.name}?
                  </h3>
                  <p className="home1-location-detail-sidebar-text">
                    Book fixed-price work online or call for 24/7 emergency assistance.
                  </p>
                  <div className="home1-location-detail-sidebar-actions">
                    <Link
                      href={location.bookHref}
                      className="home1-location-detail-btn home1-location-detail-btn--primary home1-location-detail-btn--block"
                    >
                      <IconCalendar className="w-5 h-5 shrink-0" aria-hidden="true" />
                      Book now
                    </Link>
                    <a
                      href={`tel:${FOOTER_PHONE_TEL}`}
                      className="home1-location-detail-btn home1-location-detail-btn--ghost home1-location-detail-btn--block"
                    >
                      <IconPhone className="w-5 h-5 shrink-0" aria-hidden="true" />
                      Call {FOOTER_PHONE}
                    </a>
                  </div>
                  <ul className="home1-location-detail-sidebar-trust list-none p-0 m-0">
                    {location.highlights.map((h) => (
                      <li key={`side-${h}`}>
                        <IconCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Services in this area */}
        <section
          className="home1-location-detail-services"
          aria-labelledby="location-services-heading"
        >
          <div className={SERVICES_PAGE_CONTAINER}>
            <h2 id="location-services-heading" className="home1-location-detail-services-title">
              {location.servicesIntro}
            </h2>
            <ul className="home1-location-detail-services-grid list-none p-0 m-0">
              {location.services.map((svc) => (
                <li key={svc.slug}>
                  <Link href={svc.href} className="home1-location-detail-service-card">
                    <span className="home1-location-detail-service-card-top">
                      {svc.tag ? (
                        <span className="home1-location-detail-service-tag">{svc.tag}</span>
                      ) : null}
                      {svc.priceIncVat ? (
                        <span className="home1-location-detail-service-price">
                          from <strong>£{svc.priceIncVat}</strong>
                          <span className="sr-only"> including VAT</span>
                        </span>
                      ) : null}
                    </span>
                    <span className="home1-location-detail-service-name">{svc.name}</span>
                    <span className="home1-location-detail-service-link">
                      View service
                      <IconArrow className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Map */}
        <section className="home1-location-detail-map" aria-label={`Map of ${location.name}`}>
          <div className={SERVICES_PAGE_CONTAINER}>
            <h2 className="home1-location-detail-h2 text-center mb-6 sm:mb-8">
              Service area map — {location.name}
            </h2>
            <div className="home1-location-detail-map-frame">
              <iframe
                title={`Map showing ${location.name} — Urgent Electrical coverage`}
                src={location.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </section>

        {/* Nearby areas */}
        {nearby.length > 0 && (
          <section
            className="home1-location-detail-nearby"
            aria-labelledby="location-nearby-heading"
          >
            <div className={SERVICES_PAGE_CONTAINER}>
              <h2 id="location-nearby-heading" className="home1-location-detail-h2 text-center">
                More areas in {location.regionLabel}
              </h2>
              <ul className="home1-location-detail-nearby-grid list-none p-0 m-0">
                {nearby.map((area) => (
                  <li key={area.slug}>
                    <Link href={area.href} className="home1-location-detail-nearby-link">
                      <span className="home1-location-detail-nearby-marker" aria-hidden="true" />
                      {area.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="text-center mt-8 sm:mt-10">
                <Link href="/locations" className="home1-location-detail-view-all">
                  View all service areas
                  <IconArrow className="w-4 h-4 shrink-0" aria-hidden="true" />
                </Link>
              </p>
            </div>
          </section>
        )}

        <CTAHome1 bookHref={location.bookHref} />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
