"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";

/**
 * Blocks auth pages (login, forgot password, etc.) when user is already signed in.
 */
export default function AuthGuestGuard({ children }) {
  const router = useRouter();
  const { ready, isLoggedIn } = useAuthSession();

  useEffect(() => {
    if (ready && isLoggedIn) {
      router.replace("/");
    }
  }, [ready, isLoggedIn, router]);

  if (!ready) {
    return (
      <div className="home1-login-form-card" aria-busy="true" aria-live="polite">
        <p className="home1-login-form-lead text-center">Loading…</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return children;
}
