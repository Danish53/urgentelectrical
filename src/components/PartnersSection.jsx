"use client";

import AppImage from "@/components/common/AppImage";
import { PARTNERS } from "@/data/partners";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const CARD_BG = "#222222";
const RED = "#E74C3C";

function PartnerLogo({ partner }) {
  return (
    <div className="flex flex-col items-center text-center h-full">
      <div className="w-full aspect-square max-w-[120px] mx-auto mb-3 rounded-lg border border-white/10 overflow-hidden flex items-center justify-center bg-black/30 relative">
        <AppImage
          src={partner.image}
          alt=""
          width={120}
          height={120}
          className="object-contain p-2"
          fallback={
            <span
              className="text-[10px] sm:text-xs font-bold uppercase px-2 text-center leading-tight"
              style={{
                color: partner.color === "#ffffff" ? "#333" : partner.color,
                backgroundColor: partner.color === "#ffffff" ? "#f5f5f5" : `${partner.color}33`,
              }}
            >
              {partner.name.split(" ")[0]}
            </span>
          }
        />
      </div>
      <p className="text-white/90 text-[11px] sm:text-xs font-medium leading-snug">{partner.name}</p>
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section className="bg-black py-8 sm:py-10 lg:py-12" aria-labelledby="partners-heading">
      <div className={SECTION_CONTAINER}>
        <div className="rounded-xl sm:rounded-2xl px-6 sm:px-10 lg:px-12 py-10 sm:py-12" style={{ backgroundColor: CARD_BG }}>
          <header className="text-center mb-8 sm:mb-10">
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: RED }}>
              Trusted Partnerships
            </p>
            <h2 id="partners-heading" className="text-white text-xl sm:text-2xl lg:text-[28px] font-bold">
              Our business partners
            </h2>
          </header>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
            {PARTNERS.map((partner) => (
              <li
                key={partner.id}
                className="rounded-lg border border-white/10 p-4 sm:p-5 hover:border-white/20 transition-colors duration-200"
              >
                <PartnerLogo partner={partner} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
