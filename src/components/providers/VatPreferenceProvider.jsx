"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "ue-show-inc-vat";
const VAT_CHANGE_EVENT = "ue-vat-preference-change";

const VatPreferenceContext = createContext({
  incVat: true,
  setIncVat: () => {},
  toggleVat: () => {},
});

const emptySubscribe = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

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

function subscribeVatPreference(onStoreChange) {
  if (typeof window === "undefined") return () => {};
  const handle = () => onStoreChange();
  window.addEventListener("storage", handle);
  window.addEventListener(VAT_CHANGE_EVENT, handle);
  return () => {
    window.removeEventListener("storage", handle);
    window.removeEventListener(VAT_CHANGE_EVENT, handle);
  };
}

function writeStoredPreference(next) {
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(VAT_CHANGE_EVENT));
}

export function VatPreferenceProvider({ children }) {
  const ready = useSyncExternalStore(emptySubscribe, getClientReady, getServerReady);
  const incVat = useSyncExternalStore(subscribeVatPreference, readStoredPreference, () => true);

  const setIncVat = useCallback((value) => {
    writeStoredPreference(Boolean(value));
  }, []);

  const toggleVat = useCallback(() => {
    writeStoredPreference(!readStoredPreference());
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
