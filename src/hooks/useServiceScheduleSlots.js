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

  const dateKey = selectedDate
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : "";
  const requestKey = serviceId && dateKey ? `${serviceId}:${dateKey}` : "";
  const [trackedRequestKey, setTrackedRequestKey] = useState(requestKey);

  if (requestKey !== trackedRequestKey) {
    setTrackedRequestKey(requestKey);
    if (!requestKey) {
      setSlots([]);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
      setError(null);
    }
  }

  useEffect(() => {
    if (!serviceId || !selectedDate || !dateKey) return;

    let cancelled = false;

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
  }, [serviceId, dateKey, selectedDate]);

  return { slots, loading, error };
}
