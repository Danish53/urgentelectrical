"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { formatIdealAddressLabel } from "@/lib/idealPostcodes/mapIdealAddress";
import { EMPTY_SITE_FORM, mapIdealAddressToSiteForm } from "@/lib/sites/siteForm";
import { fetchAddressesByPostcode } from "@/services/idealPostcodesApiService";

const INPUT = `${AUTH_INPUT_CLASS} home1-sites-input`;

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function Field({ id, label, optional, children }) {
  return (
    <div className="home1-sites-field">
      <label htmlFor={id} className={AUTH_LABEL_CLASS}>
        {label}
        {optional ? <span className="home1-sites-optional"> (optional)</span> : null}
      </label>
      {children}
    </div>
  );
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSubmit: (form: import("@/lib/sites/siteForm").SiteFormValues) => void | Promise<void>,
 *   saving?: boolean,
 *   mode?: "create" | "edit",
 *   initialForm?: import("@/lib/sites/siteForm").SiteFormValues,
 *   siteName?: string,
 *   hideContactDetails?: boolean,
 * }} props
 */
export default function CreateSiteModal({
  open,
  onClose,
  onSubmit,
  saving = false,
  mode = "create",
  initialForm,
  siteName = "",
  hideContactDetails = false,
}) {
  const titleId = useId();
  const postcodeErrorId = useId();
  const [form, setForm] = useState(EMPTY_SITE_FORM);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [lookupSuggestions, setLookupSuggestions] = useState([]);
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressPicked, setAddressPicked] = useState(false);
  const isEdit = mode === "edit";

  function resetLookup() {
    setLookupError("");
    setLookupSuggestions([]);
    setAddressOptions([]);
    setAddressPicked(false);
  }

  useEffect(() => {
    if (open) {
      setForm(initialForm ?? EMPTY_SITE_FORM);
      resetLookup();
    }
  }, [open, initialForm]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, saving]);

  if (!open) return null;

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handlePostcodeChange(value) {
    resetLookup();
    setForm((prev) => ({
      ...prev,
      postcode: value.toUpperCase(),
      addressLine1: "",
      addressLine2: "",
      townCity: "",
      county: "",
    }));
  }

  async function handleFind() {
    const postcode = form.postcode.trim();
    if (!postcode) {
      setLookupError("Please enter a postcode.");
      return;
    }

    setLookupLoading(true);
    setLookupError("");
    setLookupSuggestions([]);
    setAddressOptions([]);
    setAddressPicked(false);

    try {
      const { addresses } = await fetchAddressesByPostcode(postcode);
      if (!addresses.length) {
        setLookupError("No addresses found for this postcode.");
        return;
      }
      setAddressOptions(addresses);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "Could not find addresses.");
      if (err instanceof Error && "suggestions" in err && Array.isArray(err.suggestions)) {
        setLookupSuggestions(err.suggestions);
      }
    } finally {
      setLookupLoading(false);
    }
  }

  function handleSelectAddress(udprn) {
    if (!udprn) return;

    const match = addressOptions.find((item) => String(item.udprn ?? "") === udprn);
    if (!match) return;

    const mapped = mapIdealAddressToSiteForm(match);
    setForm((prev) => ({ ...prev, ...mapped }));
    setAddressPicked(true);
    setAddressOptions([]);
  }

  const showAddressSelect = addressOptions.length > 0 && !addressPicked;
  const displayPostcodeError = lookupError;

  async function handleSubmit(e) {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!form.postcode.trim() || !form.addressLine1.trim() || !form.townCity.trim()) return;
    await onSubmit(form);
  }

  const modal = (
    <div className="home1-sites-modal-root" role="presentation">
      <button
        type="button"
        className="home1-sites-modal-backdrop"
        aria-label="Close dialog"
        onClick={() => !saving && onClose()}
      />
      <div
        className="home1-sites-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="home1-sites-modal-head">
          <div>
            <p className="home1-sites-modal-eyebrow">{isEdit ? "Update location" : "Add location"}</p>
            <h2 id={titleId} className="home1-sites-modal-title">
              {isEdit ? `Update: ${siteName || "site address"}` : "New site address"}
            </h2>
          </div>
          <button
            type="button"
            className="home1-sites-modal-close"
            onClick={onClose}
            disabled={saving}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="home1-sites-modal-form">
          <div className="home1-sites-modal-body">
            <Field id="site-country" label="Country / Region">
              <input
                id="site-country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="e.g. United Kingdom"
                className={INPUT}
                required
                disabled={saving}
                autoComplete="country-name"
              />
            </Field>

            <div className="home1-sites-form-grid home1-sites-form-grid--2">
              <div className="home1-sites-field home1-sites-field--postcode">
                <label htmlFor="site-postcode" className={AUTH_LABEL_CLASS}>
                  Postcode
                </label>
                <div className="home1-sites-postcode-row">
                  <input
                    id="site-postcode"
                    value={form.postcode}
                    onChange={(e) => handlePostcodeChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleFind();
                      }
                    }}
                    placeholder="e.g. NG1 1AA"
                    className={`${INPUT}${displayPostcodeError ? " home1-sites-input--error" : ""}`}
                    required
                    disabled={saving || lookupLoading}
                    autoComplete="postal-code"
                    aria-invalid={displayPostcodeError ? "true" : undefined}
                    aria-describedby={displayPostcodeError ? postcodeErrorId : undefined}
                  />
                  <button
                    type="button"
                    className="home1-sites-postcode-find"
                    onClick={handleFind}
                    disabled={saving || lookupLoading}
                    aria-busy={lookupLoading}
                  >
                    {lookupLoading ? (
                      <>
                        <ButtonSpinner className="h-4 w-4 text-white" />
                        <span>Finding…</span>
                      </>
                    ) : (
                      <>
                        <IconSearch />
                        <span>Find</span>
                      </>
                    )}
                  </button>
                </div>
                {displayPostcodeError ? (
                  <p id={postcodeErrorId} className="home1-sites-field-error" role="alert">
                    {displayPostcodeError}
                    {lookupSuggestions.length ? (
                      <span className="home1-sites-lookup-suggestions">
                        {" "}
                        Did you mean:{" "}
                        {lookupSuggestions.map((suggestion, index) => (
                          <button
                            key={suggestion}
                            type="button"
                            className="home1-sites-lookup-suggestion"
                            onClick={() => {
                              handlePostcodeChange(suggestion);
                              setLookupError("");
                              setLookupSuggestions([]);
                            }}
                          >
                            {suggestion}
                            {index < lookupSuggestions.length - 1 ? ", " : ""}
                          </button>
                        ))}
                      </span>
                    ) : null}
                  </p>
                ) : null}
              </div>
              <Field id="site-county" label="County" optional>
                <input
                  id="site-county"
                  value={form.county}
                  onChange={(e) => update("county", e.target.value)}
                  placeholder="Type here"
                  className={INPUT}
                  disabled={saving}
                />
              </Field>
            </div>

            {showAddressSelect ? (
              <Field id="site-address-select" label="Select address">
                <select
                  id="site-address-select"
                  className={`${INPUT} home1-sites-address-select`}
                  defaultValue=""
                  onChange={(e) => handleSelectAddress(e.target.value)}
                  required
                  disabled={saving}
                >
                  <option value="" disabled>
                    Select an address…
                  </option>
                  {addressOptions.map((address) => {
                    const key = String(address.udprn ?? formatIdealAddressLabel(address));
                    return (
                      <option key={key} value={String(address.udprn ?? "")}>
                        {formatIdealAddressLabel(address)}
                      </option>
                    );
                  })}
                </select>
              </Field>
            ) : null}

            <Field id="site-line1" label="Address line 1">
              <input
                id="site-line1"
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
                placeholder="Street and number"
                className={INPUT}
                required
                disabled={saving}
                autoComplete="address-line1"
              />
            </Field>

            <Field id="site-line2" label="Address line 2" optional>
              <input
                id="site-line2"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
                placeholder="Flat, suite, building"
                className={INPUT}
                disabled={saving}
                autoComplete="address-line2"
              />
            </Field>

            <Field id="site-town" label="Town / City">
              <input
                id="site-town"
                value={form.townCity}
                onChange={(e) => update("townCity", e.target.value)}
                placeholder="Type here"
                className={INPUT}
                required
                disabled={saving}
                autoComplete="address-level2"
              />
            </Field>

            <label className="home1-sites-checkbox">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => update("isDefault", e.target.checked)}
                disabled={saving}
              />
              <span>Use as my default address</span>
            </label>

            {!hideContactDetails ? (
              <>
            <div className="home1-sites-modal-divider">
              <p className="home1-sites-modal-divider-label">Contact details</p>
            </div>

            <div className="home1-sites-form-grid home1-sites-form-grid--3">
              <Field id="site-title" label="Title" optional>
                <input
                  id="site-title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Mr, Mrs"
                  className={INPUT}
                  disabled={saving}
                />
              </Field>
              <Field id="site-first" label="First name" optional>
                <input
                  id="site-first"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  placeholder="Type here"
                  className={INPUT}
                  disabled={saving}
                />
              </Field>
              <Field id="site-last" label="Last name" optional>
                <input
                  id="site-last"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  placeholder="Type here"
                  className={INPUT}
                  disabled={saving}
                />
              </Field>
            </div>

            <div className="home1-sites-form-grid home1-sites-form-grid--2">
              <Field id="site-mobile" label="Mobile (SMS)" optional>
                <input
                  id="site-mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  placeholder="Type here"
                  className={INPUT}
                  disabled={saving}
                  autoComplete="tel"
                />
              </Field>
              <Field id="site-email" label="Email" optional>
                <input
                  id="site-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Type here"
                  className={INPUT}
                  disabled={saving}
                  autoComplete="email"
                />
              </Field>
            </div>

            <Field id="site-desc" label="Description" optional>
              <textarea
                id="site-desc"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Access notes, parking, gate codes…"
                className={`${INPUT} home1-sites-textarea`}
                rows={3}
                disabled={saving}
              />
            </Field>
              </>
            ) : null}
          </div>

          <footer className="home1-sites-modal-foot">
            <button
              type="button"
              className="home1-btn-outline home1-sites-modal-btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="home1-btn-primary home1-sites-modal-btn inline-flex items-center justify-center gap-2"
              disabled={saving}
              onClick={handleSubmit}
            >
              {saving ? <ButtonSpinner /> : null}
              {saving ? "Saving…" : isEdit ? "Update site" : "Add site"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
