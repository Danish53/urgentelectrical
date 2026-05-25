"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectForgotPasswordStatus } from "@/store/selectors/authSelectors";
import { clearForgotPasswordError, requestPasswordReset } from "@/store/slices/authSlice";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectForgotPasswordStatus);

  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const loading = status === "loading";

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    dispatch(clearForgotPasswordError());

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    const result = await dispatch(requestPasswordReset({ email: trimmed }));

    if (requestPasswordReset.fulfilled.match(result)) {
      toastSuccess(
        result.payload.message || "Verification code sent. Check your email."
      );
      router.push("/login/verify-otp");
      return;
    }

    toastError(result.payload, "Could not send verification code. Please try again.");
  }

  return (
    <div className="home1-login-form-card">
      <div className="home1-login-form-head">
        <h1 className="home1-login-form-title">Forgot password</h1>
        <p className="home1-login-form-lead">
          Enter your email and we&apos;ll send a 6-digit verification code to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="home1-login-form" noValidate>
        {localError ? (
          <p className="home1-login-error" role="alert">
            {localError}
          </p>
        ) : null}

        <div>
          <label htmlFor="forgot-email" className={AUTH_LABEL_CLASS}>
            Email address<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={AUTH_INPUT_CLASS}
            disabled={loading}
          />
        </div>

        <button type="submit" className="home1-login-submit" disabled={loading}>
          {loading ? "Sending code…" : "Send verification code"}
        </button>
      </form>

      <p className="home1-login-register">
        <Link href="/login" className="home1-login-register-link">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
