"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AccountLayout from "@/components/account/AccountLayout";
import SiteDetailFields from "@/components/account/SiteDetailFields";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSiteById } from "@/store/slices/sitesSlice";
import { IconArrow } from "@/components/home1/icons";

export default function SiteDetailPageClient() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const id = String(params?.id ?? "").trim();

  const { detailSite, detailStatus, detailError } = useAppSelector((state) => state.sites);

  const loading = detailStatus === "loading" || detailStatus === "idle";
  const failed = detailStatus === "failed";
  const site = detailSite?.id === id ? detailSite : null;

  useEffect(() => {
    if (!id) return;
    dispatch(fetchSiteById(id));
  }, [dispatch, id]);

  const title = site?.addressLine1 || site?.name || "Site address";

  return (
    <AccountLayout
      active="sites"
      title="Site details"
      description="View your saved service location."
    >
      <Link href="/account/sites" className="home1-sites-detail-back inline-flex items-center gap-2">
        <IconArrow className="w-4 h-4 rotate-180" aria-hidden="true" />
        Back to sites
      </Link>

      {!id ? (
        <div className="home1-sites-error home1-card mt-6 px-4 py-6">
          <p className="text-sm text-[#9f1239]">Invalid site address.</p>
          <button
            type="button"
            className="home1-btn-outline home1-sites-btn mt-3"
            onClick={() => router.push("/account/sites")}
          >
            Go to sites
          </button>
        </div>
      ) : null}

      {id && loading && !site ? (
        <div className="home1-sites-detail-loading home1-card mt-6" aria-live="polite">
          <ButtonSpinner className="h-8 w-8 text-[var(--home1-red)]" />
          <p className="text-sm text-[#6b7280] mt-3">Loading site address…</p>
        </div>
      ) : null}

      {id && failed && !site ? (
        <div className="home1-sites-error home1-card mt-6 px-4 py-6">
          <p className="text-sm text-[#9f1239]">{detailError || "Could not load this site address."}</p>
          <button
            type="button"
            className="home1-btn-outline home1-sites-btn mt-3"
            onClick={() => dispatch(fetchSiteById(id))}
          >
            Try again
          </button>
        </div>
      ) : null}

      {site ? (
        <article
          className={`home1-sites-detail home1-card mt-6${site.primary ? " home1-sites-card--default" : ""}`}
        >
          <header className="home1-sites-detail-head">
            <div className="min-w-0">
              <p className="home1-sites-detail-id">Site #{site.id}</p>
              <h2 className="home1-sites-card-title">
                {title}
                {site.primary ? (
                  <span className="home1-sites-primary-badge" title="Default site address">
                    Default site
                  </span>
                ) : null}
              </h2>
            </div>
          </header>

          <SiteDetailFields site={site} />
        </article>
      ) : null}
    </AccountLayout>
  );
}
