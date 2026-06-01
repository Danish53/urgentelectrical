"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "ue-show-inc-vat";

const VatPreferenceContext = createContext({
  incVat: true,
  setIncVat: () => {},
  toggleVat: () => {},
});

function readStoredPreference() {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "0") return false;
    if (stored === "1") return true;
  } catch {
    /* ignore */
  }
  return true;
}

export function VatPreferenceProvider({ children }) {
  const [incVat, setIncVatState] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIncVatState(readStoredPreference());
    setReady(true);
  }, []);

  const setIncVat = useCallback((value) => {
    const next = Boolean(value);
    setIncVatState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleVat = useCallback(() => {
    setIncVatState((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      incVat,
      setIncVat,
      toggleVat,
      ready,
    }),
    [incVat, setIncVat, toggleVat, ready]
  );

  return <VatPreferenceContext.Provider value={value}>{children}</VatPreferenceContext.Provider>;
}

export function useVatPreference() {
  return useContext(VatPreferenceContext);
}
