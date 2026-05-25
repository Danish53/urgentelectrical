"use client";

import { useState } from "react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/data/contactPage";

const labelClass = "block text-[11px] font-bold uppercase tracking-[0.08em] text-[#374151] mb-2";

const inputClass =
  "w-full min-w-0 rounded-md border border-[#d5d8dc] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] placeholder:text-[#9ca3af] transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-[#d3231f] focus:ring-2 focus:ring-[rgba(211,35,31,0.12)]";

const CARD =
  "rounded-xl bg-white border border-[#e8eaed] shadow-[0_4px_24px_rgba(17,24,39,0.06)] px-5 py-6 sm:px-7 sm:py-8 h-full";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className={`${CARD} flex flex-col items-center justify-center text-center min-h-[320px]`} role="status">
        <p className="text-xl font-extrabold text-[#111827] mb-2">Thank you</p>
        <p className="text-[14px] leading-relaxed text-[#64748b] max-w-sm">
          Your message has been received. For emergencies, call{" "}
          <a href={`tel:${CONTACT_PHONE_TEL}`} className="font-bold text-[#d3231f] hover:underline">
            {CONTACT_PHONE_DISPLAY}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-sm font-bold text-[#d3231f] hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className={CARD}>
      <form onSubmit={handleSubmit} aria-label="Contact form">
        <h2 className="text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.12em] text-[#111827] mb-6 sm:mb-7">
          Get in touch
        </h2>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-first-name" className={labelClass}>
                First name<span className="text-[#d3231f]">*</span>
              </label>
              <input
                id="contact-first-name"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-last-name" className={labelClass}>
                Last name<span className="text-[#d3231f]">*</span>
              </label>
              <input
                id="contact-last-name"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-phone" className={labelClass}>
                Phone number<span className="text-[#d3231f]">*</span>
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0115 000 0000"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                Email<span className="text-[#d3231f]">*</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClass}>
              Your message<span className="text-[#d3231f]">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              className={`${inputClass} resize-y min-h-[130px]`}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#d3231f] py-3.5 sm:py-4 text-[13px] sm:text-[14px] font-extrabold uppercase tracking-[0.06em] text-white transition-colors duration-200 hover:bg-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[rgba(211,35,31,0.35)] focus:ring-offset-2"
          >
            Send message
          </button>
        </div>
      </form>
    </div>
  );
}
