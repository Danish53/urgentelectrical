"use client";

import { useEffect } from "react";
import { fetchCookieSession } from "@/services/cookieApiService";

/** Initializes Laravel cookie/session on app load */
export default function CookieSessionHydrator() {
  useEffect(() => {
    fetchCookieSession().catch(() => {
      // Non-blocking — checkout/auth proxies still work without this.
    });
  }, []);

  return null;
}
