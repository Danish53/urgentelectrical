"use client";

import { useAppSelector } from "@/store/hooks";
import {
  selectWebsiteGeneralData,
  selectWebsiteGeneralDataStatus,
} from "@/store/selectors/websiteGeneralDataSelectors";

export function useWebsiteGeneralData() {
  const site = useAppSelector(selectWebsiteGeneralData);
  const status = useAppSelector(selectWebsiteGeneralDataStatus);

  return {
    site,
    loading: status === "loading" || status === "idle",
    ready: status === "succeeded" || status === "failed",
  };
}
