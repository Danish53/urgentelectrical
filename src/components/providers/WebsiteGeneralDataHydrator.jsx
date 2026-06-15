"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectWebsiteGeneralDataStatus } from "@/store/selectors/websiteGeneralDataSelectors";
import { loadWebsiteGeneralData } from "@/store/slices/websiteGeneralDataSlice";

/** Loads website general data from API into Redux once per session */
export default function WebsiteGeneralDataHydrator() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectWebsiteGeneralDataStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadWebsiteGeneralData());
    }
  }, [dispatch, status]);

  return null;
}
