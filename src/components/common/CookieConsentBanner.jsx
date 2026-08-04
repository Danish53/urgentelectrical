"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE_SMOOTH } from "@/lib/motion";
import { mapCookieContent } from "@/lib/cookie/mapCookieContent";
import { fetchCookieSession } from "@/services/cookieApiService";
import "./cookie-consent.css";

const CONSENT_STORAGE_KEY = "ue-cookie-consent";
const emptySubscribe = () => () => {};
const getClientMounted = () => true;
const getServerMounted = () => false;

const DEFAULT_PREFERENCES = {
  functional: false,
  necessary: true,
  targeting: false,
  performance: false,
};

/** @type {{ id: keyof typeof DEFAULT_PREFERENCES, label: string, alwaysActive?: boolean, description: string }[]} */
const COOKIE_CATEGORIES = [
  {
    id: "functional",
    label: "Functional Cookies",
    description:
      "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third-party providers whose services we have added to our pages.",
  },
  {
    id: "necessary",
    label: "Strictly Necessary Cookies",
    alwaysActive: true,
    description:
      "These cookies are essential for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as setting your privacy preferences or filling in forms.",
  },
  {
    id: "targeting",
    label: "Targeting Cookies",
    description:
      "These cookies may be set through our site by advertising partners. They may be used to build a profile of your interests and show you relevant adverts on other sites.",
  },
  {
    id: "performance",
    label: "Performance Cookies",
    description:
      "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.",
  },
];

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

/**
 * @param {{ checked: boolean, disabled?: boolean, onChange: (checked: boolean) => void, label: string }} props
 */
function CookieToggle({ checked, disabled = false, onChange, label }) {
  return (
    <label className={`ue-cookie-toggle${disabled ? " ue-cookie-toggle--disabled" : ""}`}>
      <input
        type="checkbox"
        className="ue-cookie-toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="ue-cookie-toggle__track" aria-hidden="true">
        <span className="ue-cookie-toggle__thumb" />
      </span>
      <span className="sr-only">{label}</span>
    </label>
  );
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, getClientMounted, getServerMounted);
  const [content, setContent] = useState(() => mapCookieContent({}));
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
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

  useEffect(() => {
    if (!customizeOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [customizeOpen]);

  function persistConsent(choice, nextPreferences = preferences) {
    try {
      window.localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          choice,
          preferences: { ...nextPreferences, necessary: true },
          savedAt: Date.now(),
        })
      );
    } catch {
      // Ignore storage errors and still close the UI.
    }

    if (choice === "accepted" || choice === "customized" || choice === "rejected") {
      fetchCookieSession().catch(() => {});
    }
  }

  function closeAll(choice, nextPreferences = preferences) {
    persistConsent(choice, nextPreferences);
    setCustomizeOpen(false);
    setVisible(false);
  }

  function acceptAll() {
    const allOn = {
      functional: true,
      necessary: true,
      targeting: true,
      performance: true,
    };
    setPreferences(allOn);
    closeAll("accepted", allOn);
  }

  function rejectAll() {
    const onlyNecessary = { ...DEFAULT_PREFERENCES };
    setPreferences(onlyNecessary);
    closeAll("rejected", onlyNecessary);
  }

  function confirmChoices() {
    closeAll("customized", preferences);
  }

  function openCustomize() {
    setCustomizeOpen(true);
  }

  const bannerHeading =
    content.bannerHeading || `Help ${content.siteName} to make your experience better`;

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.div
            className={`ue-cookie-consent__backdrop${customizeOpen ? " ue-cookie-consent__backdrop--blur" : ""}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_SMOOTH }}
            aria-hidden="true"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible && !customizeOpen ? (
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
                <span className="ue-cookie-consent__badge" aria-hidden="true">
                  <CookieIcon />
                </span>

                <div className="ue-cookie-consent__content">
                  <h2 className="ue-cookie-consent__heading">{bannerHeading}</h2>
                  <p className="ue-cookie-consent__text">
                    {content.description}{" "}
                    <Link href={content.policyUrl} className="ue-cookie-consent__link">
                      {content.policyLinkText}
                    </Link>
                  </p>
                </div>

                <div className="ue-cookie-consent__actions">
                  <button
                    type="button"
                    className="ue-cookie-consent__btn ue-cookie-consent__btn--primary"
                    onClick={acceptAll}
                  >
                    {content.acceptLabel}
                  </button>
                  <button
                    type="button"
                    className="ue-cookie-consent__btn ue-cookie-consent__btn--primary"
                    onClick={rejectAll}
                  >
                    {content.rejectLabel}
                  </button>
                  <button
                    type="button"
                    className="ue-cookie-consent__btn ue-cookie-consent__btn--outline"
                    onClick={openCustomize}
                  >
                    {content.manageLabel}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible && customizeOpen ? (
          <motion.div
            className="ue-cookie-preferences"
            role="dialog"
            aria-modal="true"
            aria-label={content.modalTitle}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_SMOOTH }}
          >
            <motion.div
              className="ue-cookie-preferences__dialog"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE_SMOOTH }}
            >
              <div className="ue-cookie-preferences__header">
                <p className="ue-cookie-preferences__brand">{content.siteName}</p>
                <button
                  type="button"
                  className="ue-cookie-preferences__skip"
                  onClick={() => closeAll("skipped")}
                >
                  {content.continueWithoutLabel}
                </button>
              </div>

              <div className="ue-cookie-preferences__scroll">
                <div className="ue-cookie-preferences__intro">
                  <h2 className="ue-cookie-preferences__title">{content.modalTitle}</h2>
                  <p className="ue-cookie-preferences__copy">{content.modalIntro}</p>
                  <Link href={content.policyUrl} className="ue-cookie-preferences__more">
                    More information
                  </Link>
                  <div className="ue-cookie-preferences__allow-wrap">
                    <button type="button" className="ue-cookie-preferences__allow-all" onClick={acceptAll}>
                      {content.allowAllLabel}
                    </button>
                  </div>
                </div>

                <div className="ue-cookie-preferences__manage">
                  <h3 className="ue-cookie-preferences__manage-title">{content.preferencesTitle}</h3>

                  <ul className="ue-cookie-preferences__list">
                    {COOKIE_CATEGORIES.map((category) => {
                      const isOpen = expandedCategory === category.id;
                      return (
                        <li key={category.id} className="ue-cookie-preferences__item">
                          <div className="ue-cookie-preferences__row">
                            <button
                              type="button"
                              className="ue-cookie-preferences__expand"
                              aria-expanded={isOpen}
                              onClick={() =>
                                setExpandedCategory(isOpen ? null : category.id)
                              }
                            >
                              <span className="ue-cookie-preferences__expand-icon" aria-hidden="true">
                                {isOpen ? "−" : "+"}
                              </span>
                              <span className="ue-cookie-preferences__row-label">{category.label}</span>
                            </button>

                            {category.alwaysActive ? (
                              <span className="ue-cookie-preferences__always">Always Active</span>
                            ) : (
                              <CookieToggle
                                label={category.label}
                                checked={preferences[category.id]}
                                onChange={(checked) =>
                                  setPreferences((prev) => ({ ...prev, [category.id]: checked }))
                                }
                              />
                            )}
                          </div>

                          {isOpen ? (
                            <p className="ue-cookie-preferences__detail">{category.description}</p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="ue-cookie-preferences__footer">
                <button
                  type="button"
                  className="ue-cookie-preferences__footer-btn"
                  onClick={rejectAll}
                >
                  {content.rejectLabel}
                </button>
                <button
                  type="button"
                  className="ue-cookie-preferences__footer-btn"
                  onClick={confirmChoices}
                >
                  {content.confirmLabel}
                </button>
              </div>

              <p className="ue-cookie-preferences__powered">Powered by {content.siteName}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
