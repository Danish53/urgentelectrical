"use client";

import { useState } from "react";
import CheckoutAddressLookup from "@/components/checkout/CheckoutAddressLookup";
import CheckoutSiteAddressModal from "@/components/checkout/CheckoutSiteAddressModal";
import { mapSavedSiteToCheckoutDetails } from "@/lib/checkout/mapSavedSiteToCheckoutDetails";

const labelClass = "home1-checkout-label";
const inputClass = "home1-checkout-input";

export default function CheckoutDetailsStep({
  details,
  onChange,
  onBack,
  onContinue,
  error,
  submitting = false,
  isLoggedIn = false,
}) {
  const [siteModalOpen, setSiteModalOpen] = useState(false);
  const [selectedSiteLabel, setSelectedSiteLabel] = useState("");

  function set(field, value) {
    onChange({ ...details, [field]: value });
  }

  function handleSiteSelect(site) {
    onChange(mapSavedSiteToCheckoutDetails(site, details));
    setSelectedSiteLabel(site.name || site.address);
  }

  return (
    <div className="home1-checkout-step-panel home1-checkout-step-panel--details">
      <header className="home1-checkout-step-header">
        <p className="home1-checkout-step-eyebrow">Step 2 of 3</p>
        <h2 className="home1-checkout-step-title">Your details</h2>
        <p className="home1-checkout-step-lead">Contact details and job location.</p>
      </header>

      <form
        className="home1-checkout-card home1-checkout-form-card home1-checkout-form home1-checkout-details-form"
        onSubmit={(e) => {
          e.preventDefault();
          onContinue();
        }}
        noValidate
      >
        {error ? (
          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
            {error}
          </p>
        ) : null}

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor="checkout-first" className={labelClass}>
              First name<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-first"
              value={details.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              className={inputClass}
              autoComplete="given-name"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-last" className={labelClass}>
              Last name<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-last"
              value={details.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              className={inputClass}
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div className="home1-checkout-form-grid">
          <div>
            <label htmlFor="checkout-email" className={labelClass}>
              Email<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-email"
              type="email"
              value={details.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label htmlFor="checkout-phone" className={labelClass}>
              Phone<span className="text-[#d3231f]">*</span>
            </label>
            <input
              id="checkout-phone"
              type="tel"
              value={details.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputClass}
              autoComplete="tel"
              required
            />
          </div>
        </div>

        {!isLoggedIn ? (
          <>
            <div className="home1-checkout-form-grid">
              <div>
                <label htmlFor="checkout-password" className={labelClass}>
                  Password<span className="text-[#d3231f]">*</span>
                </label>
                <input
                  id="checkout-password"
                  type="password"
                  value={details.password ?? ""}
                  onChange={(e) => set("password", e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label htmlFor="checkout-password-confirm" className={labelClass}>
                  Confirm password<span className="text-[#d3231f]">*</span>
                </label>
                <input
                  id="checkout-password-confirm"
                  type="password"
                  value={details.passwordConfirmation ?? ""}
                  onChange={(e) => set("passwordConfirmation", e.target.value)}
                  className={inputClass}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>
            <p className="home1-checkout-form-hint">
              Create a password to manage bookings in your account.
            </p>
          </>
        ) : null}

        <CheckoutAddressLookup
          details={details}
          onChange={onChange}
          isLoggedIn={isLoggedIn}
          selectedSiteLabel={selectedSiteLabel}
          onClearSavedSite={() => setSelectedSiteLabel("")}
          onOpenSavedAddresses={() => setSiteModalOpen(true)}
        />

        <div>
          <label htmlFor="checkout-notes" className={labelClass}>
            Notes for the engineer (optional)
          </label>
          <textarea
            id="checkout-notes"
            rows={2}
            value={details.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={`${inputClass} home1-checkout-textarea`}
          />
        </div>

        <div className="home1-checkout-step-actions">
          <button type="button" onClick={onBack} className="home1-checkout-back-btn">
            ← Back
          </button>
          <button type="submit" className="home1-checkout-continue" disabled={submitting}>
            <span>{submitting ? "Validating…" : "Continue to payment"}</span>
            {!submitting ? <span className="home1-checkout-continue-arrow" aria-hidden="true">→</span> : null}
          </button>
        </div>
      </form>

      {isLoggedIn ? (
        <CheckoutSiteAddressModal
          open={siteModalOpen}
          onClose={() => setSiteModalOpen(false)}
          onSelect={handleSiteSelect}
        />
      ) : null}
    </div>
  );
}
