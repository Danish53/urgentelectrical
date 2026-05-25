"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTH_INPUT_CLASS, AUTH_LABEL_CLASS } from "@/components/login/authFormStyles";
import { toastError, toastSuccess } from "@/lib/toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectLoginStatus } from "@/store/selectors/authSelectors";
import { clearLoginError, loginUser } from "@/store/slices/authSlice";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectLoginStatus);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const loading = status === "loading";

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError("");
    dispatch(clearLoginError());

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setLocalError("Please enter your email and password.");
      return;
    }

    const result = await dispatch(loginUser({ email: trimmedEmail, password }));

    if (loginUser.fulfilled.match(result)) {
      toastSuccess(result.payload.message || "Signed in successfully.");
      router.replace("/");
      return;
    }

    toastError(result.payload, "Sign in failed. Please check your credentials.");
  }

  return (
    <div className="home1-login-form-card">
      <div className="home1-login-form-head">
        <h1 className="home1-login-form-title">Sign in</h1>
        <p className="home1-login-form-lead">Enter your account details to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="home1-login-form" aria-label="Sign in form" noValidate>
        {localError ? (
          <p className="home1-login-error" role="alert">
            {localError}
          </p>
        ) : null}

        <div>
          <label htmlFor="login-email" className={AUTH_LABEL_CLASS}>
            Email address<span className="text-[#d3231f]">*</span>
          </label>
          <input
            id="login-email"
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

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="login-password" className={`${AUTH_LABEL_CLASS} mb-0`}>
              Password<span className="text-[#d3231f]">*</span>
            </label>
            <Link href="/login/forgot-password" className="home1-login-forgot">
              Forgot password?
            </Link>
          </div>
          <div className="home1-login-password-wrap">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

        <label className="home1-login-remember">
          <input
            type="checkbox"
            name="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="home1-login-checkbox"
            disabled={loading}
          />
          <span>Keep me signed in on this device</span>
        </label>

        <button type="submit" className="home1-login-submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="home1-login-register">
        <Link href="/contact-us" className="home1-login-register-link">
          Need help?
        </Link>
        {" · "}
        <Link href="/" className="home1-login-register-link">
          Back to website
        </Link>
      </p>
    </div>
  );
}
