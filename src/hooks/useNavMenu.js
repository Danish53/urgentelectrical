"use client";

import { useEffect, useState } from "react";
import { NAV_GROUPS } from "@/components/navData";
import { fetchNavMenu, getCachedNavMenu } from "@/services/menuApiService";

export function useNavMenu() {
  const [navGroups, setNavGroups] = useState(() => getCachedNavMenu() ?? NAV_GROUPS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getCachedNavMenu()) return;

    let cancelled = false;

    async function load() {
      try {
        const groups = await fetchNavMenu();
        if (!cancelled && groups.length) setNavGroups(groups);
      } catch {
        if (!cancelled) setNavGroups(NAV_GROUPS);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { navGroups, loading };
}
