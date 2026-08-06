import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { IconPhone } from "@/components/home1/icons";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";
import {
  NICEIC_APPROVED_CANONICAL,
  NICEIC_APPROVED_PATH,
  NICEIC_CERTIFICATE_IMAGE,
  NICEIC_CERTIFICATE_IMAGE_HEIGHT,
  NICEIC_CERTIFICATE_IMAGE_VERSION,
  NICEIC_CERTIFICATE_IMAGE_WIDTH,
  NICEIC_PAGE,
} from "@/data/niceicPages";
import "../home1/home1.css";
import "./niceic-page.css";

const PAGE_LEAD = `${NICEIC_PAGE.leadBefore}${NICEIC_PAGE.leadStrong}`;

const NICEIC_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ElectricalContractor",
  name: "Urgent Electrical Services Limited",
  areaServed: ["Nottingham", "East Midlands"],
  foundingDate: "2014",
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "certification",
    name: "NICEIC Certificate of Excellence — 10 Years' Certification",
    dateCreated: "2024",
    recognizedBy: {
      "@type": "Organization",
      name: "NICEIC / Certsure LLP",
    },
  },
  slogan: "12 years NICEIC certified. 5,000+ jobs completed since 2014.",
};

export const metadata = buildSeoMetadata(
  "12 Years NICEIC Certified — Urgent Electrical Services",
  PAGE_LEAD,
  {
    alternates: { canonical: NICEIC_APPROVED_PATH },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: NICEIC_APPROVED_CANONICAL,
      siteName: "Urgent Electrical Services",
      description: PAGE_LEAD,
      images: [
        {
          url: NICEIC_CERTIFICATE_IMAGE,
          width: NICEIC_CERTIFICATE_IMAGE_WIDTH,
          height: NICEIC_CERTIFICATE_IMAGE_HEIGHT,
          alt: "NICEIC Certificate of Excellence",
        },
      ],
    },
  }
);

export default function NiceicCertificateOfExcellencePage() {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />
      <main
        id="main-content"
        className="niceic-cert w-full min-w-0"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(NICEIC_JSON_LD) }}
        />

        <section className="niceic-cert__section" aria-labelledby="niceic-heading">
          <div className="niceic-cert__wrap">
            <p className="niceic-cert__eyebrow">
              <span className="niceic-cert__dot" aria-hidden="true" />
              {NICEIC_PAGE.eyebrow}
            </p>

            <h1 id="niceic-heading" className="niceic-cert__heading">
              <span className="niceic-cert__heading-line">{NICEIC_PAGE.titleLead}</span>
              <span className="niceic-cert__heading-line niceic-cert__heading-line--muted">
                {NICEIC_PAGE.titleRest}
              </span>
            </h1>

            <p className="niceic-cert__lede">
              {NICEIC_PAGE.leadBefore}
              <strong>{NICEIC_PAGE.leadStrong}</strong>
            </p>

            <div className="niceic-cert__grid">
              <div>
                <ul className="niceic-cert__readouts">
                  {NICEIC_PAGE.stats.map((stat) => (
                    <li
                      key={stat.id}
                      className={`niceic-cert__readout${stat.bar ? " niceic-cert__readout--featured" : ""}`}
                    >
                      <span className="niceic-cert__label">{stat.label}</span>
                      <span className="niceic-cert__value">
                        {stat.value}
                        {stat.suffix ? (
                          <span className="niceic-cert__unit">{stat.suffix}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="niceic-cert__cta">
                  <Link href="/services" className="niceic-cert__btn niceic-cert__btn--primary">
                    {NICEIC_PAGE.bookLabel}
                  </Link>
                  <a
                    href={`tel:${FOOTER_PHONE_TEL}`}
                    className="niceic-cert__btn niceic-cert__btn--ghost"
                  >
                    <IconPhone className="niceic-cert__btn-icon" aria-hidden="true" />
                    {FOOTER_PHONE}
                  </a>
                </div>
              </div>

              <aside className="niceic-cert__case" id="certificate" aria-label="Certificate of Excellence">
                <div className="niceic-cert__case-inner">
                  <div className="niceic-cert__case-top">
                    <span className="niceic-cert__tag">{NICEIC_PAGE.milestone}</span>
                    <span className="niceic-cert__status">
                      <span className="niceic-cert__dot" aria-hidden="true" />
                      {NICEIC_PAGE.verified}
                    </span>
                  </div>

                  <div className="niceic-cert__frame">
                    <span className="niceic-cert__terminal niceic-cert__terminal--tl" aria-hidden="true" />
                    <span className="niceic-cert__terminal niceic-cert__terminal--tr" aria-hidden="true" />
                    <span className="niceic-cert__terminal niceic-cert__terminal--bl" aria-hidden="true" />
                    <span className="niceic-cert__terminal niceic-cert__terminal--br" aria-hidden="true" />
                    {/* eslint-disable-next-line @next/next/no-img-element -- bypass Next image cache so latest certificate always shows */}
                    <img
                      src={`${NICEIC_CERTIFICATE_IMAGE}?v=${NICEIC_CERTIFICATE_IMAGE_VERSION}`}
                      alt="NICEIC Certificate of Excellence awarded to Urgent Electrical Services Limited, celebrating over 10 years as a NICEIC Approved Contractor in Nottingham"
                      width={NICEIC_CERTIFICATE_IMAGE_WIDTH}
                      height={NICEIC_CERTIFICATE_IMAGE_HEIGHT}
                      className="niceic-cert__frame-img"
                      decoding="async"
                    />
                  </div>

                  <div className="niceic-cert__caption">
                    <div>
                      <p className="niceic-cert__name">{NICEIC_PAGE.companyName}</p>
                      <p className="niceic-cert__sub">{NICEIC_PAGE.companyMeta}</p>
                    </div>
                    <span className="niceic-cert__badge">{NICEIC_PAGE.jobsBadge}</span>
                  </div>
                </div>
              </aside>
            </div>

            <ul className="niceic-cert__bottom" aria-label="What NICEIC approval means">
              {NICEIC_PAGE.features.map((item) => (
                <li key={item.id} className="niceic-cert__check">
                  <span className="niceic-cert__ico" aria-hidden="true">
                    ✓
                  </span>
                  <span className="niceic-cert__txt">
                    <strong>{item.title}</strong>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
