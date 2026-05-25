"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectServicesStatus } from "@/store/selectors/servicesSelectors";
import { fetchServices } from "@/store/slices/servicesSlice";

/** Loads services from API into Redux once per session */
export default function ServicesHydrator() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectServicesStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
    }
  }, [dispatch, status]);

  return null;
}
