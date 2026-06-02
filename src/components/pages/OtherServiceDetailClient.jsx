"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import CTAHome1 from "@/components/home1/CTAHome1";
import OtherServiceDetailRich from "@/components/pages/OtherServiceDetailRich";
import { CONTAINER } from "@/components/home1/constants";
import { getPageDetailLayout } from "@/data/pageDetailMocks";
import { getPageImageUrl } from "@/services/pagesApiService";

/**
 * @param {{
 *   page: import("@/services/pagesApiService").ApiInfoPageDetail,
 *   loadError?: string,
 * }} props
 */
export default function OtherServiceDetailClient({ page, loadError = "" }) {
  const slug = page?.slug ?? "";
  const richLayout = getPageDetailLayout(slug, page);
  const imageUrl = getPageImageUrl(page);
  const html =
    (page.detail && String(page.detail).trim()) ||
    (page.long_description && String(page.long_description).trim()) ||
    "";
  const lead =
    page.description?.trim() ||
    page.seo_description?.trim() ||
    "Professional electrical guidance from NICEIC approved engineers in Nottingham and the East Midlands.";

  const updatedAt = page.updated_at
    ? new Date(page.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  if (richLayout) {
    return (
      <OtherServiceDetailRich
        layout={richLayout}
        loadError={loadError}
        imageUrl={imageUrl}
        updatedAt={updatedAt}
      />
    );
  }

  return (
    <div className="home1-page home1-other-service-detail-page w-full min-w-0">
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <section
          className="home1-other-service-detail-hero relative overflow-x-clip"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 0.85rem)" }}
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${CONTAINER} relative z-10 pb-8 sm:pb-9`}>
            {/* <Link
              href="/pages"
              className="home1-other-service-detail-back"
            >
              ← All other services
            </Link>
            <p className="home1-other-service-detail-eyebrow">Service guide</p> */}
            <h1 className="home1-other-service-detail-title">{page.title}</h1>
            <p className="home1-other-service-detail-lead">{lead}</p>
            {updatedAt ? (
              <p className="home1-other-service-detail-date">Updated {updatedAt}</p>
            ) : null}
          </div>
        </section>

        <section className="home1-other-service-detail-section">
          <div className={`${CONTAINER} home1-other-service-detail-shell`}>
              <article className="home1-other-service-detail-article">
                {loadError ? (
                  <div className="home1-other-service-detail-error">
                    <h2>Page unavailable</h2>
                    <p>{loadError}</p>
                  </div>
                ) : null}

                {!loadError && imageUrl ? (
                  <figure className="home1-other-service-detail-media-wrap">
                    <img
                      src={imageUrl}
                      alt={page.title}
                      className="home1-other-service-detail-media"
                      width={1200}
                      height={675}
                      loading="eager"
                    />
                  </figure>
                ) : null}

                <div className="home1-other-service-detail-content">
                  {!loadError && html ? (
                    <div
                      className="home1-other-service-detail-prose home1-blog-prose-html"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  ) : null}

                  {!loadError && !html ? (
                    <p className="home1-other-service-detail-fallback">{lead}</p>
                  ) : null}

                  <footer className="home1-other-service-detail-actions">
                    <Link href="/pages" className="home1-other-service-detail-btn home1-other-service-detail-btn--ghost">
                      All services
                    </Link>
                    <Link href="/services" className="home1-other-service-detail-btn home1-other-service-detail-btn--primary">
                      Book online
                    </Link>
                    <Link href="/contact-us" className="home1-other-service-detail-btn home1-other-service-detail-btn--ghost">
                      Contact
                    </Link>
                  </footer>
                </div>
              </article>
          </div>
        </section>

        <CTAHome1 />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
