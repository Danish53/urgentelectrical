"use client";

import { useState } from "react";
import Image from "next/image";
import { usePartners } from "@/hooks/usePartners";
import { HOME_CERTIFICATIONS } from "@/data/homeProjects";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";
import { IconCheck } from "./icons";

function PartnerLogo({ partner }) {
  const [failed, setFailed] = useState(false);
  const alt = `${partner.name} — trusted partner of Urgent Electrical Services Nottingham`;
  const isRemote = Boolean(partner.image?.startsWith("http"));

  return (
    <li>
      <article
        className="home1-partner-card home1-card-shine group w-full"
        aria-label={partner.name}
      >
        <figure className="w-full m-0 flex flex-col items-center gap-2.5">
          <div className="home1-partner-logo-well w-full">
            {!failed && partner.image ? (
              <Image
                src={partner.image}
                alt={alt}
                width={140}
                height={56}
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 140px"
                className="max-h-12 w-auto h-auto object-contain object-center"
                loading="lazy"
                unoptimized={isRemote}
                onError={() => setFailed(true)}
              />
            ) : (
              <span
                className="text-[var(--home1-red)] text-xs font-extrabold uppercase tracking-wide text-center px-2"
                role="img"
                aria-label={alt}
              >
                {partner.name}
              </span>
            )}
          </div>
          <figcaption className="home1-partner-name m-0">{partner.name}</figcaption>
        </figure>
      </article>
    </li>
  );
}

export default function TrustedCertificationsHome1() {
  const { partners } = usePartners();

  return (
    <section
      id="trusted"
      className={`home1-trusted-section ${SECTION_PY} overflow-x-clip scroll-mt-28`}
      aria-labelledby="home-trusted-heading"
    >
      <div className={CONTAINER}>
        <SectionHeader
          id="home-trusted-heading"
          eyebrow="Trusted by"
          title="Certifications & partners"
          description="NICEIC approved contractors trusted by homes and businesses across Nottinghamshire."
          align="center"
        />

        <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 list-none p-0 m-0">
          {HOME_CERTIFICATIONS.map((label) => (
            <li
              key={label}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--home1-border)] bg-white text-[12px] font-bold text-[var(--home1-text)] shadow-sm hover:border-[rgba(211,35,31,0.3)] hover:shadow-md transition-all duration-200"
            >
              <IconCheck className="w-4 h-4 text-[var(--home1-red)] shrink-0" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 list-none p-0 m-0"
          aria-label="Organisations we work with"
        >
          {partners.map((p) => (
            <PartnerLogo key={p.id} partner={p} />
          ))}
        </ul>
      </div>
    </section>
  );
}
