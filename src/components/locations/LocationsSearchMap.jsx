"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useSimpleServicesList } from "@/hooks/useServices";
import { useServicePostcodeLookup } from "@/hooks/useServicePostcodeLookup";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import ServicePostcodeResultModal from "@/components/shared/ServicePostcodeResultModal";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

const LocationsLeafletMap = dynamic(() => import("@/components/locations/LocationsLeafletMap"), {
  ssr: false,
  loading: () => <div className="home1-locations-map__loading" aria-hidden="true" />,
});

export default function LocationsSearchMap() {
  const { options, loading: servicesLoading } = useSimpleServicesList();
  const { lookup, submitting, modalOpen, modalVariant, modalMessage, closeModal, bookService } =
    useServicePostcodeLookup("locations");
  const [serviceSlug, setServiceSlug] = useState("");
  const [postcode, setPostcode] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (!serviceSlug.trim() || !postcode.trim() || submitting) return;
    lookup({ serviceSlug, postCode: postcode });
  }

  return (
    <>
      <section className="home1-locations-search" aria-label="Find services in your area">
        <div className={SERVICES_PAGE_CONTAINER}>
          <div className="home1-locations-search-slim">
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
                  required
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
                    required
                    disabled={submitting}
                    className="home1-locations-search-slim__field home1-locations-search-slim__field--postcode"
                  />
                </>
              )}

              <button
                type="submit"
                className="home1-locations-search-slim__btn"
                disabled={servicesLoading || !options.length || submitting || !serviceSlug || !postcode.trim()}
              >
                {submitting ? <ButtonSpinner className="h-4 w-4" /> : "Search"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="home1-locations-map-section" aria-label="Coverage map">
        <div className={SERVICES_PAGE_CONTAINER}>
          <div className="home1-locations-map">
            <LocationsLeafletMap />
          </div>
        </div>
      </section>

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
