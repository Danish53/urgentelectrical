"use client";

import AppImage from "@/components/common/AppImage";
import { PARTNERS } from "@/data/partners";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";

function PartnerLogo({ partner }) {
  return (
    <div className="home1-card flex items-center justify-center p-5 h-28 bg-white hover:border-[var(--home1-red)]/30 transition-colors">
      <AppImage
        src={partner.image}
        alt={partner.name}
        width={110}
        height={44}
        className="max-h-11 max-w-[110px] w-auto h-auto object-contain opacity-90"
        fallback={
          <span className="text-[var(--home1-muted)] text-xs font-semibold text-center px-2">{partner.name}</span>
        }
      />
    </div>
  );
}

export default function PartnersHome1() {
  return (
    <section className={`home1-section-surface ${SECTION_PY} overflow-x-clip`} aria-labelledby="home1-partners-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home1-partners-heading"
          eyebrow="Our partners"
          title="Trusted by leading organisations"
          description="Working with businesses and institutions across the region."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PARTNERS.map((p) => (
            <PartnerLogo key={p.id} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
