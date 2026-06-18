"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserDisplayName } from "@/lib/auth/userDisplayName";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { selectAuthUser } from "@/store/selectors/authSelectors";
import {
  NAV_DROPDOWN_ACTION,
  NAV_DROPDOWN_LINK,
  NAV_DROPDOWN_PANEL,
  NAV_MENU_ITEM,
} from "@/components/nav/navMenuStyles";

const MENU_LINKS = [
  { href: "/account/profile", label: "My Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/sites", label: "Sites" },
];

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

function NavUserDropdown({ displayName, onNavigate, onLogout }) {
  return (
    <div className="absolute top-full right-0 pt-2 z-[60]">
      <div className={NAV_DROPDOWN_PANEL}>
        <div className="px-5 pt-4 pb-3 border-b border-[#1f1f1f]">
          <p className="text-white text-[17px] font-semibold leading-tight">{displayName}</p>
          <p className="text-[#9ca3af] text-[12px] font-normal mt-0.5">My account</p>
        </div>
        <ul className="px-5 py-1">
          {MENU_LINKS.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onNavigate} className={NAV_DROPDOWN_LINK}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-5 py-3 border-t border-[#1f1f1f]">
          <button type="button" onClick={onLogout} className={NAV_DROPDOWN_ACTION}>
            Logout
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @param {{ variant?: "desktop" | "mobile", onNavigate?: () => void, menuClassName?: string }} props
 */
export default function NavUserMenu({ variant = "desktop", onNavigate, menuClassName = "" }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const { ready } = useAuthSession();
  const [open, setOpen] = useState(false);

  const displayName = getUserDisplayName(user);

  const closeMenu = useCallback(() => setOpen(false), []);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    toastSuccess("You have been signed out.");
    closeMenu();
    onNavigate?.();
    router.replace("/");
  }, [closeMenu, dispatch, onNavigate, router]);

  if (!ready) {
    return variant === "mobile" ? null : (
      <span className={`${NAV_MENU_ITEM} opacity-0 pointer-events-none`} aria-hidden>
        Account
      </span>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="border-b border-[#ebebeb] bg-white">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left font-bold text-[15px] text-[#0f172a] transition-colors"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {displayName}
          <NavIconChevron open={open} />
        </button>

        {open ? (
          <div className="bg-[#f9f8f3] px-4 pb-4">
            <ul className="space-y-0">
              {MENU_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      closeMenu();
                      onNavigate?.();
                    }}
                    className="flex items-center justify-between py-3 text-[14px] text-[#4b5563] font-medium border-b border-[#ebebeb]/80 last:border-0 hover:text-gray-900"
                  >
                    <span className="pr-3">{item.label}</span>
                    <NavIconArrowRight />
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 inline-flex items-center gap-1 text-[#e11d48] text-[13px] font-medium hover:text-[#f87171] transition-colors"
            >
              Logout
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${NAV_MENU_ITEM} ${menuClassName} ${open ? "bg-[#f5f4f0]" : "hover:text-[#3d3b39]"}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {displayName}
        <NavIconChevron open={open} />
      </button>

      {open ? (
        <NavUserDropdown
          displayName={displayName}
          onNavigate={() => {
            closeMenu();
            onNavigate?.();
          }}
          onLogout={handleLogout}
        />
      ) : null}
    </div>
  );
}
