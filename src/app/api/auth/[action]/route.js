import { NextResponse } from "next/server";
import { AUTH_API } from "@/constants/authApi";
import { upstreamJsonPost } from "@/lib/api/upstreamProxy";

/** @type {Record<string, { upstream: string, pick: (body: Record<string, unknown>) => Record<string, string> | null }>} */
const ACTIONS = {
  login: {
    upstream: AUTH_API.login,
    pick: (body) => {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (!email || !password) return null;
      return { email, password };
    },
  },
  "forgot-password": {
    upstream: AUTH_API.forgotPassword,
    pick: (body) => {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      if (!email) return null;
      return { email };
    },
  },
  "verify-otp": {
    upstream: AUTH_API.verifyOtp,
    pick: (body) => {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      if (!email || !otp) return null;
      return { email, otp };
    },
  },
  "verify-login-otp": {
    upstream: AUTH_API.verifyLoginOtp,
    pick: (body) => {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      if (!email || !otp) return null;
      return { email, otp };
    },
  },
  "reset-password": {
    upstream: AUTH_API.resetPassword,
    pick: (body) => {
      const email = typeof body.email === "string" ? body.email.trim() : "";
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      const password_confirmation =
        typeof body.password_confirmation === "string" ? body.password_confirmation : "";
      if (!email || !otp || !password || !password_confirmation) return null;
      return { email, otp, password, password_confirmation };
    },
  },
};

export async function POST(request, { params }) {
  const { action } = await params;
  const config = ACTIONS[action];

  if (!config) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const payload = config.pick(body);
  if (!payload) {
    return NextResponse.json({ message: "Required fields are missing." }, { status: 422 });
  }

  const result = await upstreamJsonPost(config.upstream, payload);
  return NextResponse.json(result.data, { status: result.status });
}
