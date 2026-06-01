"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import AuthMemberGuard from "@/components/login/AuthMemberGuard";
import { CONTAINER } from "@/components/home1/constants";

/**
 * @param {{ title: string, description?: string, children?: import("react").ReactNode }} props
 */
export default function AccountPageShell({ title, description, children }) {
  return (
    <AuthMemberGuard>
      <div className="min-h-screen bg-[#f9f8f6]">
        <Navbar />
        <main
          className={`${CONTAINER} py-10 sm:py-14`}
          style={{ paddingTop: "calc(var(--site-header-height, 88px) + 2rem)" }}
        >
          <nav className="text-sm text-[#6b7280] mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#111827]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827] font-medium">{title}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] mb-2">{title}</h1>
          {description ? <p className="text-[#6b7280] max-w-2xl mb-8">{description}</p> : null}
          {children}
        </main>
        <Footer />
      </div>
    </AuthMemberGuard>
  );
}
