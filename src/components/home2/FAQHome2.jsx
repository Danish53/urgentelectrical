"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faqs";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";

export default function FAQHome2() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className="home2-section home2-section--surface overflow-x-clip" aria-labelledby="home2-faq-heading">
      <div className={CONTAINER}>
        <SectionHeader id="home2-faq-heading" eyebrow="FAQ" title="Frequently asked questions" align="center" />
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item) => {
            const open = openId === item.id;
            return (
              <div key={item.id} className={`home2-card overflow-hidden bg-white ${open ? "home2-faq-open" : ""}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-bold text-[var(--h2-navy)]"
                  aria-expanded={open}
                >
                  {item.q}
                  <span className="text-[var(--h2-red)] text-xl font-light shrink-0">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-5 pb-4 text-sm text-[var(--h2-muted)] leading-relaxed border-t border-[var(--h2-border)] pt-3">
                    {item.phone ? (
                      <>
                        {item.a.split("0115 778 0622")[0]}
                        <a href={`tel:${item.phone}`} className="text-[var(--h2-red)] font-semibold">
                          0115 778 0622
                        </a>
                        {item.a.split("0115 778 0622")[1]}
                      </>
                    ) : (
                      item.a
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
