"use client";

import { useState } from "react";
import { useSimpleServicesList } from "@/hooks/useServices";
import FormFieldSkeleton from "@/components/skeletons/FormFieldSkeleton";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { toastError, toastSuccess } from "@/lib/toast";
import {
  buildContactPayloadFromCallbackForm,
  parseContactResponseMessage,
  submitContact,
} from "@/services/contactService";
import { CONTAINER, SECTION_PY } from "./constants";
import SectionEyebrow from "./SectionEyebrow";
import { IconArrow, IconCheck, IconPhone } from "./icons";

const TRUST_POINTS = ["Free quote", "Fast callback", "NICEIC approved"];

export default function QuoteFormHome1() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const { options, loading: servicesLoading } = useSimpleServicesList();
  const [serviceSlug, setServiceSlug] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setMessage("");
    setSubmitted(false);
    setServiceSlug("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail) {
      toastError(null, "Please enter your name, phone, and email.");
      return;
    }

    setSubmitting(true);
    try {
      const selectedService = options.find((option) => option.slug === serviceSlug);
      const payload = buildContactPayloadFromCallbackForm({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        service: selectedService?.name ?? "",
        message: trimmedMessage,
      });
      const data = await submitContact(payload);
      const responseMessage =
        parseContactResponseMessage(data) || "Thanks — we'll call you back as soon as possible.";
      toastSuccess(responseMessage);
      setSubmitted(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toastError(error, "Could not send your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="quote"
      className={`home1-quote-section ${SECTION_PY} overflow-x-clip scroll-mt-28`}
      aria-labelledby="home-quote-heading"
    >
      <div className={`${CONTAINER} relative z-10`}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Left — white copy on black */}
          <div className="home1-quote-copy min-w-0">
            <SectionEyebrow light>Get a free quote</SectionEyebrow>
            <h2
              id="home-quote-heading"
              className="text-white text-[28px] sm:text-[34px] lg:text-[38px] font-extrabold leading-[1.12] tracking-tight mb-4"
            >
              Request a callback
            </h2>
            <p className="text-white/75 text-[15px] sm:text-[16px] leading-relaxed mb-6 max-w-md">
              Tell us what you need — we&apos;ll respond quickly with fixed pricing where available.
            </p>
            <a
              href={`tel:${FOOTER_PHONE_TEL}`}
              className="home1-btn-white inline-flex mb-6"
            >
              <IconPhone />
              {FOOTER_PHONE}
            </a>
            <ul className="home1-quote-trust list-none p-0 m-0">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="home1-quote-trust-item">
                  <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                    <IconCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form card */}
          <div className="home1-quote-form-panel w-full min-w-0">
            {submitted ? (
              <div className="home1-contact-success" role="status">
                <p className="home1-contact-success-title">Thank you</p>
                <p className="home1-contact-success-text">
                  Your callback request has been received. For urgent help, call{" "}
                  <a href={`tel:${FOOTER_PHONE_TEL}`} className="home1-contact-success-link">
                    {FOOTER_PHONE}
                  </a>
                  .
                </p>
                <button type="button" onClick={resetForm} className="home1-contact-success-btn">
                  Send another request
                </button>
              </div>
            ) : (
            <form
              className="flex flex-col gap-4 sm:gap-5"
              onSubmit={handleSubmit}
              aria-label="Free quote request form"
              noValidate
            >
              <p className="text-[var(--home1-text)] font-bold text-lg mb-0 sm:mb-1">Send your details</p>
              <p className="text-[var(--home1-muted)] text-[13px] -mt-3 mb-1">
                We&apos;ll call you back as soon as possible.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="home1-quote-field">
                  <label htmlFor="quote-name">Name</label>
                  <input
                    id="quote-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="home1-quote-input"
                    placeholder="Your name"
                    disabled={submitting}
                  />
                </div>
                <div className="home1-quote-field">
                  <label htmlFor="quote-phone">Phone</label>
                  <input
                    id="quote-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="home1-quote-input"
                    placeholder="0115 000 0000"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="home1-quote-field">
                <label htmlFor="quote-email">Email</label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="home1-quote-input"
                  placeholder="you@email.com"
                  disabled={submitting}
                />
              </div>

              <div className="home1-quote-field">
                <label htmlFor="quote-service">Service needed</label>
                {servicesLoading ? (
                  <FormFieldSkeleton className="rounded-lg !bg-[#1f2937]" />
                ) : (
                  <select
                    id="quote-service"
                    name="service"
                    value={serviceSlug}
                    onChange={(e) => setServiceSlug(e.target.value)}
                    disabled={!options.length || submitting}
                    className="home1-quote-input"
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
              </div>

              <div className="home1-quote-field">
                <label htmlFor="quote-message">Message</label>
                <textarea
                  id="quote-message"
                  name="message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="home1-quote-input resize-y min-h-[96px]"
                  placeholder="Job details or postcode"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="home1-btn-primary w-full text-sm py-4 mt-1 inline-flex items-center justify-center gap-2"
                aria-busy={submitting}
              >
                {submitting ? <ButtonSpinner /> : null}
                {submitting ? "Sending…" : "Get free quote"}
                {!submitting ? <IconArrow className="w-4 h-4" /> : null}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
