import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { buildSeoMetadata } from "@/lib/seo/buildSeoMetadata";
import {
  NICEIC_APPROVED_CANONICAL,
  NICEIC_APPROVED_PATH,
  NICEIC_CERTIFICATE_IMAGE,
  NICEIC_CERTIFICATE_PAGE,
  NICEIC_DECADE,
} from "@/data/niceicPages";
import "../home1/home1.css";

export const metadata = buildSeoMetadata(
  "NICEIC Certificate of Excellence | 10 Years Certified",
  NICEIC_DECADE.lead,
  {
    alternates: { canonical: NICEIC_APPROVED_PATH },
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: NICEIC_APPROVED_CANONICAL,
      siteName: "Urgent Electrical Services",
      description: NICEIC_DECADE.lead,
      images: [
        {
          url: NICEIC_CERTIFICATE_IMAGE,
          width: 900,
          height: 1125,
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
      <main id="main-content" className="w-full min-w-0 home1-niceic-page">
        <section
          className="home1-niceic-decade"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 3rem)" }}
          aria-labelledby="niceic-decade-heading"
        >
          <div className={SERVICES_PAGE_CONTAINER}>
            <div className="home1-niceic-decade__shell">
              <div className="home1-niceic-decade__hero">
                <p className="home1-niceic-decade__badge">{NICEIC_DECADE.eyebrow}</p>

                <div className="home1-niceic-decade__year-wrap" aria-hidden="true">
                  <div className="home1-niceic-decade__year-box">
                    <span className="home1-niceic-decade__year">{NICEIC_DECADE.years}</span>
                  </div>
                  <span className="home1-niceic-decade__year-pill">{NICEIC_DECADE.yearsLabel}</span>
                </div>

                <h1 id="niceic-decade-heading" className="home1-niceic-decade__title">
                  {NICEIC_DECADE.title}
                </h1>
                <p className="home1-niceic-decade__lead">{NICEIC_DECADE.lead}</p>

                <dl className="home1-niceic-decade__meta">
                  <div className="home1-niceic-decade__meta-item">
                    <dt>{NICEIC_DECADE.webLabel}</dt>
                    <dd>
                      <a href={NICEIC_DECADE.webHref} target="_blank" rel="noopener noreferrer">
                        {NICEIC_DECADE.webValue}
                      </a>
                    </dd>
                  </div>
                  <div className="home1-niceic-decade__meta-item">
                    <dt>{NICEIC_DECADE.basedLabel}</dt>
                    <dd>{NICEIC_DECADE.basedValue}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section
          className="home1-niceic-banner"
          aria-labelledby="niceic-guarantees-heading"
        >
          <h2 id="niceic-guarantees-heading" className="home1-niceic-banner__title">
            {NICEIC_DECADE.guaranteesHeading}
          </h2>
        </section>

        <section className="home1-niceic-guarantees" aria-label="NICEIC guarantees">
          <div className={SERVICES_PAGE_CONTAINER}>
            <ul className="home1-niceic-decade__grid">
              {NICEIC_DECADE.guarantees.map((item, index) => (
                <li key={item.id} className="home1-niceic-decade__card">
                  <span className="home1-niceic-decade__card-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          className="home1-niceic-certificate"
          id="certificate"
          aria-labelledby="niceic-certificate-heading"
        >
          <div className={SERVICES_PAGE_CONTAINER}>
            <div className="home1-niceic-certificate__shell">
              <header className="home1-niceic-certificate__header">
                <p className="home1-niceic-certificate__eyebrow">{NICEIC_CERTIFICATE_PAGE.eyebrow}</p>
                <h2 id="niceic-certificate-heading" className="home1-niceic-certificate__title">
                  <span className="home1-niceic-certificate__title-prefix">
                    {NICEIC_CERTIFICATE_PAGE.titlePrefix}
                  </span>
                  <span className="home1-niceic-certificate__title-name">
                    {NICEIC_CERTIFICATE_PAGE.title}
                  </span>
                </h2>
              </header>

              <div className="home1-niceic-certificate__stage">
                <figure className="home1-niceic-certificate__frame">
                  <Image
                    src={NICEIC_CERTIFICATE_IMAGE}
                    alt="NICEIC Certificate of Excellence awarded to Urgent Electrical Services Limited — celebrating over 10 years' certification"
                    width={900}
                    height={1125}
                    className="home1-niceic-certificate__img"
                    priority
                    sizes="(max-width: 768px) 92vw, 560px"
                  />
                </figure>
              </div>

              <p className="home1-niceic-certificate__footer">{NICEIC_CERTIFICATE_PAGE.footer}</p>

              <div className="home1-niceic-certificate__actions">
                <Link href="/services" className="home1-btn-primary">
                  {NICEIC_CERTIFICATE_PAGE.bookLabel}
                </Link>
                <Link href="/contact-us" className="home1-btn-outline">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
