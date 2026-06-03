"use client";

import { useRef, useCallback } from "react";

const SWIPE_THRESHOLD = 50;

export function useCarouselSwipe({ onPrev, onNext, enabled = true }) {
  const touchStartX = useRef(null);

  const onTouchStart = useCallback(
    (e) => {
      if (!enabled) return;
      touchStartX.current = e.touches[0].clientX;
    },
    [enabled],
  );

  const onTouchEnd = useCallback(
    (e) => {
      if (!enabled || touchStartX.current === null) return;
      const diff = touchStartX.current - e.changedTouches[0].clientX;
      touchStartX.current = null;
      if (Math.abs(diff) < SWIPE_THRESHOLD) return;
      if (diff > 0) onNext();
      else onPrev();
    },
    [enabled, onNext, onPrev],
  );

  return { onTouchStart, onTouchEnd };
}
