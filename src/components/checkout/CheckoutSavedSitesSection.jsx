"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import CreateSiteModal from "@/components/account/CreateSiteModal";
import SiteCardSummary from "@/components/account/SiteCardSummary";
import BlogPagination from "@/components/blog/BlogPagination";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import SitesListSkeleton from "@/components/skeletons/SitesListSkeleton";
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
import "@/components/skeletons/skeleton.css";
import { IconCalendar } from "@/components/home1/icons";

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

function IconPencil({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 20h9" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * @param {{
 *   site: import("@/lib/sites/siteTypes").SavedSite,
 *   selected: boolean,
 *   onSelect: (site: import("@/lib/sites/siteTypes").SavedSite) => void,
 *   onEdit: (site: import("@/lib/sites/siteTypes").SavedSite) => void,
 * }} props
 */
function CheckoutSiteSelectCard({ site, selected, onSelect, onEdit }) {
  const title = site.addressLine1 || site.name;

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(site);
    }
  }

  return (
    <article
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onSelect(site)}
      onKeyDown={handleKeyDown}
      className={`home1-sites-card home1-card home1-sites-card--checkout-select${site.primary ? " home1-sites-card--default" : ""}${selected ? " is-selected" : ""}`}
    >
      <div className="home1-checkout-site-card-top">
        <span className="home1-checkout-site-check" aria-hidden="true">
          <span className={`home1-checkout-site-check__box${selected ? " is-checked" : ""}`} />
        </span>

        <div className="home1-checkout-site-card-title-wrap min-w-0">
          <h2 className="home1-sites-card-title">
            {title}
            {site.primary ? (
              <span className="home1-sites-primary-badge" title="Default site address">
                Default site
              </span>
            ) : null}
          </h2>
        </div>

        {selected ? (
          <button
            type="button"
            className="home1-checkout-site-edit-btn"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(site);
            }}
            aria-label={`Update ${title}`}
          >
            <IconPencil className="home1-checkout-site-edit-btn__icon" />
          </button>
        ) : (
          <span className="home1-checkout-site-edit-spacer" aria-hidden="true" />
        )}
      </div>

      <SiteCardSummary site={site} />
    </article>
  );
}

/**
 * @param {{
 *   selectedSiteId?: string | null,
 *   onSelectSite: (site: import("@/lib/sites/siteTypes").SavedSite) => void,
 *   selectionError?: string,
 *   onBeforePostcodeLookup?: (
 *     postcode: string
 *   ) => Promise<boolean | { allowed: boolean, message?: string }>,
 * }} props
 */
export default function CheckoutSavedSitesSection({
  selectedSiteId = null,
  onSelectSite,
  selectionError = "",
  onBeforePostcodeLookup,
}) {
  const dispatch = useAppDispatch();
  const searchId = useId();
  const listAnchorRef = useRef(null);
  const { sites, status, error, pagination, saving, saveError } = useAppSelector((state) => state.sites);

  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const initialLoading = (status === "loading" || status === "idle") && sites.length === 0;
  const pageLoading = status === "loading" && sites.length > 0;
  const totalCount = pagination?.total ?? sites.length;
  const busy = saving;

  const filteredSites = useMemo(
    () => sites.filter((site) => matchesSiteSearch(site, searchQuery)),
    [sites, searchQuery]
  );

  const showSearchEmpty =
    !initialLoading && status !== "failed" && sites.length > 0 && searchQuery.trim() && filteredSites.length === 0;

  useEffect(() => {
    dispatch(fetchSites({ page: 1 }));
  }, [dispatch]);

  function goToPage(page) {
    if (!pagination || pageLoading) return;
    if (page < 1 || page > pagination.lastPage || page === pagination.currentPage) return;
    dispatch(fetchSites({ page }));
    listAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openCreateModal() {
    setEditingId(null);
    setEditForm(null);
    setModalOpen(true);
  }

  function openEditModal(site) {
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

  async function handleCreateSite(form) {
    dispatch(clearSitesSaveError());
    try {
      const payload = await dispatch(createSite(form)).unwrap();
      toastSuccess(form.isDefault ? "Default site saved." : "Site added successfully.");
      closeModal();
      setSearchQuery("");

      const created =
        payload.createdSite ||
        payload.sites?.find(
          (site) =>
            (site.addressLine1 || site.name || "").trim().toLowerCase() ===
            form.addressLine1.trim().toLowerCase()
        );

      if (created) {
        onSelectSite(created);
      }
    } catch (err) {
      toastError(err, "Could not save site.");
    }
  }

  async function handleUpdateSite(form) {
    if (!editingId) return;
    dispatch(clearSitesSaveError());
    try {
      const payload = await dispatch(updateSite({ id: editingId, form })).unwrap();
      toastSuccess(form.isDefault ? "Default site updated." : "Site updated successfully.");
      closeModal();
      const updated = payload.sites?.find((s) => String(s.id) === editingId);
      if (updated && String(selectedSiteId) === editingId) {
        onSelectSite(updated);
      }
    } catch (err) {
      toastError(err, "Could not update site.");
    }
  }

  function handleSubmitSite(form) {
    if (editingId) {
      return handleUpdateSite(form);
    }
    return handleCreateSite(form);
  }

  return (
    <>
      <section
        className={`home1-sites-panel home1-card w-full home1-checkout-saved-sites${selectionError ? " home1-checkout-saved-sites--error" : ""}`}
      >
        <header className="home1-sites-panel-head home1-sites-panel-head--row home1-checkout-saved-sites__head">
          <div className="home1-sites-toolbar home1-checkout-saved-sites__toolbar">
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
            <button type="button" className="home1-sites-add-btn" onClick={openCreateModal} disabled={busy}>
              <IconPlus className="home1-sites-add-btn__icon" />
              Add New Site
            </button>
          </div>
        </header>

        <div ref={listAnchorRef} className="home1-sites-list-anchor" />

        {initialLoading ? <SitesListSkeleton count={2} /> : null}

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
          <div className="home1-sites-empty home1-card">
            <div className="home1-sites-empty-icon" aria-hidden="true">
              <IconCalendar className="w-8 h-8" />
            </div>
            <h2 className="home1-sites-empty-title">No saved sites yet</h2>
            <p className="home1-sites-empty-text">Add a job location to continue with your booking.</p>
            <button type="button" className="home1-sites-add-btn" onClick={openCreateModal} disabled={busy}>
              <IconPlus className="home1-sites-add-btn__icon" />
              Add New Site
            </button>
          </div>
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
          <ul
            className={`home1-sites-list home1-checkout-saved-sites__list p-0 m-0${pageLoading ? " home1-sites-list--busy" : ""}`}
            role="radiogroup"
            aria-label="Saved site addresses"
          >
            {filteredSites.map((site) => (
              <li key={site.id}>
                <CheckoutSiteSelectCard
                  site={site}
                  selected={String(selectedSiteId) === String(site.id)}
                  onSelect={onSelectSite}
                  onEdit={openEditModal}
                />
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

        {selectionError ? (
          <p className="home1-checkout-field-error home1-checkout-saved-sites__error" role="alert">
            {selectionError}
          </p>
        ) : null}
      </section>

      {saveError ? (
        <p className="mt-3 text-sm text-[#9f1239]" role="alert">
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
        hideContactDetails
        onBeforePostcodeLookup={onBeforePostcodeLookup}
      />
    </>
  );
}
