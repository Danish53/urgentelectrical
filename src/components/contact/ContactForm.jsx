"use client";

import { useState } from "react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/data/contactPage";
import { parseContactResponseMessage, submitContact } from "@/services/contactService";
import { toastError, toastSuccess } from "@/lib/toast";

function SubmitSpinner() {
  return (
    <svg
      className="h-4 w-4 shrink-0 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  comment: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSubmitted(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const first_name = form.firstName.trim();
    const last_name = form.lastName.trim();
    const email = form.email.trim();
    const comment = form.comment.trim();

    if (!first_name || !last_name || !email || !comment) {
      toastError(null, "Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await submitContact({ first_name, last_name, email, comment });
      const message =
        parseContactResponseMessage(data) || "Your message has been sent successfully.";
      toastSuccess(message);
      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch (error) {
      toastError(error, "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="home1-contact-form home1-contact-form-card home1-contact-success" role="status">
        <p className="home1-contact-success-title">Thank you</p>
        <p className="home1-contact-success-text">
          Your message has been received. For emergencies, call{" "}
          <a href={`tel:${CONTACT_PHONE_TEL}`} className="home1-contact-success-link">
            {CONTACT_PHONE_DISPLAY}
          </a>
          .
        </p>
        <button type="button" onClick={resetForm} className="home1-contact-success-btn">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="home1-contact-form">
      <form
        onSubmit={handleSubmit}
        className="home1-contact-form-card"
        aria-label="Contact form"
        noValidate
      >
        <h2 className="home1-contact-form-title">Get in touch</h2>

        <div className="home1-contact-form-fields">
          <div className="home1-contact-form-row">
            <div>
              <label htmlFor="contact-first-name" className="home1-contact-label">
                First name<span className="home1-contact-label-required">*</span>
              </label>
              <input
                id="contact-first-name"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                placeholder="Enter your first name"
                className="home1-contact-input"
                disabled={submitting}
              />
            </div>
            <div>
              <label htmlFor="contact-last-name" className="home1-contact-label">
                Last name<span className="home1-contact-label-required">*</span>
              </label>
              <input
                id="contact-last-name"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                placeholder="Enter your last name"
                className="home1-contact-input"
                disabled={submitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-email" className="home1-contact-label">
              Email<span className="home1-contact-label-required">*</span>
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter your email"
              className="home1-contact-input"
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="contact-comment" className="home1-contact-label">
              Comments<span className="home1-contact-label-required">*</span>
            </label>
            <textarea
              id="contact-comment"
              name="comment"
              required
              rows={5}
              value={form.comment}
              onChange={(e) => updateField("comment", e.target.value)}
              placeholder="How can we help you?"
              className="home1-contact-textarea"
              disabled={submitting}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="home1-contact-submit"
            aria-busy={submitting}
          >
            {submitting ? (
              <>
                <SubmitSpinner />
                <span>Sending…</span>
              </>
            ) : (
              <span>Send message</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
