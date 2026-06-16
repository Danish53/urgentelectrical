"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import AppImage from "@/components/common/AppImage";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";
import { getPolicyImageUrl } from "@/services/policyApiService";

function formatPolicyNumber(index) {
  return String(index + 1).padStart(2, "0");
}

function PolicyCard({ policy, index }) {
  const imageUrl = getPolicyImageUrl(policy);
  const shortDescription =
    policy.short_description ||
    `Read full details about our ${policy.title.toLowerCase()} standards and legal terms.`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
      <div className="relative h-52 w-full overflow-hidden">
        {imageUrl ? (
          <AppImage
            src={imageUrl}
            alt={policy.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#374151]" />
        )}
        <p className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#475569]">
          Policy {formatPolicyNumber(index)}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        <h2 className="text-[21px] sm:text-[23px] font-extrabold leading-tight text-[#111827]">
          {policy.title}
        </h2>
        <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-[#64748b]">{shortDescription}</p>

        <div className="mt-6">
          <Link
            href={`/policies/${policy.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-[#f1d4d3] bg-[#fff6f5] px-3 py-2 text-[14px] font-bold text-[#d3231f] transition hover:border-[#d3231f] hover:bg-[#ffeceb]"
          >
            Read full policy
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function PoliciesPageClient({ policies, loadError = "" }) {
  return (
    <div className="home1-page w-full min-w-0">
      <Navbar />

      <main id="main-content" className="w-full min-w-0">
        <section
          className="relative bg-black overflow-x-clip pb-10 sm:pb-14 lg:pb-16"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className={`${SERVICES_PAGE_CONTAINER} relative z-10`}>
            <div className="mx-auto max-w-3xl text-center mt-5">
              <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                Legal information
              </p>
              <h1 className="text-white text-[28px] sm:text-[40px] lg:text-[48px] font-extrabold leading-[1.1] tracking-tight">
                Privacy, cookie and service policies
              </h1>
              <p className="mt-4 text-white/80 text-[15px] sm:text-[16px] leading-relaxed">
                Transparent terms for how we protect data, use cookies, and provide services.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14 lg:py-16 bg-[#f8fafc]">
          <div className={SERVICES_PAGE_CONTAINER}>
            {loadError ? (
              <div className="rounded-2xl border border-[#fecaca] bg-[#fff1f2] p-5 text-[#9f1239]">
                <h2 className="text-[16px] font-extrabold">Policies could not be loaded</h2>
                <p className="mt-1 text-[14px]">{loadError}</p>
              </div>
            ) : null}

            {!loadError && policies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d1d5db] bg-white p-10 text-center">
                <h2 className="text-[18px] font-extrabold text-[#111827]">No policies available</h2>
                <p className="mt-2 text-[14px] text-[#64748b]">Please check back shortly.</p>
              </div>
            ) : null}

            {!loadError && policies.length > 0 ? (
              <ul className="m-0 list-none grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-7 p-0">
                {policies.map((policy, index) => (
                  <li key={policy.id}>
                    <PolicyCard policy={policy} index={index} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
