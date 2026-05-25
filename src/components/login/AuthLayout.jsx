"use client";

import Link from "next/link";
import Image from "next/image";
import useIsLoginDesktop from "@/components/login/useIsLoginDesktop";
import LoginVisualPanel from "@/components/login/LoginVisualPanel";
import AuthGuestGuard from "@/components/login/AuthGuestGuard";
import AuthStepProgress from "@/components/login/AuthStepProgress";

export default function AuthLayout({ children, authStep = null, showSteps = false }) {
  const showVisual = useIsLoginDesktop();

  return (
    <div className="home1-page home1-login-page w-full min-w-0">
      <main id="main-content" className="home1-login-main w-full min-w-0">
        <div className="home1-login-split">
          <section className="home1-login-form-side" aria-label="Account access">
            <div className="home1-login-form-inner">
              <Link href="/" className="home1-login-form-logo">
                <Image
                  src="/logo.jpg"
                  alt="Urgent Electrical Services"
                  width={44}
                  height={44}
                  className="h-10 w-10 shrink-0 rounded-lg object-contain"
                />
                <span className="home1-login-form-logo-text">
                  <span className="home1-login-form-logo-name">Urgent Electrical</span>
                  <span className="home1-login-form-logo-tag">Customer portal</span>
                </span>
              </Link>

              {showSteps && authStep ? <AuthStepProgress currentStep={authStep} /> : null}

              <AuthGuestGuard>{children}</AuthGuestGuard>
            </div>
          </section>

          {showVisual ? <LoginVisualPanel /> : null}
        </div>
      </main>
    </div>
  );
}
