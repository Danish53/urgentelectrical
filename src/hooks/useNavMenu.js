"use client";

import { useEffect, useState } from "react";
import { fetchNavMenu, getCachedNavMenu } from "@/services/menuApiService";

export function useNavMenu() {
  const [navGroups, setNavGroups] = useState(() => getCachedNavMenu() ?? []);
  const [loading, setLoading] = useState(() => !getCachedNavMenu());

  useEffect(() => {
    if (getCachedNavMenu()) return;

    let cancelled = false;

    async function load() {
      try {
        const groups = await fetchNavMenu();
        if (!cancelled) setNavGroups(groups);
      } catch {
        if (!cancelled) setNavGroups([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { navGroups, loading };
}
