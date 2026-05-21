"use client";

import { useState } from "react";
import { HOME_FAQ_ITEMS } from "@/data/homeSeo";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionHeader from "./SectionHeader";

export default function FAQHome1({ items = HOME_FAQ_ITEMS }) {
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  return (
    <section
      id="faq"
      className={`home1-section-surface ${SECTION_PY} overflow-x-clip scroll-mt-28`}
      aria-labelledby="home1-faq-heading"
    >
      <div className={CONTAINER}>
        <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-16 items-start">
          <div className="lg:sticky lg:top-28 pt-2">
            <SectionHeader
              id="home1-faq-heading"
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Quick answers from our NICEIC approved Nottingham team."
              align="left"
              compact
            />
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} data-open={isOpen} className="home1-faq-item home1-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenId((c) => (c === item.id ? null : item.id))}
                    className="home1-faq-trigger w-full flex items-center gap-4 text-left px-5 sm:px-6 py-5 font-bold text-[var(--home1-text)]"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="w-9 h-9 rounded-xl text-white text-sm font-black flex items-center justify-center shrink-0"
                      style={{ background: "var(--home1-red)" }}
                    >
                      Q
                    </span>
                    <span className="flex-1 text-[15px] leading-snug">{item.q}</span>
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-lg font-light transition-colors"
                      style={{
                        background: isOpen ? "var(--home1-red)" : "var(--home1-surface)",
                        color: isOpen ? "#fff" : "var(--home1-red)",
                      }}
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pl-[4.5rem] border-t border-[var(--home1-border)] pt-4">
                      <p className="text-[var(--home1-muted)] text-[14px] leading-[1.75]">
                        {item.phone ? (
                          <>
                            {item.a.split("0115 778 0622")[0]}
                            <a href={`tel:${item.phone}`} className="font-semibold hover:underline" style={{ color: "var(--home1-red)" }}>
                              0115 778 0622
                            </a>
                            {item.a.split("0115 778 0622")[1]}
                          </>
                        ) : (
                          item.a
                        )}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
