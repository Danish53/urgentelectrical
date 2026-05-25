"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuthSession } from "@/store/slices/authSlice";

/** Restores auth token into Redux on app load */
export default function AuthSessionHydrator() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAuthSession());
  }, [dispatch]);

  return null;
}
