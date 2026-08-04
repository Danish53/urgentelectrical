"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectResetFlow } from "@/store/selectors/authSelectors";
import { hydrateResetFlow } from "@/store/slices/authSlice";

const emptySubscribe = () => () => {};
const getClientReady = () => true;
const getServerReady = () => false;

/**
 * Ensures OTP / password-reset flow state is hydrated before route guards run.
 * @param {{ requireEmail?: boolean, requireOtp?: boolean }} options
 */
export function useResetFlowGuard({ requireEmail = false, requireOtp = false } = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resetFlow = useAppSelector(selectResetFlow);
  const ready = useSyncExternalStore(emptySubscribe, getClientReady, getServerReady);

  useEffect(() => {
    dispatch(hydrateResetFlow());
  }, [dispatch]);

  useEffect(() => {
    if (!ready) return;

    if (requireEmail && !resetFlow.email) {
      const fallback =
        resetFlow.purpose === "login" ? "/login" : "/login/forgot-password";
      router.replace(fallback);
      return;
    }

    if (requireOtp && (!resetFlow.otpVerified || !resetFlow.otp)) {
      router.replace("/login/verify-otp");
    }
  }, [ready, resetFlow, requireEmail, requireOtp, router]);

  return { ready, resetFlow };
}
