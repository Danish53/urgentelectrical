import { buildPolicyDetailMetadata, buildPolicyDetailJsonLd } from "@/data/policiesPage";
import Link from "next/link";
import Image from "next/image";
import { shouldUnoptimizeImage } from "@/lib/images/imageSrc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { FOOTER_PHONE, FOOTER_PHONE_TEL } from "@/data/footer";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchPolicyBySlug, getPolicyImageUrl } from "@/services/policyApiService";
import "../../home1/home1.css";
import "../policies.css";

function toTitleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const policy = await fetchPolicyBySlug(slug);
    return buildPolicyDetailMetadata(policy);
  } catch {
    return {
      title: "Policy not found",
      robots: { index: false, follow: false },
    };
  }
}

export default async function PolicyDetailPage({ params }) {
  const { slug } = await params;
  const fallbackTitle = toTitleFromSlug(slug);

  let policy = null;
  let loadError = "";
  try {
    policy = await fetchPolicyBySlug(slug);
  } catch (error) {
    loadError = getApiErrorMessage(error, "Could not load this policy.");
  }
  const policyTitle = policy?.title || fallbackTitle;
  const policyHtml = policy?.detail && String(policy.detail).trim() ? String(policy.detail) : "";
  const policyImage = getPolicyImageUrl(policy);
  const seoDescription = policy?.seo_description || "Read our policy details and terms.";
  const seoTitle = policy?.seo_title || policyTitle;
  const updatedAt = policy?.updated_at
    ? new Date(policy.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const jsonLd = policy && !loadError ? buildPolicyDetailJsonLd(policy) : null;

  return (
    <div className="home1-page w-full min-w-0">
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <Navbar />
      <main id="main-content" className="w-full min-w-0">
        <section
          className="relative bg-black overflow-x-clip pb-10 sm:pb-14 lg:pb-16"
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 1.25rem)" }}
        >
          <div className="hero-grid-bg absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="hero-top-glow absolute inset-0 pointer-events-none" aria-hidden="true" />
          <div className="home1-policy-detail-container relative z-10">
            <div className="mt-5">
              {/* <Link href="/policies" className="inline-flex items-center gap-2 text-[13px] font-bold text-white/80 hover:text-white transition">
                ← Back to policies
              </Link>
              <p className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                Company Policy
              </p> */}
              <h1 className="mt-4 text-white text-[30px] sm:text-[42px] lg:text-[50px] font-extrabold leading-[1.08] tracking-tight">
                {policyTitle}
              </h1>
              <p className="mt-4 max-w-3xl text-white/80 text-[15px] sm:text-[16px] leading-relaxed">
                {seoDescription}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                {/* {updatedAt ? (
                  <span className="inline-flex rounded-full border border-white/25 px-3 py-1 text-[12px] font-semibold text-white/85">
                    Updated: {updatedAt}
                  </span>
                ) : null} */}
                <span className="inline-flex rounded-full border border-white/25 px-3 py-1 text-[12px] font-semibold text-white/85">
                  {seoTitle}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="home1-policy-detail-section bg-[#f8fafc]">
          <div className="home1-policy-detail-container">
              <article className="home1-policy-detail-article rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
              {loadError ? (
                <div className="rounded-xl border border-[#fecaca] bg-[#fff1f2] p-4 text-[#9f1239]">
                  <h2 className="text-[16px] font-extrabold">Policy unavailable</h2>
                  <p className="mt-1 text-[14px]">{loadError}</p>
                </div>
              ) : null}

                {!loadError && policyImage ? (
                  <div className="relative mb-6 overflow-hidden rounded-xl border border-[#e5e7eb] h-[220px] sm:h-[340px] lg:h-[440px]">
                    <Image
                      src={policyImage}
                      alt={policyTitle}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1200px"
                      className="object-cover"
                      priority
                      unoptimized={shouldUnoptimizeImage(policyImage)}
                    />
                  </div>
                ) : null}

                {!loadError ? (
                  <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6 xl:gap-8">
                    <div className="home1-policy-detail-prose-wrap rounded-xl border border-[#eef2f6] bg-white">
                      {policyHtml ? (
                        <div
                          className="home1-blog-prose home1-blog-prose-html"
                          dangerouslySetInnerHTML={{ __html: policyHtml }}
                        />
                      ) : (
                        <p className="text-[15px] leading-relaxed text-[#475569]">
                          Detailed content for this policy will be published here shortly. For urgent questions,
                          please contact our support team.
                        </p>
                      )}
                    </div>

                    <aside className="home1-policy-detail-aside space-y-4">
                      <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 sm:p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
                          Policy details
                        </p>
                        <h2 className="mt-2 text-[18px] font-extrabold text-[#111827]">{policyTitle}</h2>
                        {updatedAt ? (
                          <p className="mt-3 text-[13px] text-[#64748b]">
                            Last updated: <strong className="text-[#334155]">{updatedAt}</strong>
                          </p>
                        ) : null}

                        <div className="mt-5 grid gap-2">
                          <Link
                            href="/policies"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dbe1e8] bg-white px-3 py-2 text-[13px] font-bold text-[#334155] hover:border-[#94a3b8]"
                          >
                            All policies
                          </Link>
                          <Link
                            href="/contact-us"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#f1d4d3] bg-[#fff6f5] px-3 py-2 text-[13px] font-bold text-[#d3231f] hover:border-[#d3231f]"
                          >
                            Contact support
                          </Link>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 sm:p-5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
                          Need urgent help?
                        </p>
                        <p className="mt-2 text-[14px] leading-relaxed text-[#475569]">
                          Speak with our team for policy queries or urgent electrical support.
                        </p>
                        <a
                          href={`tel:${FOOTER_PHONE_TEL}`}
                          className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#d3231f] bg-[#d3231f] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#b71c1c] hover:border-[#b71c1c]"
                        >
                          Call {FOOTER_PHONE}
                        </a>
                      </div>
                    </aside>
                  </div>
                ) : null}
              </article>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
