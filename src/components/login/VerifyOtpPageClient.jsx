"use client";

import { useEffect } from "react";
import AuthLayout from "@/components/login/AuthLayout";
import VerifyOtpForm from "@/components/login/VerifyOtpForm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectResetFlow } from "@/store/selectors/authSelectors";
import { hydrateResetFlow } from "@/store/slices/authSlice";

/**
 * Password-reset OTP shows Email → Verify → Reset steps.
 * Login OTP hides those tabs.
 */
export default function VerifyOtpPageClient() {
  const dispatch = useAppDispatch();
  const resetFlow = useAppSelector(selectResetFlow);

  useEffect(() => {
    dispatch(hydrateResetFlow());
  }, [dispatch]);

  const showSteps = resetFlow.purpose === "reset";

  return (
    <AuthLayout authStep={2} showSteps={showSteps}>
      <VerifyOtpForm />
    </AuthLayout>
  );
}
