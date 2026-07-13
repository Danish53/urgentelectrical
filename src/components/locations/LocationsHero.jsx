"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSimpleServicesList } from "@/hooks/useServices";
import { useServicePostcodeLookup } from "@/hooks/useServicePostcodeLookup";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import ServicePostcodeResultModal from "@/components/shared/ServicePostcodeResultModal";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { IconCheck } from "@/components/home1/icons";
import { LOCATIONS_HERO } from "@/data/locationsPage";
import { HERO_CONTAINER, HERO_ITEM, HERO_TITLE } from "@/lib/motion";

export default function LocationsHero() {
  const reduceMotion = useReducedMotion();
  const { options, loading: servicesLoading } = useSimpleServicesList();
  const { lookup, submitting, modalOpen, modalVariant, modalMessage, closeModal, bookService } =
    useServicePostcodeLookup("locations");
  const [serviceSlug, setServiceSlug] = useState("");
  const [postcode, setPostcode] = useState("");
  const [serviceRequiredOpen, setServiceRequiredOpen] = useState(false);
  const [postcodeRequiredOpen, setPostcodeRequiredOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (submitting) return;
    if (!serviceSlug.trim()) {
      setServiceRequiredOpen(true);
      return;
    }
    if (!postcode.trim()) {
      setPostcodeRequiredOpen(true);
      return;
    }
    lookup({ serviceSlug, postCode: postcode });
  }

  return (
    <>
      <section
        className="home1-locations-hero relative bg-black overflow-x-clip pb-10 sm:pb-12 lg:pb-14"
        style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
        aria-labelledby="locations-hero-heading"
      >
        <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
        <div className="home1-hero-orb home1-hero-orb--left" aria-hidden="true" />
        <div className="home1-hero-orb home1-hero-orb--right" aria-hidden="true" />

        <div className={`${SERVICES_PAGE_CONTAINER} relative z-10`}>
          <motion.div
            variants={reduceMotion ? undefined : HERO_CONTAINER}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
            className="min-w-0 flex flex-col items-center text-center max-w-3xl mx-auto"
          >
            <motion.h1
              id="locations-hero-heading"
              variants={reduceMotion ? undefined : HERO_TITLE}
              className="text-white text-[26px] sm:text-[38px] lg:text-[46px] font-extrabold leading-[1.1] tracking-tight mb-4 sm:mb-5"
            >
              {LOCATIONS_HERO.title}{" "}
              <span className="text-[#ff5a3c]">{LOCATIONS_HERO.titleAccent}</span>
            </motion.h1>

            <motion.p
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="text-white/80 text-[14px] sm:text-[16px] leading-relaxed mb-5 sm:mb-6 max-w-xl mx-auto"
            >
              {LOCATIONS_HERO.description}
            </motion.p>

            <motion.ul
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="flex flex-wrap justify-center gap-2 list-none p-0 m-0 mb-6 sm:mb-8"
            >
              {LOCATIONS_HERO.highlights.map((h) => (
                <li
                  key={h}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-[11px] sm:text-[12px] font-semibold text-white/90"
                >
                  <IconCheck className="w-3.5 h-3.5 text-[#4ADE80] shrink-0" />
                  {h}
                </li>
              ))}
            </motion.ul>

            <motion.div
              variants={reduceMotion ? undefined : HERO_ITEM}
              className="home1-locations-search-slim home1-locations-search-slim--in-hero w-full"
            >
              <h2 className="home1-locations-search-slim__title">Find services in your area</h2>
              <p className="home1-locations-search-slim__subtitle">
                Select a service &amp; enter your postcode to get started
              </p>

              <form
                onSubmit={handleSearch}
                className="home1-locations-search-slim__form"
                aria-label="Search services by postcode"
              >
                <label htmlFor="locations-service" className="sr-only">
                  Service
                </label>
                {servicesLoading ? (
                  <FormFieldSkeleton className="home1-locations-search-slim__skeleton home1-locations-search-slim__skeleton--select" />
                ) : (
                  <select
                    id="locations-service"
                    name="service"
                    value={serviceSlug}
                    onChange={(e) => setServiceSlug(e.target.value)}
                    disabled={!options.length || submitting}
                    className={`home1-locations-search-slim__field home1-locations-search-slim__field--select${!serviceSlug ? " is-placeholder" : ""}`}
                  >
                    <option value="" disabled>
                      Select a Service
                    </option>
                    {options.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}

                {servicesLoading ? (
                  <FormFieldSkeleton className="home1-locations-search-slim__skeleton home1-locations-search-slim__skeleton--postcode" />
                ) : (
                  <>
                    <label htmlFor="locations-postcode" className="sr-only">
                      Postcode
                    </label>
                    <input
                      id="locations-postcode"
                      name="postcode"
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                      placeholder="Enter postcode"
                      autoComplete="postal-code"
                      maxLength={8}
                      disabled={submitting}
                      className="home1-locations-search-slim__field home1-locations-search-slim__field--postcode"
                    />
                  </>
                )}

                <button
                  type="submit"
                  className="home1-locations-search-slim__btn"
                  disabled={servicesLoading || submitting}
                >
                  {submitting ? <ButtonSpinner className="h-4 w-4" /> : "Search"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ServicePostcodeResultModal
        open={serviceRequiredOpen}
        variant="error"
        title="Oops"
        message="Please select a service!"
        onClose={() => setServiceRequiredOpen(false)}
      />

      <ServicePostcodeResultModal
        open={postcodeRequiredOpen}
        variant="error"
        title="Oops"
        message="Please enter your postcode!"
        onClose={() => setPostcodeRequiredOpen(false)}
      />

      <ServicePostcodeResultModal
        open={modalOpen}
        variant={modalVariant}
        message={modalMessage}
        onClose={closeModal}
        onBook={bookService}
      />
    </>
  );
}
