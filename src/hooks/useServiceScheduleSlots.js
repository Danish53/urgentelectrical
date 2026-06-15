"use client";

import { useEffect, useState } from "react";
import { normalizeScheduleApiSlots, isNoSlotsScheduleError } from "@/lib/schedules";
import { fetchServiceSchedule } from "@/services/serviceScheduleApiService";

/**
 * Fetch time slots when service + date are selected (checkout calendar).
 * @param {number | string | null | undefined} serviceId
 * @param {Date | null | undefined} selectedDate
 */
export function useServiceScheduleSlots(serviceId, selectedDate) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!serviceId || !selectedDate) {
      setSlots([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchServiceSchedule(serviceId, selectedDate)
      .then((payload) => {
        if (cancelled) return;
        setSlots(normalizeScheduleApiSlots(payload));
      })
      .catch((err) => {
        if (cancelled) return;
        setSlots([]);
        setError(
          isNoSlotsScheduleError(err) ? null : err?.message ?? "Could not load time slots."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [serviceId, selectedDate?.getFullYear(), selectedDate?.getMonth(), selectedDate?.getDate()]);

  return { slots, loading, error };
}
