"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CTAHome1 from "@/components/home1/CTAHome1";
import AppImage from "@/components/common/AppImage";
import { CONTAINER } from "@/components/home1/constants";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { SERVICE_AREAS } from "@/data/areas";
import { IconCheck, IconPhone } from "@/components/home1/icons";

function PageDetailFaq({ faqs }) {
  const [openId, setOpenId] = useState(-1);
  if (!faqs?.length) return null;

  return (
    <div className="home1-page-detail-faq">
      {faqs.map((item, i) => {
        const isOpen = openId === i;
        return (
          <div key={item.q} data-open={isOpen} className="home1-faq-item home1-page-detail-faq-item">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? -1 : i)}
              className="home1-faq-trigger home1-page-detail-faq-trigger"
              aria-expanded={isOpen}
            >
              <span>{item.q}</span>
              <span className="home1-page-detail-faq-icon" aria-hidden="true">
                +
              </span>
            </button>
            {isOpen ? <p className="home1-page-detail-faq-answer">{item.a}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{
 *   layout: NonNullable<import("@/data/pageDetailMocks").getPageDetailLayout extends (...args: unknown[]) => infer R ? R : never>,
 *   loadError?: string,
 *   imageUrl?: string | null,
 *   updatedAt?: string,
 *   relatedLinks?: { slug: string, label: string, href: string }[],
 * }} props
 */
export default function OtherServiceDetailRich({
  layout,
  loadError = "",
  imageUrl = null,
  updatedAt = "",
  relatedLinks = [],
}) {
  const heroImage = imageUrl || layout.image;
  const related = relatedLinks.length ? relatedLinks : layout.related;
  const sections = [
    { id: "overview", label: "Overview" },
    layout.features.length ? { id: "benefits", label: "Benefits" } : null,
    layout.process.length ? { id: "process", label: "How it works" } : null,
    layout.symptoms.length ? { id: "symptoms", label: "Common signs" } : null,
    // layout.includes.length ? { id: "included", label: "Included" } : null,
    layout.faqs.length ? { id: "faqs", label: "FAQs" } : null,
  ].filter(Boolean);

  return (
    <div className="home1-page home1-page-detail-rich w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <section
          className="home1-page-detail-hero relative overflow-x-clip"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1rem)" }}
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${CONTAINER} relative z-10 pb-9 sm:pb-11`}>
            <Link href="/pages" className="home1-page-detail-back">
              ← All other services
            </Link>
            <p className="home1-page-detail-eyebrow">{layout.category}</p>
            <h1 className="home1-page-detail-title">{layout.title}</h1>
            <p className="home1-page-detail-lead">{layout.lead}</p>
            <ul className="home1-page-detail-pills" aria-label="Service highlights">
              {layout.trustPills.map((pill) => (
                <li key={pill}>{pill}</li>
              ))}
            </ul>
            {updatedAt ? <p className="home1-page-detail-date">Updated {updatedAt}</p> : null}
          </div>
        </section>

        <section className="home1-page-detail-body-section">
          <div className={`${CONTAINER} home1-page-detail-shell`}>
            {loadError ? (
              <div className="home1-page-detail-banner-error" role="alert">
                <strong>Live content unavailable</strong>
                <span>{loadError} Showing reference layout below.</span>
              </div>
            ) : null}

            {heroImage ? (
              <figure className="home1-page-detail-hero-media relative">
                <AppImage
                  src={heroImage}
                  alt={layout.title}
                  width={1200}
                  height={520}
                  priority
                  className="home1-page-detail-hero-img"
                />
                {/* <figcaption className="home1-page-detail-hero-caption">
                  NICEIC approved fault finding across Nottingham &amp; the East Midlands
                </figcaption> */}
              </figure>
            ) : null}

            <p className="home1-service-slim-foot-trust-caption">
              <span>
                NICEIC approved fault finding across Nottingham &amp; the East Midlands
              </span>
            </p>


            <div className="home1-page-detail-layout">
              <div className="home1-page-detail-main">
                {sections.length > 1 ? (
                  <nav className="home1-page-detail-jump" aria-label="On this page">
                    <span className="home1-page-detail-jump-label">On this page</span>
                    <ul>
                      {sections.map((s) => (
                        <li key={s.id}>
                          <a href={`#${s.id}`}>{s.label}</a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}

                <article className="home1-page-detail-card" id="overview">
                  <header className="home1-page-detail-card-head">
                    <span className="home1-page-detail-card-num">01</span>
                    <div>
                      <h2>Overview</h2>
                      <p>What this service covers and when to book</p>
                    </div>
                  </header>
                  <div className="home1-page-detail-prose">
                    {layout.paragraphs.map((para) => (
                      <p key={para.slice(0, 40)}>{para}</p>
                    ))}
                  </div>
                  {layout.keywords.length ? (
                    <ul className="home1-page-detail-tags" aria-label="Related topics">
                      {layout.keywords.map((kw) => (
                        <li key={kw}>{kw}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>

                {layout.features.length ? (
                  <section className="home1-page-detail-card" id="benefits">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">02</span>
                      <div>
                        <h2>Why choose us</h2>
                        <p>Structured diagnosis from qualified engineers</p>
                      </div>
                    </header>
                    <ul className="home1-page-detail-feature-grid">
                      {layout.features.map((feature) => (
                        <li key={feature}>
                          <IconCheck className="home1-page-detail-feature-icon" aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {layout.process.length ? (
                  <section className="home1-page-detail-card" id="process">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">03</span>
                      <div>
                        <h2>How it works</h2>
                        <p>From your call to a clear repair plan</p>
                      </div>
                    </header>
                    <ol className="home1-page-detail-process">
                      {layout.process.map((item) => (
                        <li key={item.step}>
                          <span className="home1-page-detail-process-step">{item.step}</span>
                          <div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>
                ) : null}

                {layout.symptoms.length ? (
                  <section className="home1-page-detail-card home1-page-detail-card--muted" id="symptoms">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">04</span>
                      <div>
                        <h2>Common signs you need fault finding</h2>
                        <p>Book an investigation if you notice any of the following</p>
                      </div>
                    </header>
                    <ul className="home1-page-detail-symptoms">
                      {layout.symptoms.map((symptom) => (
                        <li key={symptom}>{symptom}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {/* {layout.includes.length ? (
                  <section className="home1-page-detail-card" id="included">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">05</span>
                      <div>
                        <h2>What&apos;s included</h2>
                        <p>Typical scope of the investigation visit</p>
                      </div>
                    </header>
                    <ul className="home1-page-detail-includes">
                      {layout.includes.map((item) => (
                        <li key={item}>
                          <IconCheck className="home1-page-detail-include-icon" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null} */}

                <section className="home1-page-detail-card home1-page-detail-card--areas" id="areas">
                  <header className="home1-page-detail-card-head">
                    <span className="home1-page-detail-card-num">06</span>
                    <div>
                      <h2>Areas we cover</h2>
                      <p>Nottingham, Nottinghamshire &amp; the East Midlands</p>
                    </div>
                  </header>
                  <ul className="home1-page-detail-areas">
                    {SERVICE_AREAS.map((area) => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                  <Link href="/locations" className="home1-page-detail-areas-link">
                    View all locations →
                  </Link>
                </section>

                {layout.faqs.length ? (
                  <section className="home1-page-detail-card" id="faqs">
                    <header className="home1-page-detail-card-head">
                      <span className="home1-page-detail-card-num">07</span>
                      <div>
                        <h2>Frequently asked questions</h2>
                        <p>Before you book your visit</p>
                      </div>
                    </header>
                    <PageDetailFaq faqs={layout.faqs} />
                  </section>
                ) : null}
              </div>

              <aside className="home1-page-detail-aside home1-page-detail-aside--sticky" aria-label="Book and contact">
                <div className="home1-page-detail-aside-inner">
                  <div className="home1-page-detail-aside-card home1-page-detail-aside-card--primary">
                    <p className="home1-page-detail-aside-label">Ready to book?</p>
                    <h2 className="home1-page-detail-aside-title">{layout.title}</h2>
                    {layout.priceHint ? (
                      <p className="home1-page-detail-aside-price">{layout.priceHint}</p>
                    ) : null}
                    <p className="home1-page-detail-aside-note">
                      Fixed-price investigation · Same trusted team for repairs
                    </p>
                    <div className="home1-page-detail-aside-actions">
                      <Link href={layout.bookHref} className="home1-page-detail-btn home1-page-detail-btn--primary">
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

                  {layout.includes.length ? (
                    <div className="home1-page-detail-aside-card">
                      <p className="home1-page-detail-aside-label">Included on visit</p>
                      <ul className="home1-page-detail-aside-list">
                        {layout.includes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {related.length ? (
                    <div className="home1-page-detail-aside-card">
                      <p className="home1-page-detail-aside-label">Related services</p>
                      <ul className="home1-page-detail-related">
                        {related.map((link) => (
                          <li key={link.href}>
                            <Link href={link.href}>{link.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <Link href="/pages" className="home1-page-detail-aside-back">
                    ← Back to all services
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
