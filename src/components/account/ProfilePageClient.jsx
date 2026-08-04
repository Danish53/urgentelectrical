"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountLayout from "@/components/account/AccountLayout";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { EMPTY_PROFILE_FORM } from "@/lib/auth/profileMapper";
import { getProfileFromUser, getProfileInitials } from "@/lib/auth/profileFromUser";
import { toastError, toastSuccess } from "@/lib/toast";
import { setAuthUser } from "@/store/slices/authSlice";
import {
  clearProfileSaveError,
  loadProfile,
  saveProfile,
} from "@/store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/store/selectors/authSelectors";
import ButtonSpinner from "@/components/ui/ButtonSpinner";
import { IconCheck } from "@/components/home1/icons";
import "@/components/skeletons/skeleton.css";

const PROFILE_INPUT = `${AUTH_INPUT_CLASS} home1-profile-input`;

export default function ProfilePageClient() {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(selectAuthUser);
  const { form: storedForm, status, error, saving, saveError } = useAppSelector(
    (state) => state.profile
  );

  const [form, setForm] = useState(EMPTY_PROFILE_FORM);
  const loading = status === "loading" || status === "idle";
  const [hydrateSource, setHydrateSource] = useState({ storedForm: null, authUser: null });

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  if (storedForm !== hydrateSource.storedForm || authUser !== hydrateSource.authUser) {
    setHydrateSource({ storedForm, authUser });
    if (storedForm) {
      setForm(storedForm);
    } else if (authUser) {
      setForm(getProfileFromUser(authUser));
    }
  }

  const initials = getProfileInitials(form.displayName);

  function updateField(key, value) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      const displayName = [next.firstName, next.lastName]
        .map((s) => s.trim())
        .filter(Boolean)
        .join(" ");
      next.displayName = displayName || "Customer";
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(clearProfileSaveError());

    try {
      const result = await dispatch(saveProfile(form)).unwrap();
      dispatch(setAuthUser(result.raw));
      setForm(result.form);
      toastSuccess("Profile updated successfully.");
    } catch (err) {
      toastError(err, "Could not update profile.");
    }
  }

  return (
    <AccountLayout
      active="profile"
      title="My profile"
      description="Manage your personal details and account preferences."
    >
      <div className="home1-profile-hero home1-card">
        <div className="home1-profile-hero-main">
          <span className="home1-profile-avatar" aria-hidden="true">
            {initials}
          </span>
          <div className="min-w-0">
            <h2 className="home1-profile-hero-name">{form.displayName}</h2>
            <p className="home1-profile-hero-email">{form.email || "No email on file"}</p>
          </div>
        </div>
        <div className="home1-profile-hero-badge">
          <IconCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          Verified Customer
        </div>
      </div>

      {loading && !storedForm ? (
        <div className="home1-profile-grid home1-profile-grid--skeleton" aria-hidden="true">
          <section className="home1-profile-panel home1-card p-5 space-y-4">
            <div className="ue-skeleton h-5 w-40 rounded" />
            <div className="ue-skeleton h-3 w-64 max-w-full rounded" />
            <div className="home1-profile-form-grid mt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={i === 2 || i === 3 ? "home1-profile-form-full" : ""}>
                  <div className="ue-skeleton h-3 w-20 rounded mb-2" />
                  <div className="ue-skeleton h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && status === "failed" && !storedForm ? (
        <div className="home1-card p-4 mb-4">
          <p className="text-sm text-[#9f1239]">{error}</p>
          <button
            type="button"
            className="home1-btn-outline mt-3 text-sm"
            onClick={() => dispatch(loadProfile())}
          >
            Try again
          </button>
        </div>
      ) : null}

      {!loading && status === "failed" && storedForm ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
          {error} Showing saved details below.
        </p>
      ) : null}

      <div className={`home1-profile-grid${loading && !storedForm ? " hidden" : ""}`}>
        <section className="home1-profile-panel home1-card">
          <header className="home1-profile-panel-head">
            <h2 className="home1-profile-panel-title">Personal details</h2>
            <p className="home1-profile-panel-lead">Update your contact information for bookings.</p>
          </header>

          <form onSubmit={handleSubmit} className="home1-profile-form" noValidate>
            <div className="home1-profile-form-grid">
              <div>
                <label htmlFor="profile-first-name" className={AUTH_LABEL_CLASS}>
                  First name
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div>
                <label htmlFor="profile-last-name" className={AUTH_LABEL_CLASS}>
                  Last name
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-email" className={AUTH_LABEL_CLASS}>
                  Email address
                </label>
                <input
                  id="profile-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-phone" className={AUTH_LABEL_CLASS}>
                  Mobile number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="e.g. 07XXX XXXXXX"
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-company" className={AUTH_LABEL_CLASS}>
                  Company <span className="text-[var(--home1-muted)] font-normal">(optional)</span>
                </label>
                <input
                  id="profile-company"
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-line1" className={AUTH_LABEL_CLASS}>
                  Address line 1
                </label>
                <input
                  id="profile-line1"
                  type="text"
                  autoComplete="address-line1"
                  value={form.addressLine1}
                  onChange={(e) => updateField("addressLine1", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-line2" className={AUTH_LABEL_CLASS}>
                  Address line 2 <span className="text-[var(--home1-muted)] font-normal">(optional)</span>
                </label>
                <input
                  id="profile-line2"
                  type="text"
                  autoComplete="address-line2"
                  value={form.addressLine2}
                  onChange={(e) => updateField("addressLine2", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div>
                <label htmlFor="profile-town" className={AUTH_LABEL_CLASS}>
                  Town / City
                </label>
                <input
                  id="profile-town"
                  type="text"
                  autoComplete="address-level2"
                  value={form.townCity}
                  onChange={(e) => updateField("townCity", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div>
                <label htmlFor="profile-county" className={AUTH_LABEL_CLASS}>
                  County <span className="text-[var(--home1-muted)] font-normal">(optional)</span>
                </label>
                <input
                  id="profile-county"
                  type="text"
                  value={form.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
              <div>
                <label htmlFor="profile-postcode" className={AUTH_LABEL_CLASS}>
                  Postcode
                </label>
                <input
                  id="profile-postcode"
                  type="text"
                  autoComplete="postal-code"
                  value={form.postcode}
                  onChange={(e) => updateField("postcode", e.target.value.toUpperCase())}
                  placeholder="NG1 1AA"
                  className={PROFILE_INPUT}
                  disabled={saving || loading}
                />
              </div>
            </div>

            {saveError ? (
              <p className="mt-3 text-sm text-[#9f1239]" role="alert">
                {saveError}
              </p>
            ) : null}

            <div className="home1-profile-form-actions">
              <button
                type="submit"
                className="home1-btn-primary home1-profile-save inline-flex items-center justify-center gap-2"
                disabled={saving || loading}
              >
                {saving ? <ButtonSpinner /> : null}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        <aside className="home1-profile-aside">
          <section className="home1-profile-panel home1-card">
            <header className="home1-profile-panel-head">
              <h2 className="home1-profile-panel-title">Account security</h2>
              <p className="home1-profile-panel-lead">Keep your account secure.</p>
            </header>
            <ul className="home1-profile-security-list list-none p-0 m-0">
              <li>
                <Link href="/account/sites" className="home1-profile-security-link">
                  <span>View my sites</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="home1-profile-security-link">
                  <span>View my orders</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            </ul>
          </section>

          <section className="home1-profile-panel home1-card home1-profile-panel--muted">
            <h2 className="home1-profile-panel-title">Quick book</h2>
            <p className="home1-profile-panel-lead">
              Need an electrician? Book online in minutes with fixed pricing.
            </p>
            <Link href="/services" className="home1-btn-primary home1-profile-book w-full justify-center">
              Book a service
            </Link>
          </section>
        </aside>
      </div>
    </AccountLayout>
  );
}
