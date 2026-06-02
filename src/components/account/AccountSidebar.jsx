"use client";

import Link from "next/link";

const LINKS = [
  { href: "/account/profile", label: "My Profile", id: "profile" },
  { href: "/account/orders", label: "Orders", id: "orders" },
  { href: "/account/sites", label: "Sites", id: "sites" },
];

/**
 * @param {{ active: "profile" | "orders" | "sites" }} props
 */
export default function AccountSidebar({ active }) {
  return (
    <nav className="home1-account-sidebar" aria-label="Account navigation">
      <p className="home1-account-sidebar-label">Account</p>
      <ul className="home1-account-sidebar-list list-none p-0 m-0">
        {LINKS.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`home1-account-sidebar-link${isActive ? " is-active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="home1-account-sidebar-help">
        <p className="home1-account-sidebar-help-title">Need help?</p>
        <p className="home1-account-sidebar-help-text">
          Call us 24/7 or book a new visit online.
        </p>
        <a href="tel:01157780622" className="home1-account-sidebar-help-phone">
          0115 778 0622
        </a>
        <Link href="/services" className="home1-btn-primary home1-account-sidebar-cta">
          Book online
        </Link>
      </div>
    </nav>
  );
}
