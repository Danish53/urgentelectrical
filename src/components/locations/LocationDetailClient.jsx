"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { CONTAINER } from "@/components/home1/constants";
import { IconArrow, IconCalendar, IconCheck, IconPhone } from "@/components/home1/icons";
import LocationRelatedAreas from "@/components/locations/LocationRelatedAreas";
import PageDetailFaq from "@/components/common/PageDetailFaq";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";

const LocationDetailMap = dynamic(() => import("@/components/locations/LocationDetailMap"), {
  ssr: false,
  loading: () => <div className="home1-locations-map__loading" aria-hidden="true" />,
});

function formatSectionNumber(index) {
  return String(index).padStart(2, "0");
}

function buildLocationSectionNumbers(location) {
  /** @type {Record<string, string>} */
  const numbers = {};
  let index = 0;

  const assign = (key) => {
    index += 1;
    numbers[key] = formatSectionNumber(index);
  };

  if (location.paragraphs?.length) assign("about");
  if (location.commonJobs?.length) assign("jobs");
  if (location.whyChoose?.length) assign("why");
  if (location.faqs?.length) assign("faqs");
  if (location.mapEmbed) assign("map");

  return numbers;
}

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

export default function LocationDetailClient({ location }) {
  const sectionNumbers = buildLocationSectionNumbers(location);
  const jumpSections = [
    location.paragraphs?.length ? { id: "about", label: "Overview" } : null,
    location.commonJobs?.length ? { id: "jobs", label: "Common jobs" } : null,
    location.whyChoose?.length ? { id: "why", label: "Why choose us" } : null,
    location.faqs?.length ? { id: "faqs", label: "FAQs" } : null,
    location.mapEmbed ? { id: "map", label: "Map" } : null,
  ].filter(Boolean);

  return (
    <div className="home1-page home1-location-detail-page home1-page-detail-rich w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <section
          className="home1-location-detail-hero relative bg-black overflow-x-clip"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
          aria-labelledby="location-detail-heading"
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
          <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

          <div className={`${CONTAINER} relative z-10 pb-10 sm:pb-14 lg:pb-16`}>
            <Link href="/locations" className="home1-location-detail-back">
              <IconArrow className="w-4 h-4 rotate-180 shrink-0" aria-hidden="true" />
              All service areas
            </Link>

            <div className="home1-location-detail-hero-grid">
              <div className="home1-location-detail-hero-copy min-w-0">
                <span className="home1-location-detail-eyebrow">{location.hero.eyebrow}</span>

                <h1 id="location-detail-heading" className="home1-location-detail-title">
                  {location.hero.title}
                  {location.hero.titleAccent ? (
                    <>
                      {" "}
                      <span className="text-[#ff5a3c]">{location.hero.titleAccent}</span>
                    </>
                  ) : null}
                </h1>

                <p className="home1-location-detail-lead">{location.hero.lead}</p>

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
                    href="/services/emergency-response-247"
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

        <section className="home1-page-detail-body-section" aria-labelledby="location-about-heading">
          <div className={`${CONTAINER} home1-page-detail-shell`}>
            <div className="home1-page-detail-layout">
              <div className="home1-page-detail-main">
                {jumpSections.length > 1 ? (
                  <nav className="home1-page-detail-jump" aria-label="On this page">
                    <span className="home1-page-detail-jump-label">On this page</span>
                    <ul>
                      {jumpSections.map((s) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`}>{s.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}

                {location.paragraphs?.length ? (
                  <article className="home1-page-detail-card" id="about">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">{sectionNumbers.about}</span>
                      <div>
                        <h2 id="location-about-heading">Electricians in {location.name}</h2>
                        <p>Local coverage, response times, and what we handle</p>
                      </div>
                    </header>
                    <div className="home1-page-detail-prose">
                      {location.paragraphs.map((para) => (
                        <p key={para.slice(0, 40)}>{para}</p>
                      ))}
                    </div>
                  </article>
                ) : null}

                {location.commonJobs?.length ? (
                  <section className="home1-page-detail-card" id="jobs">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">{sectionNumbers.jobs}</span>
                      <div>
                        <h2>Common jobs we handle in {location.name}</h2>
                        <p>Typical domestic and commercial work in this area</p>
                      </div>
                    </header>
                    <ul className="home1-page-detail-feature-grid">
                      {location.commonJobs.map((job) => (
                        <li key={job}>
                          <IconCheck className="home1-page-detail-feature-icon" aria-hidden="true" />
                          <span>{job}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {location.whyChoose?.length ? (
                  <section className="home1-page-detail-card" id="why">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">{sectionNumbers.why}</span>
                      <div>
                        <h2>Why choose Urgent Electrical</h2>
                        <p>What local customers rely on us for</p>
                      </div>
                    </header>
                    <ul className="home1-page-detail-feature-grid">
                      {location.whyChoose.map((item) => (
                        <li key={item}>
                          <IconCheck className="home1-page-detail-feature-icon" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {location.faqs?.length ? (
                  <section className="home1-page-detail-card" id="faqs">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">{sectionNumbers.faqs}</span>
                      <div>
                        <h2>Frequently asked questions</h2>
                        <p>Common questions about electrical work in {location.name}</p>
                      </div>
                    </header>
                    <PageDetailFaq faqs={location.faqs} />
                  </section>
                ) : null}

                {location.mapEmbed || location.mapQuery || location.name ? (
                  <section className="home1-page-detail-card" id="map">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">{sectionNumbers.map}</span>
                      <div>
                        <h2>Find us in {location.name}</h2>
                        <p>Coverage map for {location.name} and surrounding areas</p>
                      </div>
                    </header>
                    <div className="home1-location-detail-map-frame home1-location-detail-map-frame--in-card">
                      <LocationDetailMap
                        name={location.name}
                        cityName={location.cityName || location.regionLabel || ""}
                        slug={location.slug}
                        lat={location.mapPoint?.lat ?? null}
                        lng={location.mapPoint?.lng ?? null}
                        mapQuery={location.mapQuery || ""}
                        mapEmbed={location.mapEmbed || ""}
                      />
                    </div>
                  </section>
                ) : null}
              </div>

              <aside
                className="home1-page-detail-aside home1-page-detail-aside--sticky"
                aria-label="Book an electrician"
              >
                <div className="home1-page-detail-aside-inner">
                  <div className="home1-page-detail-aside-card home1-page-detail-aside-card--primary">
                    <p className="home1-page-detail-aside-label">Ready to book?</p>
                    <h2 className="home1-page-detail-aside-title">
                      Need an electrician in {location.name}?
                    </h2>
                    <p className="home1-page-detail-aside-note">
                      Book fixed-price work online or call for 24/7 emergency assistance.
                    </p>
                    <div className="home1-page-detail-aside-actions">
                      <Link
                        href={location.bookHref}
                        className="home1-page-detail-btn home1-page-detail-btn--primary"
                      >
                        Book online
                      </Link>
                      <a
                        href={`tel:${FOOTER_PHONE_TEL}`}
                        className="home1-page-detail-btn home1-page-detail-btn--call"
                      >
                        <IconPhone className="w-4 h-4 shrink-0" aria-hidden="true" />
                        {FOOTER_PHONE}
                      </a>
                    </div>
                  </div>

                  {location.highlights?.length ? (
                    <div className="home1-location-aside-trust">
                      <p className="home1-page-detail-aside-label">Why book with us</p>
                      <ul className="home1-blog-sidebar-trust">
                        {location.highlights.map((item) => (
                          <li key={item}>
                            <IconCheck
                              className="w-3.5 h-3.5 shrink-0 text-[var(--home1-red)]"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {location.nearby?.length ? (
                    <div className="home1-page-detail-aside-card">
                      <p className="home1-page-detail-aside-label">Nearby areas</p>
                      <ul className="home1-page-detail-related">
                        {location.nearby.slice(0, 6).map((area) => (
                          <li key={area.slug}>
                            <Link href={area.href}>{area.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <Link href="/locations" className="home1-page-detail-aside-back">
                    ← Back to all areas
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {location.services?.length ? (
          <section
            className="home1-location-detail-services"
            aria-labelledby="location-services-heading"
          >
            <div className={CONTAINER}>
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
        ) : null}

        <LocationRelatedAreas currentSlug={location.slug} areas={location.nearby} />

        <CTAHome1 bookHref={location.bookHref} />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
