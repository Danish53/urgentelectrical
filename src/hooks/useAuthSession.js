"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth/tokenStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { hydrateAuthSession } from "@/store/slices/authSlice";

export function useAuthSession() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(hydrateAuthSession());
    setReady(true);
  }, [dispatch]);

  const isLoggedIn = ready && (isAuthenticated || Boolean(getAuthToken()));

  return { ready, isLoggedIn };
}
