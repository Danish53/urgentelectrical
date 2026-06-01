"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountLayout from "@/components/account/AccountLayout";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { getProfileFromUser, getProfileInitials } from "@/lib/auth/profileFromUser";
import { toastSuccess } from "@/lib/toast";
import { useAppSelector } from "@/store/hooks";
import { selectAuthUser } from "@/store/selectors/authSelectors";
import { IconCheck } from "@/components/home1/icons";

const PROFILE_INPUT = `${AUTH_INPUT_CLASS} home1-profile-input`;

export default function ProfilePageClient() {
  const user = useAppSelector(selectAuthUser);
  const base = getProfileFromUser(user);

  const [form, setForm] = useState(base);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(getProfileFromUser(user));
  }, [user]);

  const initials = getProfileInitials(form.displayName);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toastSuccess("Profile updated successfully.");
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
          Verified customer
        </div>
      </div>

      <div className="home1-profile-grid">
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-phone" className={AUTH_LABEL_CLASS}>
                  Phone number
                </label>
                <input
                  id="profile-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="07XXX XXXXXX"
                  className={PROFILE_INPUT}
                  disabled={saving}
                />
              </div>
              <div className="home1-profile-form-full">
                <label htmlFor="profile-address" className={AUTH_LABEL_CLASS}>
                  Address
                </label>
                <input
                  id="profile-address"
                  type="text"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="Street address"
                  className={PROFILE_INPUT}
                  disabled={saving}
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
                  onChange={(e) => updateField("postcode", e.target.value)}
                  placeholder="NG1 1AA"
                  className={PROFILE_INPUT}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="home1-profile-form-actions">
              <button type="submit" className="home1-btn-primary home1-profile-save" disabled={saving}>
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
                <Link href="/login/forgot-password" className="home1-profile-security-link">
                  <span>Change password</span>
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
            <Link href="/checkout" className="home1-btn-primary home1-profile-book w-full justify-center">
              Book a service
            </Link>
          </section>
        </aside>
      </div>
    </AccountLayout>
  );
}
