"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/motion";
import { mapCookieContent } from "@/lib/cookie/mapCookieContent";
import { fetchCookieSession } from "@/services/cookieApiService";
import "./cookie-consent.css";

const CONSENT_STORAGE_KEY = "ue-cookie-consent";

function CookieIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        d="M12 3c-4.5 0-8 3.2-8 7.2 0 2.2 1.1 4.1 2.8 5.4.5.4.8 1 .8 1.6v.2c0 .8.7 1.5 1.5 1.5h.4c.5 0 1 .3 1.2.8.5 1.1 1.6 1.9 2.9 1.9 3.7 0 6.4-3.1 6.4-6.8C20 6.4 16.4 3 12 3z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="9" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="13.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState(() => mapCookieContent({}));
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);

    fetchCookieSession()
      .then((data) => setContent(mapCookieContent(data)))
      .catch(() => setContent(mapCookieContent({})));

    try {
      const saved = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!saved) {
        const timer = window.setTimeout(() => setVisible(true), 900);
        return () => window.clearTimeout(timer);
      }
    } catch {
      const timer = window.setTimeout(() => setVisible(true), 900);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function closeBanner(choice) {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Ignore storage errors and still close the banner.
    }

    if (choice === "accepted" || choice === "customized") {
      fetchCookieSession().catch(() => {});
    }

    setVisible(false);
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="ue-cookie-consent"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE_SMOOTH }}
        >
          <motion.div
            className="ue-cookie-consent__panel"
            initial={reduceMotion ? false : { y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.55, ease: EASE_SMOOTH }}
          >
            <div className="ue-cookie-consent__card">
              <div className="ue-cookie-consent__content">
                <span className="ue-cookie-consent__icon" aria-hidden="true">
                  <CookieIcon />
                </span>
                <p className="ue-cookie-consent__text">
                  <strong>{content.title}</strong>
                  {content.description}{" "}
                  <Link href={content.policyUrl} className="ue-cookie-consent__link">
                    {content.policyLinkText}
                  </Link>
                </p>
              </div>

              <div className="ue-cookie-consent__actions">
                <button
                  type="button"
                  className="ue-cookie-consent__btn ue-cookie-consent__btn--accept"
                  onClick={() => closeBanner("accepted")}
                >
                  {content.acceptLabel}
                </button>
                <button
                  type="button"
                  className="ue-cookie-consent__btn ue-cookie-consent__btn--reject"
                  onClick={() => closeBanner("rejected")}
                >
                  {content.rejectLabel}
                </button>
                {/* <button
                  type="button"
                  className="ue-cookie-consent__btn ue-cookie-consent__btn--settings"
                  onClick={() => closeBanner("customized")}
                >
                  {content.manageLabel}
                </button> */}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
