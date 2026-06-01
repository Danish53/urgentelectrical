"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import AuthMemberGuard from "@/components/login/AuthMemberGuard";
import AccountSidebar from "@/components/account/AccountSidebar";
import { SERVICES_PAGE_CONTAINER } from "@/components/home1/constants";

/**
 * @param {{
 *   active: "profile" | "orders" | "sites",
 *   title: string,
 *   description?: string,
 *   children?: import("react").ReactNode,
 * }} props
 */
export default function AccountLayout({ active, title, description, children }) {
  return (
    <AuthMemberGuard>
      <div className="home1-page min-h-screen bg-[#f9f8f6]">
        <Navbar />
        <main className={`${SERVICES_PAGE_CONTAINER} home1-account-main`}>
          <div className="home1-account-layout">
            <AccountSidebar active={active} />

            <div className="home1-account-content min-w-0">
              <nav className="home1-account-mobile-nav lg:hidden" aria-label="Account">
                <Link
                  href="/account/profile"
                  className={active === "profile" ? "is-active" : undefined}
                >
                  My Profile
                </Link>
                <Link
                  href="/account/orders"
                  className={active === "orders" ? "is-active" : undefined}
                >
                  Orders
                </Link>
                <Link href="/account/sites" className={active === "sites" ? "is-active" : undefined}>
                  Sites
                </Link>
              </nav>

              <header className="home1-account-header">
                <h1 className="home1-account-title">{title}</h1>
                {description ? <p className="home1-account-description">{description}</p> : null}
              </header>

              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </AuthMemberGuard>
  );
}
