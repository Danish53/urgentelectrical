"use client";

import { TESTIMONIALS } from "@/data/testimonials";
import { CONTAINER } from "./constants";
import SectionHeader from "./SectionHeader";
import Slider from "./Slider";

export default function TestimonialsHome2() {
  return (
    <section className="home2-section home2-section--light overflow-x-clip" aria-labelledby="home2-reviews-heading">
      <div className={CONTAINER}>
        <SectionHeader
          id="home2-reviews-heading"
          eyebrow="Customer reviews"
          title="Trusted across the East Midlands"
          description="Real feedback from homeowners and businesses we've helped."
        />

        <Slider perView={1} perViewMd={2} perViewLg={3} ariaLabel="Customer testimonials">
          {TESTIMONIALS.map((t) => (
            <article key={t.id} className="home2-testimonial-slide">
              <p className="text-[#F59E0B] text-base tracking-wide mb-4" aria-hidden="true">
                ★★★★★
              </p>
              <blockquote className="text-[var(--h2-muted)] text-[15px] leading-relaxed italic flex-1">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <footer className="flex items-center gap-3 mt-6 pt-5 border-t border-[var(--h2-border)]">
                <span
                  className="w-11 h-11 rounded-xl text-white font-bold flex items-center justify-center"
                  style={{ backgroundColor: t.avatarBg }}
                >
                  {t.initial}
                </span>
                <div>
                  <cite className="font-bold text-[var(--h2-navy)] text-sm not-italic">{t.name}</cite>
                  <p className="text-xs text-[var(--h2-muted)]">{t.date}</p>
                </div>
              </footer>
            </article>
          ))}
        </Slider>
      </div>
    </section>
  );
}
