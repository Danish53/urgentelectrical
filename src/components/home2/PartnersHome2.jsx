"use client";

import { useState } from "react";
import { PARTNERS } from "@/data/partners";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";

function PartnerLogo({ partner }) {
  const [fail, setFail] = useState(false);
  return (
    <div className="home2-card flex items-center justify-center h-24 p-4 bg-[#141414] border-white/10">
      {!fail ? (
        <img src={partner.image} alt={partner.name} className="max-h-10 max-w-[100px] object-contain brightness-110" onError={() => setFail(true)} />
      ) : (
        <span className="text-xs font-semibold text-white/50 text-center">{partner.name}</span>
      )}
    </div>
  );
}

export default function PartnersHome2() {
  return (
    <section className="home2-section home2-section--dark overflow-x-clip" aria-labelledby="home2-partners-heading">
      <div className={CONTAINER}>
        <SectionHeader id="home2-partners-heading" eyebrow="Our partners" title="Trusted by leading organisations" light />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {PARTNERS.map((p) => (
            <PartnerLogo key={p.id} partner={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
