"use client";

import { useCallback } from "react";
import CheckoutAddressLookup from "@/components/checkout/CheckoutAddressLookup";
import CheckoutSavedSitesSection from "@/components/checkout/CheckoutSavedSitesSection";
import CheckoutSiteSameToggle from "@/components/checkout/CheckoutSiteSameToggle";
import { mapSavedSiteToLoggedInCheckoutDetails } from "@/lib/checkout/mapSavedSiteToCheckoutDetails";

const labelClass = "home1-checkout-label";
const inputClass = "home1-checkout-input";

function CheckoutNotesField({ details, onChange }) {
  function set(field, value) {
    onChange({ ...details, [field]: value });
  }

  return (
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
  );
}

function CheckoutStepActions({ onBack, submitting }) {
  return (
    <div className="home1-checkout-step-actions">
      <button type="button" onClick={onBack} className="home1-checkout-back-btn">
        ← Back
      </button>
      <button type="submit" className="home1-checkout-continue" disabled={submitting}>
        <span>{submitting ? "Validating…" : "Continue to payment"}</span>
        {!submitting ? <span className="home1-checkout-continue-arrow" aria-hidden="true">→</span> : null}
      </button>
    </div>
  );
}

export default function CheckoutDetailsStep({
  details,
  onChange,
  onSiteSameChange,
  onSitePostcodeBeforeLookup,
  siteSameChecking = false,
  onBack,
  onContinue,
  error,
  fieldErrors = {},
  submitting = false,
  isLoggedIn = false,
}) {
  const handleLoggedInSiteSelect = useCallback(
    (site) => {
      onChange(mapSavedSiteToLoggedInCheckoutDetails(site, details));
    },
    [details, onChange]
  );

  function set(field, value) {
    onChange({ ...details, [field]: value });
  }

  function handleSiteSameChange(same) {
    onSiteSameChange?.(same);
  }

  if (isLoggedIn) {
    return (
      <div className="home1-checkout-step-panel home1-checkout-step-panel--details">
        <header className="home1-checkout-step-header">
          <p className="home1-checkout-step-eyebrow">Step 2 of 3</p>
          <h2 className="home1-checkout-step-title">Site address</h2>
          <p className="home1-checkout-step-lead">Choose where we should carry out the work.</p>
        </header>

        <form
          className="home1-checkout-form home1-checkout-details-form home1-checkout-details-form--logged-in"
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

          <CheckoutSavedSitesSection
            selectedSiteId={details.siteAddressId}
            onSelectSite={handleLoggedInSiteSelect}
            selectionError={fieldErrors.selectedSite}
            onBeforePostcodeLookup={onSitePostcodeBeforeLookup}
          />

          <CheckoutNotesField details={details} onChange={onChange} />

          <CheckoutStepActions onBack={onBack} submitting={submitting} />
        </form>
      </div>
    );
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
              className="home1-checkout-input"
              autoComplete="tel"
              required
            />
          </div>
        </div>

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

        <CheckoutAddressLookup
          details={details}
          onChange={onChange}
          variant="billing"
          sectionTitle="Billing Address"
          postcodeError={fieldErrors.billingPostcode}
        />

        <CheckoutSiteSameToggle
          value={details.siteSameAsBilling ?? null}
          onChange={handleSiteSameChange}
          checking={siteSameChecking}
          error={fieldErrors.siteSameAsBilling}
        />

        {details.siteSameAsBilling === false ? (
          <CheckoutAddressLookup
            details={details}
            onChange={onChange}
            variant="site"
            sectionTitle="Site Address"
            postcodeError={fieldErrors.sitePostcode}
            onBeforePostcodeLookup={onSitePostcodeBeforeLookup}
          />
        ) : null}

        <CheckoutNotesField details={details} onChange={onChange} />

        <CheckoutStepActions onBack={onBack} submitting={submitting} />
      </form>
    </div>
  );
}
