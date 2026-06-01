"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ue_checkout_session_expires";

/**
 * 10-minute countdown persisted for the browser tab session.
 * @param {number} totalSeconds
 */
export function useCheckoutSessionTimer(totalSeconds) {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    const key = STORAGE_KEY;
    let expiresAt = Number(sessionStorage.getItem(key));

    if (!expiresAt || Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
      expiresAt = Date.now() + totalSeconds * 1000;
      sessionStorage.setItem(key, String(expiresAt));
    }

    const tick = () => {
      const left = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(left);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [totalSeconds]);

  return secondsLeft;
}
