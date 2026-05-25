"use client";

import AuthLayout from "@/components/login/AuthLayout";
import LoginForm from "@/components/login/LoginForm";

export default function LoginPageClient() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
