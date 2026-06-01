"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/useAuthSession";

/**
 * Redirects guests to login. Use on account-only pages.
 */
export default function AuthMemberGuard({ children }) {
  const router = useRouter();
  const { ready, isLoggedIn } = useAuthSession();

  useEffect(() => {
    if (ready && !isLoggedIn) {
      router.replace("/login");
    }
  }, [ready, isLoggedIn, router]);

  if (!ready || !isLoggedIn) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-[#6b7280] text-sm font-medium">
        Loading…
      </div>
    );
  }

  return children;
}
