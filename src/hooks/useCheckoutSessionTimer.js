"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ue_checkout_session_expires";
const ON_PAGE_KEY = "ue_checkout_on_page";

export function clearCheckoutSession() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(ON_PAGE_KEY);
  }
}

/**
 * Countdown persisted for the browser tab. Resets when the user returns to
 * checkout from another page; continues across refresh and in-checkout steps.
 * @param {number} totalSeconds
 */
export function useCheckoutSessionTimer(totalSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wasOnCheckout = sessionStorage.getItem(ON_PAGE_KEY) === "1";
    let expiresAt = Number(sessionStorage.getItem(STORAGE_KEY));

    const needsNewSession =
      !wasOnCheckout || !expiresAt || Number.isNaN(expiresAt) || expiresAt <= Date.now();

    if (needsNewSession) {
      expiresAt = Date.now() + totalSeconds * 1000;
      sessionStorage.setItem(STORAGE_KEY, String(expiresAt));
    }

    sessionStorage.setItem(ON_PAGE_KEY, "1");

    const tick = () => {
      const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
      setReady(true);
    };

    // Defer first tick so setState is not synchronous inside the effect body.
    const startId = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(startId);
      window.clearInterval(id);
      sessionStorage.setItem(ON_PAGE_KEY, "0");
    };
  }, [totalSeconds]);

  return {
    secondsLeft,
    expired: ready && secondsLeft <= 0,
  };
}
