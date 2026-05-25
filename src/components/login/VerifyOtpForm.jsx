"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResetFlowGuard } from "@/hooks/useResetFlowGuard";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectForgotPasswordStatus, selectVerifyOtpStatus } from "@/store/selectors/authSelectors";
import {
  clearForgotPasswordError,
  clearVerifyOtpError,
  requestPasswordReset,
  verifyResetOtp,
} from "@/store/slices/authSlice";

const OTP_LENGTH = 6;

export default function VerifyOtpForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const verifyStatus = useAppSelector(selectVerifyOtpStatus);
  const resendStatus = useAppSelector(selectForgotPasswordStatus);
  const { ready, resetFlow } = useResetFlowGuard({ requireEmail: true });

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [localError, setLocalError] = useState("");
  const inputRefs = useRef([]);

  const email = resetFlow.email;
  const verifying = verifyStatus === "loading";
  const resending = resendStatus === "loading";
  const loading = verifying || resending;

  useEffect(() => {
    if (!ready || !email) return;
    inputRefs.current[0]?.focus();
  }, [ready, email]);

  function updateDigit(index, value) {
    const num = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = num;
    setDigits(next);
    setLocalError("");

    if (num && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    dispatch(clearVerifyOtpError());

    const code = digits.join("");
    if (code.length !== OTP_LENGTH) {
      setLocalError("Please enter the full 6-digit code.");
      return;
    }

    if (!email) {
      router.replace("/login/forgot-password");
      return;
    }

    const result = await dispatch(verifyResetOtp({ email, otp: code }));

    if (verifyResetOtp.fulfilled.match(result)) {
      toastSuccess(result.payload.message || "Code verified successfully.");
      router.push("/login/reset-password");
      return;
    }

    toastError(result.payload, "Invalid or expired code. Please try again.");
  }

  async function handleResend() {
    if (!email) return;

    setDigits(Array(OTP_LENGTH).fill(""));
    setLocalError("");
    dispatch(clearForgotPasswordError());

    const result = await dispatch(requestPasswordReset({ email }));

    if (requestPasswordReset.fulfilled.match(result)) {
      toastSuccess(result.payload.message || "A new code has been sent to your email.");
      inputRefs.current[0]?.focus();
      return;
    }

    toastError(result.payload, "Could not resend code. Please try again.");
  }

  if (!ready) {
    return (
      <div className="home1-login-form-card" aria-busy="true">
        <p className="home1-login-form-lead text-center">Loading…</p>
      </div>
    );
  }

  return (
    <div className="home1-login-form-card">
      <div className="home1-login-form-head">
        <h1 className="home1-login-form-title">Verify code</h1>
        <p className="home1-login-form-lead">
          Enter the 6-digit code we sent to{" "}
          {email ? <strong className="text-[#111827]">{email}</strong> : "your email"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="home1-login-form" noValidate>
        {localError ? (
          <p className="home1-login-error" role="alert">
            {localError}
          </p>
        ) : null}

        <div className="home1-auth-otp" role="group" aria-label="6 digit verification code">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${index + 1}`}
              value={digit}
              onChange={(e) => updateDigit(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="home1-auth-otp-input"
              disabled={loading}
            />
          ))}
        </div>

        <button type="submit" className="home1-login-submit" disabled={verifying || resending}>
          {verifying ? "Verifying…" : "Verify code"}
        </button>
      </form>

      <p className="home1-auth-resend">
        Didn&apos;t receive it?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="home1-login-link-btn"
          disabled={loading}
        >
          {resending ? "Sending…" : "Resend code"}
        </button>
      </p>

      <p className="home1-login-register">
        <Link href="/login/forgot-password" className="home1-login-register-link">
          Change email
        </Link>
        {" · "}
        <Link href="/login" className="home1-login-register-link">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
