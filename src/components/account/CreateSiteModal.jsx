"use client";

import { useEffect, useId, useState } from "react";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { EMPTY_SITE_FORM } from "@/lib/sites/siteForm";

const INPUT = `${AUTH_INPUT_CLASS} home1-sites-input`;
const SELECT = `${AUTH_INPUT_CLASS} home1-sites-input home1-sites-select`;

const COUNTRIES = [{ value: "GB", label: "United Kingdom (UK)" }];

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
 * }} props
 */
export default function CreateSiteModal({
  open,
  onClose,
  onSubmit,
  saving = false,
  mode = "create",
  initialForm,
}) {
  const titleId = useId();
  const [form, setForm] = useState(EMPTY_SITE_FORM);
  const isEdit = mode === "edit";

  useEffect(() => {
    if (open) setForm(initialForm ?? EMPTY_SITE_FORM);
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.postcode.trim() || !form.addressLine1.trim() || !form.townCity.trim()) return;
    await onSubmit(form);
  }

  return (
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
              {isEdit ? "Edit site address" : "New site address"}
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
              <select
                id="site-country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className={SELECT}
                disabled={saving}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="home1-sites-form-grid home1-sites-form-grid--2">
              <Field id="site-postcode" label="Postcode">
                <input
                  id="site-postcode"
                  value={form.postcode}
                  onChange={(e) => update("postcode", e.target.value.toUpperCase())}
                  placeholder="e.g. NG1 1AA"
                  className={INPUT}
                  required
                  disabled={saving}
                  autoComplete="postal-code"
                />
              </Field>
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

            <div className="home1-sites-modal-divider">
              <p className="home1-sites-modal-divider-label">Contact on site</p>
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
            <button type="submit" className="home1-btn-primary home1-sites-modal-btn" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add site"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
