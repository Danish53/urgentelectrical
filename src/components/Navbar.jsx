"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONTAINER, NAV_SHELL } from "@/components/home1/constants";
import NavAuthControl from "@/components/nav/NavAuthControl";
import NavMenuSkeleton from "@/components/skeletons/NavMenuSkeleton";
import { NAV_MENU_ITEM } from "@/components/nav/navMenuStyles";
import { useVatPreference } from "@/components/providers/VatPreferenceProvider";
import { NAV_DROPDOWN_SUBTITLES } from "./navData";
import { useWebsiteGeneralData } from "@/hooks/useWebsiteGeneralData";
import { useNavMenu } from "@/hooks/useNavMenu";
import {
  AVAILABILITY_OPEN,
  getEngineerAvailability,
} from "@/lib/engineerAvailability";

function NavIconPhone({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

function NavIconChevron({ open }) {
  return (
    <svg
      className={`w-3 h-3 text-[#9ca3af] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavIconArrowRight() {
  return (
    <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavIconCalendar() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function NavIconBookArrow() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h12M13 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandLogo({ compact = false }) {
  const logoSize = compact ? 40 : 46;
  const textVisibilityClass = compact
    ? "flex"
    : "hidden min-[1200px]:flex";

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 shrink-0 min-w-0" title="Urgent Electrical Services">
      <Image
        src="/logo.jpg"
        alt="Urgent Electrical Services"
        width={logoSize}
        height={logoSize}
        sizes={`${logoSize}px`}
        className="shrink-0 object-contain"
        priority
      />
      <span className={`${textVisibilityClass} flex-col justify-center text-left min-w-0`}>
        <span
          className={`font-bold text-[#111827] leading-[1.15] whitespace-nowrap ${
            compact ? "text-[14px]" : "text-[15px]"
          }`}
        >
          {compact ? "Urgent Electrical" : "Urgent Electrical Services"}
        </span>
        <span className="text-[9px] font-normal tracking-[0.14em] text-[#c62828] uppercase leading-tight mt-[3px] whitespace-nowrap">
          {compact ? "24 HR EMERGENCY" : "24 HR EMERGENCY RESPONSE"}
        </span>
      </span>
    </Link>
  );
}

function NavEngineerAvailability({ compact = false, className = "" }) {
  const [availability, setAvailability] = useState(AVAILABILITY_OPEN);

  useEffect(() => {
    setAvailability(getEngineerAvailability());
  }, []);

  // Night / limited — hide from navbar (shown on emergency service page instead).
  if (availability.limited) return null;

  const text = compact ? availability.navTextCompact : availability.navText;

  return (
    <span className={`nav-availability ${className}`.trim()}>
      <span className="nav-availability-dot-wrap" aria-hidden="true">
        <span className="nav-availability-dot" />
      </span>
      <span className="nav-availability-text">{text}</span>
    </span>
  );
}

function NavTopUtilityBar({ incVat, onVatToggle, showDesktopExtras = true, shellClass = CONTAINER, className = "" }) {
  const { site } = useWebsiteGeneralData();

  return (
    <div className={`bg-[#f9f8f6] border-b border-[#ececec] ${className}`.trim()}>
      <div
        className={`${shellClass} relative h-10 flex items-center text-[13px] leading-none gap-3 lg:gap-4`}
      >
        <a
          href={`tel:${site.contactNumber}`}
          className="flex items-center gap-2 text-[#5A5856] font-medium hover:text-[#111827] transition-colors shrink-0"
        >
          <NavIconPhone className="w-4 h-4 text-[#c62828]" />
          <span className="tracking-wide">{site.contactNumberDisplay}</span>
        </a>
        <span className="hidden lg:block w-px h-[14px] bg-[#d4d4d4] shrink-0" aria-hidden />
        <NavEngineerAvailability className="absolute right-2 top-1/2 -translate-y-1/2 lg:static lg:right-auto lg:translate-y-0 shrink-0" />

        {showDesktopExtras && (
          <div className="hidden lg:flex items-center gap-2.5 ml-auto shrink-0">
            <span className="px-3 py-[5px] rounded-full border border-[#d4d4d4] text-[#6b7280] text-[11px] font-medium bg-white leading-none">
              NICEIC Approved
            </span>
            <span className="px-3 py-[5px] rounded-full border border-[#d4d4d4] text-[#6b7280] text-[11px] font-medium bg-white leading-none">
              Est. 2014
            </span>
            <span className="w-px h-[14px] bg-[#d4d4d4] mx-1" aria-hidden />
            <div className="flex items-center gap-2.5 text-[#6b7280] text-[11px] font-medium">
              <span className={!incVat ? "text-[#5A5856]" : "text-[#9ca3af]"}>Exc VAT</span>
              <button
                type="button"
                role="switch"
                aria-checked={incVat}
                onClick={onVatToggle}
                className={`relative inline-flex shrink-0 w-8 h-[15px] rounded-full transition-colors duration-200 ${incVat ? "bg-[#1a1a1a]" : "bg-[#c4c4c4]"}`}
              >
                <span
                  className={`pointer-events-none absolute top-[2px] left-[2px] h-[11px] w-[11px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out ${incVat ? "translate-x-[17px]" : "translate-x-0"}`}
                />
              </button>
              <span className={incVat ? "text-[#5A5856]" : "text-[#9ca3af]"}>Inc VAT</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavMegaDropdown({ group, onNavigate }) {
  const subtitle =
    NAV_DROPDOWN_SUBTITLES[group.label] || `Professional ${group.label.toLowerCase()} services`;
  const viewAllLabel = `View all ${group.label.toLowerCase()}`;

  return (
    <div className="absolute top-full left-0 pt-2 z-[60]">
      <div className="w-[268px] bg-[#0a0a0a] rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="px-5 pt-4 pb-3 border-b border-[#1f1f1f]">
          <p className="text-white text-[17px] font-semibold leading-tight">{group.label}</p>
          <p className="text-[#9ca3af] text-[12px] font-normal mt-0.5">{subtitle}</p>
        </div>
        <ul className="px-5 py-1">
          {group.items.map((item) => (
            <li key={item.key ?? item.label}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="block py-2.5 text-[13px] font-normal text-[#d1d5db] hover:text-white transition-colors leading-snug"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-[#1f1f1f]">
          <Link
            href="/pages"
            onClick={onNavigate}
            className="inline-flex items-center gap-1 text-[#e11d48] text-[13px] font-medium hover:text-[#f87171] transition-colors"
          >
            {viewAllLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const headerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const { navGroups, loading: navMenuLoading } = useNavMenu();
  const { incVat, toggleVat } = useVatPreference();
  useEffect(() => {
    if (!navMenuLoading && navGroups.length && mobileAccordion === null) {
      setMobileAccordion(navGroups[0].label);
    }
  }, [navGroups, mobileAccordion, navMenuLoading]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e8e8e8] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
      >
        <NavTopUtilityBar
          incVat={incVat}
          onVatToggle={toggleVat}
          shellClass={NAV_SHELL}
          className={mobileOpen ? "max-lg:hidden" : ""}
        />

        {!mobileOpen && (
          <div className={NAV_SHELL}>
            {/* Mobile */}
            <div className="flex lg:hidden items-center justify-between min-h-[68px] py-3 gap-4">
              <BrandLogo compact />
              <div className="flex items-center gap-2.5 shrink-0">
                <Link
                  href="/services"
                  className="nav-book-now-cta inline-flex items-center gap-1.5 bg-[#111111] hover:bg-[#d32f2f] text-white text-[14px] font-semibold px-3.5 py-2 rounded-lg transition-colors"
                >
                  <NavIconCalendar />
                  Book
                </Link>
                <button
                  type="button"
                  className="flex flex-col justify-center items-center w-11 h-11 rounded-lg border border-[#e0e0e0] hover:bg-[#fafafa] transition-colors shrink-0"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <span className="block w-[20px] h-[2.5px] bg-[#111827] mb-[5px] rounded-full" />
                  <span className="block w-[20px] h-[2.5px] bg-[#111827] mb-[5px] rounded-full" />
                  <span className="block w-[20px] h-[2.5px] bg-[#111827] rounded-full" />
                </button>
              </div>
            </div>

            {/* Desktop: logo | centered menu | Book Now */}
            <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-2 xl:gap-4 min-h-[72px] py-3 w-full">
              <div className="flex items-center justify-start min-w-0 shrink-0">
                <BrandLogo />
              </div>

              <nav
                className="flex flex-nowrap items-center justify-center min-w-0 gap-x-0 px-0 overflow-x-clip"
                aria-busy={navMenuLoading}
              >
                {navMenuLoading ? (
                  <NavMenuSkeleton variant="desktop" />
                ) : (
                  navGroups.map((group) => {
                  const isOpen = activeMenu === group.label;
                  return (
                    <div
                      key={group.slug ?? group.label}
                      className="relative shrink-0"
                      onMouseEnter={() => setActiveMenu(group.label)}
                      onMouseLeave={() => setActiveMenu(null)}
                    >
                      <button
                        type="button"
                        className={`${NAV_MENU_ITEM} ${isOpen ? "bg-[#f5f4f0]" : "hover:text-[#3d3b39]"}`}
                      >
                        {group.label}
                        <NavIconChevron open={isOpen} />
                      </button>
                      {isOpen && group.items.length > 0 && (
                        <NavMegaDropdown group={group} onNavigate={() => setActiveMenu(null)} />
                      )}
                    </div>
                  );
                  })
                )}
                {/* <a href="/services" className={`${NAV_MENU_ITEM} hover:text-[#3d3b39]`}>
                  Services
                </a> */}
                <Link href="/blog" className={`${NAV_MENU_ITEM} hover:text-[#3d3b39]`}>
                  Blogs
                </Link>
                <NavAuthControl variant="desktop" />
              </nav>

              <div className="flex items-center justify-end min-w-0 shrink-0">
                <Link
                  href="/services"
                  className="nav-book-now-cta group inline-flex items-center gap-1.5 bg-[#111111] text-white text-[14px] font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap shadow-sm transition-all duration-300 ease-out hover:bg-[#d32f2f] hover:shadow-[0_6px_20px_rgba(211,47,47,0.35)] hover:-translate-y-px active:translate-y-0"
                >
                  Book Now
                  <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                    <NavIconBookArrow />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col lg:hidden">
          <NavTopUtilityBar incVat={incVat} onVatToggle={toggleVat} showDesktopExtras={false} />

          <div className="flex items-center justify-between px-5 min-h-[68px] py-3 border-b border-[#e8e8e8] shrink-0">
            <BrandLogo compact />
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/services"
                onClick={closeMobile}
                className="nav-book-now-cta inline-flex items-center gap-1.5 bg-[#111111] hover:bg-[#d32f2f] text-white text-[14px] font-semibold px-3.5 py-2 rounded-lg transition-colors"
              >
                <NavIconCalendar />
                Book
              </Link>
              <button
                type="button"
                onClick={closeMobile}
                className="w-10 h-10 flex items-center justify-center rounded-md border border-[#e5e7eb] text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto" aria-busy={navMenuLoading}>
            {navMenuLoading ? (
              <NavMenuSkeleton variant="mobile" />
            ) : (
              navGroups.map((group) => {
              const isOpen = mobileAccordion === group.label;
              return (
                <div key={group.slug ?? group.label} className="border-b border-[#ebebeb]">
                  <button
                    type="button"
                    onClick={() => setMobileAccordion(isOpen ? null : group.label)}
                    className={`w-full flex items-center justify-between px-5 py-4 text-left font-bold text-[15px] text-[#0f172a] transition-colors ${
                      isOpen ? "bg-[#f9f8f3] border-t-2 border-t-[#d4af37]" : "bg-white"
                    }`}
                  >
                    {group.label}
                    <NavIconChevron open={isOpen} />
                  </button>
                  {isOpen && group.items.length > 0 && (
                    <div className="bg-[#f9f8f3] px-4 pb-4">
                      <div className="pt-3 pb-2 border-b border-[#e8e4dc] mb-1">
                        <p className="font-bold text-gray-900 text-[15px]">{group.label}</p>
                        <p className="text-[13px] text-[#9ca3af] mt-0.5">Professional services</p>
                      </div>
                      <ul className="space-y-0">
                        {group.items.map((item) => (
                          <li key={item.key ?? item.label}>
                            <Link
                              href={item.href}
                              onClick={closeMobile}
                              className="flex items-center justify-between py-3 text-[14px] text-[#4b5563] font-medium border-b border-[#ebebeb]/80 last:border-0 hover:text-gray-900"
                            >
                              <span className="pr-3">{item.label}</span>
                              <NavIconArrowRight />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
              })
            )}
            <Link
              href="/services"
              onClick={closeMobile}
              className="flex items-center justify-between px-4 py-3.5 font-bold text-[15px] text-gray-900 bg-white border-b border-[#ebebeb]"
            >
              Services
              <NavIconArrowRight />
            </Link>
            <Link
              href="/blog"
              onClick={closeMobile}
              className="flex items-center justify-between px-4 py-3.5 font-bold text-[15px] text-gray-900 bg-white border-b border-[#ebebeb]"
            >
              Blogs
              <NavIconArrowRight />
            </Link>
            <Link
              href="/contact-us"
              onClick={closeMobile}
              className="flex items-center justify-between px-4 py-3.5 text-[14px] font-medium text-[#4b5563] border-b border-[#ebebeb]"
            >
              Contact
              <NavIconArrowRight />
            </Link>
            <NavAuthControl variant="mobile" onNavigate={closeMobile} />
          </nav>
        </div>
      )}
    </>
  );
}
