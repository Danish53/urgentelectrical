"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { ABOUT_JOURNEY, ABOUT_JOURNEY_IMAGE } from "@/data/aboutPage";

function JourneyImage() {
  const [src, setSrc] = useState(ABOUT_JOURNEY_IMAGE.src);

  return (
    <figure className="home1-about-journey-figure relative w-full mx-auto lg:mx-0 max-w-md lg:max-w-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-[#f1f5f9] shadow-[0_16px_48px_rgba(17,24,39,0.1)]">
        <Image
          src={src}
          alt={ABOUT_JOURNEY_IMAGE.alt}
          fill
          priority
          sizes="(max-width: 1023px) 90vw, 42vw"
          className="object-cover object-center"
          onError={() => setSrc(ABOUT_JOURNEY_IMAGE.fallback)}
        />
      </div>
    </figure>
  );
}

export default function AboutJourneySection() {
  return (
    <section className="home1-about-journey bg-white py-12 sm:py-16 lg:py-20" aria-labelledby="about-journey-heading">
      <div className={SERVICES_PAGE_CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-start">
          <JourneyImage />

          <div className="home1-about-journey-copy min-w-0 flex flex-col gap-8 sm:gap-10 lg:pt-4">
            <div>
              <h2
                id="about-journey-heading"
                className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold leading-[1.15] tracking-tight text-[#111827] mb-5 sm:mb-6"
              >
                {ABOUT_JOURNEY.beganTitle}
              </h2>
              <div className="flex flex-col gap-4 text-[15px] sm:text-[16px] leading-[1.75] text-[#64748b]">
                {ABOUT_JOURNEY.beganParagraphs.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[26px] sm:text-[32px] lg:text-[36px] font-extrabold leading-[1.15] tracking-tight text-[#111827] mb-5 sm:mb-6">
                {ABOUT_JOURNEY.missionTitle}
              </h3>
              <div className="flex flex-col gap-4 text-[15px] sm:text-[16px] leading-[1.75] text-[#64748b]">
                {ABOUT_JOURNEY.missionParagraphs.map((para) => (
                  <p key={para.slice(0, 40)}>{para}</p>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <Link
                href={ABOUT_JOURNEY.ctaHref}
                className="inline-flex items-center justify-center rounded-lg bg-[#d3231f] px-8 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(211,35,31,0.35)] transition-[background,transform,box-shadow] duration-200 hover:bg-[#b71c1c] hover:-translate-y-px"
              >
                {ABOUT_JOURNEY.ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
