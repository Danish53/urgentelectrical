"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FAQ_ITEMS } from "@/data/faqs";
import { STAGGER_CONTAINER, STAGGER_ITEM, STAGGER_VIEWPORT } from "@/lib/motion";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const RED = "#C0392B";

function ChevronDown() {
  return (
    <svg className="w-5 h-5 text-[#bdbdbd]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FAQAccordionItem({ item, isOpen, onToggle }) {
  const panelId = `faq-panel-${item.id}`;

  return (
    <motion.div
      variants={STAGGER_ITEM}
      className={`border-b border-[#eeeeee] last:border-b-0 ${isOpen ? "bg-[#f5f5f5]" : "bg-white"}`}
    >
      <button
        id={`faq-trigger-${item.id}`}
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center gap-4 sm:gap-5 py-5 sm:py-[22px] px-4 sm:px-6 text-left cursor-pointer transition-colors duration-200 ${
          !isOpen ? "hover:bg-[#fafafa]" : ""
        }`}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span
          className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-[6px] flex items-center justify-center text-white text-[13px] font-bold"
          style={{ backgroundColor: RED }}
          aria-hidden="true"
        >
          Q
        </span>
        <span className="flex-1 font-bold text-black text-[14px] sm:text-[15px] leading-[1.45] pr-3">
          {item.q}
        </span>
        <span className="shrink-0 flex items-center justify-center w-9 h-9" aria-hidden="true">
          {isOpen ? (
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: RED }}
            >
              <ChevronUp />
            </span>
          ) : (
            <ChevronDown />
          )}
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`faq-trigger-${item.id}`}
        aria-hidden={!isOpen}
        className={`faq-answer-grid transition-all duration-300 ease-in-out ${isOpen ? "faq-answer-open" : "faq-answer-closed"}`}
      >
        <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-0">
          <div className="pl-[52px] sm:pl-[60px] pr-2">
            <p className="text-[#555555] text-[14px] sm:text-[15px] leading-[1.75]">
              {item.phone ? (
                <>
                  {item.a.split("0115 778 0622")[0]}
                  <a href={`tel:${item.phone}`} className="hover:underline" style={{ color: RED }}>
                    0115 778 0622
                  </a>
                  {item.a.split("0115 778 0622")[1]}
                </>
              ) : (
                item.a
              )}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState(FAQ_ITEMS[0]?.id ?? null);
  const reduceMotion = useReducedMotion();

  const handleToggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 overflow-x-clip" aria-labelledby="faq-section-heading">
      <div className={SECTION_CONTAINER}>
        <header className="pb-5 sm:pb-6 mb-0 border-b border-[#eeeeee]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
            <div>
              <span className="block w-14 h-[4px] mb-4" style={{ backgroundColor: RED }} aria-hidden="true" />
              <h2
                id="faq-section-heading"
                className="font-bold text-black text-[15px] sm:text-base uppercase tracking-wide"
              >
                Frequently Asked Questions
              </h2>
            </div>
            <p
              className="font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.1em] sm:pb-0.5 sm:text-right"
              style={{ color: RED }}
            >
              Electricians in Nottingham
            </p>
          </div>
        </header>

        <motion.div
          className="mt-0"
          role="list"
          variants={reduceMotion ? undefined : STAGGER_CONTAINER}
          initial={reduceMotion ? false : "hidden"}
          whileInView={reduceMotion ? undefined : "visible"}
          viewport={STAGGER_VIEWPORT}
        >
          {FAQ_ITEMS.map((item) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => handleToggle(item.id)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
