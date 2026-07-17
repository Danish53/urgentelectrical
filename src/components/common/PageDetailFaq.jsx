"use client";

import { useState } from "react";

/**
 * @param {{ faqs: { q: string, a: string }[] }} props
 */
export default function PageDetailFaq({ faqs }) {
  const [openId, setOpenId] = useState(-1);
  if (!faqs?.length) return null;

  return (
    <div className="home1-page-detail-faq">
      {faqs.map((item, i) => {
        const isOpen = openId === i;
        const answerId = `page-detail-faq-answer-${i}`;
        const questionId = `page-detail-faq-question-${i}`;
        return (
          <div key={item.q} data-open={isOpen} className="home1-faq-item home1-page-detail-faq-item">
            <button
              type="button"
              id={questionId}
              onClick={() => setOpenId(isOpen ? -1 : i)}
              className="home1-faq-trigger home1-page-detail-faq-trigger"
              aria-expanded={isOpen}
              aria-controls={answerId}
            >
              <span>{item.q}</span>
              <span className="home1-page-detail-faq-icon" aria-hidden="true">
                +
              </span>
            </button>
            <p
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              hidden={!isOpen}
              className="home1-page-detail-faq-answer"
            >
              {item.a}
            </p>
          </div>
        );
      })}
    </div>
  );
}
