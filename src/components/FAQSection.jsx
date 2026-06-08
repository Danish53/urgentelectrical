"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/data/faqs";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";

function ChevronDown() {
  return (
    <svg className="faq-item__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FAQAccordionItem({ item, isOpen, onToggle }) {
  const panelId = `faq-panel-${item.id}`;

  return (
    <div className={`faq-item ${isOpen ? "is-open" : ""}`}>
      <button
        id={`faq-trigger-${item.id}`}
        type="button"
        onClick={onToggle}
        className="faq-item__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="faq-item__q" aria-hidden="true">
          Q
        </span>
        <span className="faq-item__question">{item.q}</span>
        {isOpen ? (
          <span className="faq-item__toggle" aria-hidden="true">
            <ChevronUp />
          </span>
        ) : (
          <ChevronDown />
        )}
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
        aria-hidden={!isOpen}
        className={`faq-answer-grid ${isOpen ? "faq-answer-open" : "faq-answer-closed"}`}
      >
        <div className="faq-item__answer-wrap">
          <p className="faq-item__answer">
            {item.phone ? (
              <>
                {item.a.split("0115 778 0622")[0]}
                <a href={`tel:${item.phone}`}>0115 778 0622</a>
                {item.a.split("0115 778 0622")[1]}
              </>
            ) : (
              item.a
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="faq-section bg-white py-14 sm:py-16 lg:py-20 overflow-x-clip" aria-labelledby="faq-section-heading">
      <div className={SECTION_CONTAINER}>
        <header className="faq-section__header">
          <div>
            <span className="faq-section__accent" aria-hidden="true" />
            <h2 id="faq-section-heading" className="faq-section__title">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="faq-section__kicker">Electricians in Nottingham</p>
        </header>

        <div role="list">
          {FAQ_ITEMS.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
