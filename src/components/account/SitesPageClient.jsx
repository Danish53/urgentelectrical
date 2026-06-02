"use client";

import { useMemo, useState } from "react";
import AccountLayout from "@/components/account/AccountLayout";
import CreateSiteModal from "@/components/account/CreateSiteModal";
import { toastSuccess } from "@/lib/toast";
import {
  applyNewSite,
  applyUpdatedSite,
  removeSite,
  siteFromForm,
  siteToForm,
} from "@/lib/sites/siteForm";
import { IconArrow, IconCalendar } from "@/components/home1/icons";

/** @type {import("@/lib/sites/siteTypes").SavedSite[]} */
const INITIAL_SITES = [
  {
    id: "site-1",
    name: "Head Office",
    contact: "Israr Munir",
    phone: "0115 778 0622",
    address: "42 Mapperley Road, Nottingham NG3 5FS",
    notes: "Main office reception. Parking available at rear.",
    jobs: 6,
    lastVisit: "12 May 2026",
    primary: true,
    addressLine1: "42 Mapperley Road",
    townCity: "Nottingham",
    postcode: "NG3 5FS",
  },
  {
    id: "site-2",
    name: "Warehouse Unit",
    contact: "Operations Team",
    phone: "0115 778 0622",
    address: "Unit 4 Riverside Park, Derby DE1 2AY",
    notes: "Call site manager 20 mins before arrival.",
    jobs: 3,
    lastVisit: "21 Apr 2026",
    primary: false,
    addressLine1: "Unit 4 Riverside Park",
    townCity: "Derby",
    postcode: "DE1 2AY",
  },
];

/**
 * @param {{
 *   site: import("@/lib/sites/siteTypes").SavedSite,
 *   onEdit: (id: string) => void,
 *   onDelete: (id: string) => void,
 * }} props
 */
function SiteCard({ site, onEdit, onDelete }) {
  return (
    <article className="home1-sites-card home1-card">
      <div className="home1-sites-card-head">
        <div className="min-w-0">
          <h2 className="home1-sites-card-title">
            {site.name}
            {site.primary ? <span className="home1-sites-primary-badge">Default</span> : null}
          </h2>
          <p className="home1-sites-card-contact">{site.contact}</p>
        </div>
        <span className="home1-sites-card-jobs">
          {site.jobs} {site.jobs === 1 ? "job" : "jobs"}
        </span>
      </div>

      <dl className="home1-sites-card-meta">
        <div>
          <dt>Address</dt>
          <dd>{site.address}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{site.phone}</dd>
        </div>
        {site.email ? (
          <div>
            <dt>Email</dt>
            <dd>{site.email}</dd>
          </div>
        ) : null}
        <div>
          <dt>Last visit</dt>
          <dd>{site.lastVisit}</dd>
        </div>
      </dl>

      {site.notes ? <p className="home1-sites-card-notes">{site.notes}</p> : null}

      <div className="home1-sites-card-actions">
        <button
          type="button"
          className="home1-btn-outline home1-sites-btn"
          onClick={() => onEdit(site.id)}
        >
          Edit
        </button>
        <button
          type="button"
          className="home1-btn-outline home1-sites-btn home1-sites-btn--danger"
          onClick={() => onDelete(site.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

function SitesEmpty({ onCreate }) {
  return (
    <div className="home1-sites-empty home1-card">
      <div className="home1-sites-empty-icon" aria-hidden="true">
        <IconCalendar className="w-8 h-8" />
      </div>
      <h2 className="home1-sites-empty-title">No saved sites yet</h2>
      <p className="home1-sites-empty-text">
        Add your first job location to speed up checkout and keep visit notes in one place.
      </p>
      <button type="button" className="home1-btn-primary inline-flex items-center gap-2" onClick={onCreate}>
        Create site
        <IconArrow className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function SitesPageClient() {
  const [sites, setSites] = useState(INITIAL_SITES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const editingSite = editingId ? sites.find((s) => s.id === editingId) : null;
  const modalMode = editingId ? "edit" : "create";
  const modalInitialForm = editingSite ? siteToForm(editingSite) : undefined;

  const stats = useMemo(
    () => ({
      total: sites.length,
      primary: sites.filter((s) => s.primary).length,
      jobs: sites.reduce((sum, s) => sum + s.jobs, 0),
    }),
    [sites]
  );

  function openCreateModal() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEditModal(id) {
    setEditingId(id);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
  }

  async function handleSubmitSite(form) {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));

    if (editingId) {
      const existing = sites.find((s) => s.id === editingId);
      const updated = siteFromForm(form, editingId);
      if (existing) {
        updated.jobs = existing.jobs;
        updated.lastVisit = existing.lastVisit;
      }
      setSites((prev) => applyUpdatedSite(prev, updated));
      toastSuccess(updated.primary ? "Default site updated." : "Site updated successfully.");
    } else {
      const added = siteFromForm(form);
      setSites((prev) => applyNewSite(prev, added));
      toastSuccess(added.primary ? "Default site saved." : "Site added successfully.");
    }

    setSaving(false);
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDeleteSite(id) {
    const site = sites.find((s) => s.id === id);
    if (!site) return;
    const confirmed = window.confirm(`Delete "${site.name}"? This cannot be undone.`);
    if (!confirmed) return;
    setSites((prev) => removeSite(prev, id));
    toastSuccess("Site deleted.");
  }

  return (
    <AccountLayout
      active="sites"
      title="My sites"
      description="Save job locations for faster checkout and better visit coordination."
    >
      <div className="home1-sites-stats">
        <div className="home1-sites-stat home1-card">
          <p className="home1-sites-stat-value">{stats.total}</p>
          <p className="home1-sites-stat-label">Saved sites</p>
        </div>
        <div className="home1-sites-stat home1-card home1-sites-stat--accent">
          <p className="home1-sites-stat-value">{stats.primary}</p>
          <p className="home1-sites-stat-label">Default address</p>
        </div>
        <div className="home1-sites-stat home1-card">
          <p className="home1-sites-stat-value">{stats.jobs}</p>
          <p className="home1-sites-stat-label">Jobs completed</p>
        </div>
      </div>

      <section className="home1-sites-panel home1-card w-full">
        <header className="home1-sites-panel-head home1-sites-panel-head--row">
          <div>
            <h2 className="home1-sites-panel-title">Saved locations</h2>
            <p className="home1-sites-panel-lead">Use these addresses while booking services.</p>
          </div>
          <button
            type="button"
            className="home1-btn-primary home1-sites-create-btn"
            onClick={openCreateModal}
          >
            Create site
          </button>
        </header>

        {sites.length === 0 ? (
          <SitesEmpty onCreate={openCreateModal} />
        ) : (
          <ul className="home1-sites-list p-0 m-0">
            {sites.map((site) => (
              <li key={site.id}>
                <SiteCard site={site} onEdit={openEditModal} onDelete={handleDeleteSite} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <CreateSiteModal
        open={modalOpen}
        onClose={closeModal}
        onSubmit={handleSubmitSite}
        saving={saving}
        mode={modalMode}
        initialForm={modalInitialForm}
      />
    </AccountLayout>
  );
}
