"use client";

import { useEffect, useState } from "react";
import { getFallbackNavGroups } from "@/lib/menu/mapNavMenu";
import { fetchNavMenu } from "@/services/menuApiService";

export function useNavMenu() {
  const fallback = getFallbackNavGroups();
  const [navGroups, setNavGroups] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const groups = await fetchNavMenu();
        if (!cancelled) setNavGroups(groups);
      } catch {
        if (!cancelled) setNavGroups(fallback);
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
