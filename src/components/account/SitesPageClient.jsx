"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import AccountLayout from "@/components/account/AccountLayout";
import CreateSiteModal from "@/components/account/CreateSiteModal";
import SiteCardSummary from "@/components/account/SiteCardSummary";
import BlogPagination from "@/components/blog/BlogPagination";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import ServicePostcodeResultModal from "@/components/shared/ServicePostcodeResultModal";
import { useBookableServices } from "@/hooks/useServices";
import { verifyServicePostcodeCoverage } from "@/lib/postcode/verifyServicePostcodeCoverage";
import { siteToForm } from "@/lib/sites/siteForm";
import { matchesSiteSearch } from "@/lib/sites/matchesSiteSearch";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSitesSaveError,
  createSite,
  fetchSiteById,
  fetchSites,
  updateSite,
} from "@/store/slices/sitesSlice";
import SitesListSkeleton from "@/components/skeletons/SitesListSkeleton";
import { IconCalendar } from "@/components/home1/icons";
import "@/components/skeletons/skeleton.css";

function IconSearch({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

/**
 * @param {{
 *   site: import("@/lib/sites/siteTypes").SavedSite,
 *   onUpdate: (site: import("@/lib/sites/siteTypes").SavedSite) => void,
 *   busy?: boolean,
 * }} props
 */
function SiteCard({ site, onUpdate, busy = false }) {
  return (
    <article
      className={`home1-sites-card home1-card${site.primary ? " home1-sites-card--default" : ""}`}
    >
      <div className="home1-sites-card-head">
        <div className="min-w-0">
          <h2 className="home1-sites-card-title">
            {site.addressLine1 || site.name}
            {site.primary ? (
              <span className="home1-sites-primary-badge" title="Default site address">
                Default site
              </span>
            ) : null}
          </h2>
        </div>
      </div>

      <SiteCardSummary site={site} />

      <div className="home1-sites-card-actions">
        <Link
          href={`/account/sites/${site.id}`}
          className="home1-btn-outline home1-sites-btn"
          aria-label={`View details for ${site.addressLine1 || site.name}`}
        >
          View details
        </Link>
        <button
          type="button"
          className="home1-btn-primary home1-sites-btn home1-sites-btn--update"
          onClick={() => onUpdate(site)}
          disabled={busy || !site.id}
          aria-label={`Update ${site.addressLine1 || site.name}`}
        >
          Update
        </button>
      </div>
    </article>
  );
}

function SitesEmpty({ onCreate, disabled }) {
  return (
    <div className="home1-sites-empty home1-card">
      <div className="home1-sites-empty-icon" aria-hidden="true">
        <IconCalendar className="w-8 h-8" />
      </div>
      <h2 className="home1-sites-empty-title">No saved sites yet</h2>
      <p className="home1-sites-empty-text">
        Add your first job location to speed up checkout and keep addresses in one place.
      </p>
      <button
        type="button"
        className="home1-sites-add-btn"
        onClick={onCreate}
        disabled={disabled}
      >
        <IconPlus className="home1-sites-add-btn__icon" />
        Add New Site
      </button>
    </div>
  );
}

export default function SitesPageClient() {
  const dispatch = useAppDispatch();
  const { sites, status, error, pagination, saving, saveError } = useAppSelector((state) => state.sites);
  const { bookable } = useBookableServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const listAnchorRef = useRef(null);
  const searchId = useId();

  const defaultServiceSlug = useMemo(() => bookable[0]?.slug ?? "", [bookable]);

  const handlePostcodeBeforeLookup = useCallback(
    async (postcode) => {
      const result = await verifyServicePostcodeCoverage({
        source: "sites",
        serviceSlug: defaultServiceSlug,
        postCode: postcode,
      });

      if (!result.allowed && !result.message) {
        setCoverageModalOpen(true);
      }

      return result;
    },
    [defaultServiceSlug]
  );

  const initialLoading = (status === "loading" || status === "idle") && sites.length === 0;
  const pageLoading = status === "loading" && sites.length > 0;
  const busy = saving;

  const totalCount = pagination?.total ?? sites.length;
  const defaultSite = sites.find((s) => s.primary);

  const stats = useMemo(
    () => ({
      total: totalCount,
      hasDefault: Boolean(defaultSite),
    }),
    [totalCount, defaultSite]
  );

  const filteredSites = useMemo(
    () => sites.filter((site) => matchesSiteSearch(site, searchQuery)),
    [sites, searchQuery]
  );

  const showSearchEmpty =
    !initialLoading && status !== "failed" && sites.length > 0 && searchQuery.trim() && filteredSites.length === 0;

  useEffect(() => {
    dispatch(fetchSites({ page: 1 }));
  }, [dispatch]);

  function openCreateModal() {
    setEditingId(null);
    setEditForm(null);
    setModalOpen(true);
  }

  function openUpdateModal(site) {
    const id = String(site.id ?? "").trim();
    if (!id) {
      toastError("This site cannot be updated (missing ID).");
      return;
    }
    setEditingId(id);
    setEditForm(siteToForm(site));
    setModalOpen(true);

    dispatch(fetchSiteById(id))
      .unwrap()
      .then((fresh) => setEditForm(siteToForm(fresh)))
      .catch((err) => toastError(err, "Could not refresh site details."));
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setEditForm(null);
    dispatch(clearSitesSaveError());
  }

  async function handleSubmitSite(form) {
    dispatch(clearSitesSaveError());

    try {
      if (editingId) {
        await dispatch(updateSite({ id: editingId, form })).unwrap();
        toastSuccess(form.isDefault ? "Default site updated." : "Site updated successfully.");
      } else {
        await dispatch(createSite(form)).unwrap();
        toastSuccess(form.isDefault ? "Default site saved." : "Site added successfully.");
      }
      setModalOpen(false);
      setEditingId(null);
      setEditForm(null);
    } catch (err) {
      toastError(err, "Could not save site.");
    }
  }

  function goToPage(page) {
    if (!pagination || pageLoading) return;
    if (page < 1 || page > pagination.lastPage || page === pagination.currentPage) return;

    dispatch(fetchSites({ page }));
    listAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <AccountLayout
      active="sites"
      title="My sites"
      description="Save job locations for faster checkout and better visit coordination."
    >
      <div className="home1-sites-stats">
        <div className="home1-sites-stat home1-card">
          <p className="home1-sites-stat-value">{initialLoading ? "—" : stats.total}</p>
          <p className="home1-sites-stat-label">Saved sites</p>
        </div>
        <div className="home1-sites-stat home1-card home1-sites-stat--accent">
          <p className="home1-sites-stat-value">{initialLoading ? "—" : stats.hasDefault ? "Yes" : "No"}</p>
          <p className="home1-sites-stat-label">Default set</p>
        </div>
      </div>

      <section className="home1-sites-panel home1-card w-full">
        <header className="home1-sites-panel-head home1-sites-panel-head--row">
          <div className="home1-sites-panel-intro">
            <h2 className="home1-sites-panel-title">Saved locations</h2>
            <p className="home1-sites-panel-lead">Use these addresses while booking services.</p>
          </div>
          <div className="home1-sites-toolbar">
            <label htmlFor={searchId} className="sr-only">
              Search saved addresses
            </label>
            <div className="home1-sites-search">
              <IconSearch className="home1-sites-search__icon" />
              <input
                id={searchId}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search saved addresses"
                className="home1-sites-search__input"
                autoComplete="off"
              />
            </div>
            <button
              type="button"
              className="home1-sites-add-btn"
              onClick={openCreateModal}
              disabled={busy}
            >
              <IconPlus className="home1-sites-add-btn__icon" />
              Add New Site
            </button>
          </div>
        </header>

        <div ref={listAnchorRef} className="home1-sites-list-anchor" />

        {initialLoading ? <SitesListSkeleton count={3} /> : null}

        {!initialLoading && status === "failed" ? (
          <div className="home1-sites-error px-4 py-6">
            <p className="text-sm text-[#9f1239]">{error}</p>
            <button
              type="button"
              className="home1-btn-outline home1-sites-btn mt-3"
              onClick={() => dispatch(fetchSites({ page: 1 }))}
            >
              Try again
            </button>
          </div>
        ) : null}

        {!initialLoading && status !== "failed" && sites.length === 0 ? (
          <SitesEmpty onCreate={openCreateModal} disabled={saving} />
        ) : null}

        {pageLoading ? (
          <div className="home1-sites-list-loading" aria-live="polite">
            <ButtonSpinner className="h-6 w-6 text-[var(--home1-red)]" />
          </div>
        ) : null}

        {showSearchEmpty ? (
          <p className="home1-sites-search-empty" role="status">
            No sites match &ldquo;{searchQuery.trim()}&rdquo;.
          </p>
        ) : null}

        {!initialLoading && status !== "failed" && sites.length > 0 ? (
          <ul className={`home1-sites-list p-0 m-0${pageLoading ? " home1-sites-list--busy" : ""}`}>
            {filteredSites.map((site) => (
              <li key={site.id}>
                <SiteCard site={site} onUpdate={openUpdateModal} busy={saving} />
              </li>
            ))}
          </ul>
        ) : null}

        {!initialLoading && status !== "failed" && pagination && sites.length > 0 ? (
          <div className="home1-sites-pagination">
            {pagination.from && pagination.to ? (
              <p className="home1-sites-pagination-summary">
                Showing {pagination.from}–{pagination.to} of {totalCount} sites
              </p>
            ) : (
              <p className="home1-sites-pagination-summary">
                {totalCount} saved {totalCount === 1 ? "site" : "sites"}
              </p>
            )}
            {pagination.lastPage > 1 ? (
              <BlogPagination
                ariaLabel="Sites pagination"
                className="home1-sites-pagination-nav mt-0"
                currentPage={pagination.currentPage}
                lastPage={pagination.lastPage}
                loading={pageLoading}
                onPageChange={goToPage}
              />
            ) : null}
          </div>
        ) : null}
      </section>

      {saveError ? (
        <p className="mt-4 text-sm text-[#9f1239]" role="alert">
          {saveError}
        </p>
      ) : null}

      <CreateSiteModal
        key={editingId ? `edit-${editingId}` : "create"}
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitSite}
        saving={saving}
        mode={editingId ? "edit" : "create"}
        initialForm={editForm ?? undefined}
        siteName={editingId ? (sites.find((s) => s.id === editingId)?.addressLine1 || "") : ""}
        onBeforePostcodeLookup={handlePostcodeBeforeLookup}
      />

      <ServicePostcodeResultModal
        open={coverageModalOpen}
        variant="outOfArea"
        onClose={() => setCoverageModalOpen(false)}
      />
    </AccountLayout>
  );
}
