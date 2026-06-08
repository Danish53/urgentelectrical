"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchAllSiteAddresses } from "@/services/siteAddressesApiService";

/**
 * @param {import("@/lib/sites/siteTypes").SavedSite} site
 * @param {string} query
 */
function matchesSiteSearch(site, query) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    site.name,
    site.address,
    site.postcode,
    site.townCity,
    site.county,
    site.contact,
    site.phone,
    site.email,
    site.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

/**
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   onSelect: (site: import("@/lib/sites/siteTypes").SavedSite) => void,
 * }} props
 */
export default function CheckoutSiteAddressModal({ open, onClose, onSelect }) {
  const titleId = useId();
  const searchId = useId();
  const [sites, setSites] = useState(/** @type {import("@/lib/sites/siteTypes").SavedSite[]} */ ([]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setSearchQuery("");

    fetchAllSiteAddresses()
      .then((rows) => {
        if (!cancelled) setSites(rows);
      })
      .catch((err) => {
        if (!cancelled) {
          setSites([]);
          setError(getApiErrorMessage(err, "Could not load your saved addresses."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const filteredSites = useMemo(
    () => sites.filter((site) => matchesSiteSearch(site, searchQuery)),
    [sites, searchQuery]
  );

  if (!open) return null;

  return (
    <div className="home1-checkout-site-modal-root" role="presentation">
      <button
        type="button"
        className="home1-checkout-site-modal-backdrop"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div
        className="home1-checkout-site-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="home1-checkout-site-modal-head">
          <div>
            <p className="home1-checkout-site-modal-eyebrow">Saved addresses</p>
            <h2 id={titleId} className="home1-checkout-site-modal-title">
              Choose a site address
            </h2>
          </div>
          <button type="button" className="home1-checkout-site-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="home1-checkout-site-modal-body">
          <label htmlFor={searchId} className="sr-only">
            Search saved addresses
          </label>
          <div className="home1-checkout-site-modal-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, address or postcode…"
              className="home1-checkout-site-modal-search-input"
              autoComplete="off"
            />
          </div>

          {loading ? (
            <p className="home1-checkout-site-modal-status" role="status">
              Loading your saved addresses…
            </p>
          ) : null}

          {error ? (
            <p className="home1-checkout-site-modal-error" role="alert">
              {error}
            </p>
          ) : null}

          {!loading && !error && sites.length === 0 ? (
            <p className="home1-checkout-site-modal-status">
              No saved addresses yet. Add one from your account sites page.
            </p>
          ) : null}

          {!loading && !error && sites.length > 0 && filteredSites.length === 0 ? (
            <p className="home1-checkout-site-modal-status">
              No addresses match &ldquo;{searchQuery.trim()}&rdquo;.
            </p>
          ) : null}

          {!loading && !error && filteredSites.length > 0 ? (
            <ul className="home1-checkout-site-modal-list" role="listbox" aria-label="Saved site addresses">
              {filteredSites.map((site) => (
                <li key={site.id}>
                  <button
                    type="button"
                    role="option"
                    className="home1-checkout-site-modal-item"
                    onClick={() => {
                      onSelect(site);
                      onClose();
                    }}
                  >
                    <span className="home1-checkout-site-modal-item-top">
                      <strong>{site.name}</strong>
                      {site.primary ? <span className="home1-checkout-site-modal-badge">Default</span> : null}
                    </span>
                    <span className="home1-checkout-site-modal-item-address">{site.address}</span>
                    {site.postcode ? (
                      <span className="home1-checkout-site-modal-item-meta">{site.postcode}</span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
