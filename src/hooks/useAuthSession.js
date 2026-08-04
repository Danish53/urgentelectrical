"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getAuthToken } from "@/lib/auth/tokenStorage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/selectors/authSelectors";
import { hydrateAuthSession } from "@/store/slices/authSlice";

const emptySubscribe = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

export function useAuthSession() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const ready = useSyncExternalStore(emptySubscribe, getClientReady, getServerReady);

  useEffect(() => {
    dispatch(hydrateAuthSession());
  }, [dispatch]);

  const isLoggedIn = ready && (isAuthenticated || Boolean(getAuthToken()));

  return { ready, isLoggedIn };
}
