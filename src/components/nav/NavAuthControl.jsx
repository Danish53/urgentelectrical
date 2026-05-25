"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { toastSuccess } from "@/lib/toast";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

const DESKTOP_CLASS =
  "flex items-center gap-[5px] text-[14px] font-[600] text-[#5A5856] py-2 px-[14px] rounded-xl whitespace-nowrap transition-all hover:text-[#3d3b39]";

const MOBILE_CLASS =
  "flex w-full items-center justify-between px-4 py-3.5 text-[14px] font-medium text-[#4b5563] border-b border-[#ebebeb] text-left";

function NavIconArrowRight() {
  return (
    <svg className="w-4 h-4 text-gray-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * @param {{ variant?: "desktop" | "mobile", onNavigate?: () => void }} props
 */
export default function NavAuthControl({ variant = "desktop", onNavigate }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { ready, isLoggedIn } = useAuthSession();

  function handleLogout() {
    dispatch(logout());
    toastSuccess("You have been signed out.");
    onNavigate?.();
    router.replace("/");
  }

  if (!ready) {
    return variant === "mobile" ? null : (
      <span className={`${DESKTOP_CLASS} opacity-0 pointer-events-none`} aria-hidden>
        Login
      </span>
    );
  }

  if (isLoggedIn) {
    if (variant === "mobile") {
      return (
        <button type="button" onClick={handleLogout} className={MOBILE_CLASS}>
          Logout
          <NavIconArrowRight />
        </button>
      );
    }

    return (
      <button type="button" onClick={handleLogout} className={DESKTOP_CLASS}>
        Logout
      </button>
    );
  }

  if (variant === "mobile") {
    return (
      <Link href="/login" onClick={onNavigate} className={MOBILE_CLASS}>
        Login
        <NavIconArrowRight />
      </Link>
    );
  }

  return (
    <Link href="/login" className={`${DESKTOP_CLASS} hover:text-[#3d3b39]`}>
      Login
    </Link>
  );
}
