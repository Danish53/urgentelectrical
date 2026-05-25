"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconCheck } from "@/components/home1/icons";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { useResetFlowGuard } from "@/hooks/useResetFlowGuard";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectResetPasswordStatus } from "@/store/selectors/authSelectors";
import { clearResetPasswordError, resetUserPassword } from "@/store/slices/authSlice";

export default function ResetPasswordForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectResetPasswordStatus);
  const { ready, resetFlow } = useResetFlowGuard({ requireEmail: true, requireOtp: true });

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [done, setDone] = useState(false);

  const loading = status === "loading";
  const { email, otp } = resetFlow;

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    dispatch(clearResetPasswordError());

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (!email || !otp) {
      router.replace("/login/forgot-password");
      return;
    }

    const result = await dispatch(
      resetUserPassword({
        email,
        otp,
        password,
        password_confirmation: confirm,
      })
    );

    if (resetUserPassword.fulfilled.match(result)) {
      toastSuccess(result.payload.message || "Password updated successfully.");
      setDone(true);
      return;
    }

    toastError(result.payload, "Could not reset password. Please try again.");
  }

  if (!ready) {
    return (
      <div className="home1-login-form-card" aria-busy="true">
        <p className="home1-login-form-lead text-center">Loading…</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="home1-login-form-card home1-login-form-card--success">
        <span className="home1-login-success-icon" aria-hidden="true">
          <IconCheck className="w-8 h-8 text-[#4ADE80]" />
        </span>
        <h2 className="home1-login-form-title">Password updated</h2>
        <p className="home1-login-form-lead">
          Your password has been reset. You can now sign in with your new password.
        </p>
        <Link href="/login" className="home1-login-submit mt-4">
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="home1-login-form-card">
      <div className="home1-login-form-head">
        <h1 className="home1-login-form-title">Reset password</h1>
        <p className="home1-login-form-lead">Choose a strong new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="home1-login-form" noValidate>
        {localError ? (
          <p className="home1-login-error" role="alert">
            {localError}
          </p>
        ) : null}

        <div>
          <label htmlFor="reset-password" className={AUTH_LABEL_CLASS}>
            New password<span className="text-[#d3231f]">*</span>
          </label>
          <div className="home1-login-password-wrap">
            <input
              id="reset-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className={AUTH_INPUT_CLASS}
              disabled={loading}
            />
            <button
              type="button"
              className="home1-login-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="reset-confirm" className={AUTH_LABEL_CLASS}>
            Confirm password<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="reset-confirm"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            className={AUTH_INPUT_CLASS}
            disabled={loading}
          />
        </div>

        <button type="submit" className="home1-login-submit" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
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
