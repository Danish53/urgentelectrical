"use client";

import { useState } from "react";
import { NEWSLETTER_BENEFITS } from "@/data/newsletter";
import { CONTAINER, SECTION_PY } from "./constants";
import { IconCheck } from "./icons";

export default function NewsletterHome1() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");

  return (
    <section className={`${SECTION_PY} bg-white overflow-x-clip`} aria-labelledby="home1-newsletter-heading">
      <div className={CONTAINER}>
        <div className="rounded-[28px] overflow-hidden grid lg:grid-cols-2 shadow-[0_24px_60px_rgba(211,35,31,0.15)]">
          <div className="home1-section-red p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
            <span className="home1-eyebrow home1-eyebrow--light mb-4 w-fit">Newsletter</span>
            <h2 id="home1-newsletter-heading" className="text-white text-[26px] sm:text-[32px] font-extrabold leading-tight mb-4">
              Expert electrical tips &amp; offers
            </h2>
            <ul className="space-y-3">
              {NEWSLETTER_BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/90 text-sm">
                  <span className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                    <IconCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <form
            className="bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <p className="text-[var(--home1-muted)] text-sm mb-2">Join our mailing list — unsubscribe any time.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input type="text" placeholder="First name" value={first} onChange={(e) => setFirst(e.target.value)} className="home1-input" />
              <input type="text" placeholder="Last name" value={last} onChange={(e) => setLast(e.target.value)} className="home1-input" />
            </div>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="home1-input" />
            <button type="submit" className="home1-btn-primary w-full">
              Subscribe free
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
