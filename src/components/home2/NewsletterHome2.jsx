"use client";

import { useState } from "react";
import Home2Image from "./Home2Image";
import { NEWSLETTER_BENEFITS } from "@/data/newsletter";
import { CONTAINER } from "./constants";
import { IconCheck } from "./icons";

export default function NewsletterHome2() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");

  return (
    <section className="home2-section home2-section--light overflow-x-clip" aria-labelledby="home2-newsletter-heading">
      <div className={CONTAINER}>
        <div className="home2-card grid lg:grid-cols-2 gap-0 overflow-hidden !p-0 !border-0 shadow-xl">
          <div className="relative min-h-[280px] lg:min-h-full">
            <Home2Image src="/featured/emergency-lighting.jpg" alt="Electrical maintenance and updates" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-[var(--h2-navy)]/75" aria-hidden="true" />
            <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-center h-full text-white">
              <p className="home2-eyebrow home2-eyebrow--light mb-4 !text-white before:!bg-white">Newsletter</p>
              <h2 id="home2-newsletter-heading" className="text-2xl sm:text-3xl font-extrabold mb-4">
                Tips, offers &amp; updates
              </h2>
              <ul className="space-y-2">
                {NEWSLETTER_BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-white/90">
                    <IconCheck className="text-[#4ADE80] w-4 h-4" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <form className="p-8 sm:p-10 space-y-3 flex flex-col justify-center bg-white" onSubmit={(e) => e.preventDefault()} aria-label="Newsletter">
            <p className="text-[var(--h2-muted)] text-sm mb-2">Join our mailing list — unsubscribe any time.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input type="text" placeholder="First name" value={first} onChange={(e) => setFirst(e.target.value)} className="home2-input" />
              <input type="text" placeholder="Last name" value={last} onChange={(e) => setLast(e.target.value)} className="home2-input" />
            </div>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="home2-input" />
            <button type="submit" className="home2-btn home2-btn--primary w-full">
              Subscribe free
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
