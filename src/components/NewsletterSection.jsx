"use client";

import { useState } from "react";
import { NEWSLETTER_BENEFITS } from "@/data/newsletter";

const SECTION_CONTAINER = "w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16";
const CARD_BG = "#222222";
const RED = "#E74C3C";
const INPUT_BG = "#1a1a1a";

function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NewsletterSection() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setDone(true);
  };

  const inputClass =
    "w-full rounded-lg px-4 py-3.5 text-sm text-white placeholder:text-[#888888] border border-[#333333] focus:outline-none focus:border-[#555555] transition-colors";

  return (
    <section className="bg-black pb-10 sm:pb-14 lg:pb-16" aria-labelledby="newsletter-heading">
      <div className={SECTION_CONTAINER}>
        <div className="rounded-xl sm:rounded-2xl overflow-hidden" style={{ backgroundColor: CARD_BG }}>
          <div className="grid lg:grid-cols-2">
            {/* Left — content */}
            <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14 lg:border-r border-[#333333]">
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: RED }}>
                Stay Connected
              </p>
              <h2
                id="newsletter-heading"
                className="text-white text-2xl sm:text-3xl lg:text-[34px] font-bold leading-tight mb-4"
              >
                Sign up to our mailing list
              </h2>
              <p className="text-[#999999] text-[14px] sm:text-[15px] leading-relaxed mb-8">
                Receive the latest news, electrical safety tips, and exclusive offers straight to your inbox.
              </p>
              <ul className="space-y-3 sm:space-y-3.5">
                {NEWSLETTER_BENEFITS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: RED }}
                      aria-hidden="true"
                    >
                      <CheckIcon />
                    </span>
                    <span className="text-white text-[14px] sm:text-[15px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — form */}
            <div className="px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14 flex flex-col justify-center">
              {done ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-4" aria-hidden="true">
                    ✓
                  </p>
                  <p className="text-white text-xl font-bold mb-2">You&apos;re subscribed!</p>
                  <p className="text-[#999999] text-sm">Thanks for signing up. We&apos;ll be in touch soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      autoComplete="given-name"
                      className={inputClass}
                      style={{ backgroundColor: INPUT_BG }}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      autoComplete="family-name"
                      className={inputClass}
                      style={{ backgroundColor: INPUT_BG }}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    autoComplete="email"
                    className={inputClass}
                    style={{ backgroundColor: INPUT_BG }}
                  />
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-black hover:bg-[#0a0a0a] text-white font-semibold text-[15px] py-3.5 sm:py-4 border border-[#333333] transition-colors duration-200 cursor-pointer"
                  >
                    Subscribe now
                    <span aria-hidden="true">→</span>
                  </button>
                  <p className="text-[#888888] text-[11px] sm:text-xs leading-relaxed pt-1">
                    By subscribing you agree to our{" "}
                    <a href="#" className="underline hover:text-[#bbbbbb]">
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline hover:text-[#bbbbbb]">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
