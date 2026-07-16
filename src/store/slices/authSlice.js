import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AUTH_STORAGE_EMAIL,
  AUTH_STORAGE_LOGIN_PASSWORD,
  AUTH_STORAGE_OTP,
  AUTH_STORAGE_OTP_OK,
  AUTH_STORAGE_PURPOSE,
} from "@/components/login/authFormStyles";
import { getApiErrorMessage } from "@/lib/api/errors";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/auth/tokenStorage";
import { clearStoredAuthUser, getStoredAuthUser, setStoredAuthUser } from "@/lib/auth/userStorage";
import * as authService from "@/services/authService";

const idleOp = () => ({ status: "idle", error: null });

function readResetFlow() {
  if (typeof window === "undefined") {
    return { email: null, otp: null, otpVerified: false, purpose: null };
  }
  const purpose = sessionStorage.getItem(AUTH_STORAGE_PURPOSE);
  return {
    email: sessionStorage.getItem(AUTH_STORAGE_EMAIL) || null,
    otp: sessionStorage.getItem(AUTH_STORAGE_OTP) || null,
    otpVerified: sessionStorage.getItem(AUTH_STORAGE_OTP_OK) === "1",
    purpose: purpose === "login" || purpose === "reset" ? purpose : null,
  };
}

function persistResetEmail(email) {
  if (typeof window === "undefined") return;
  if (email) sessionStorage.setItem(AUTH_STORAGE_EMAIL, email);
  else sessionStorage.removeItem(AUTH_STORAGE_EMAIL);
}

function persistResetOtp(otp) {
  if (typeof window === "undefined") return;
  if (otp) sessionStorage.setItem(AUTH_STORAGE_OTP, otp);
  else sessionStorage.removeItem(AUTH_STORAGE_OTP);
}

function persistOtpVerified(verified) {
  if (typeof window === "undefined") return;
  if (verified) sessionStorage.setItem(AUTH_STORAGE_OTP_OK, "1");
  else sessionStorage.removeItem(AUTH_STORAGE_OTP_OK);
}

function persistOtpPurpose(purpose) {
  if (typeof window === "undefined") return;
  if (purpose === "login" || purpose === "reset") {
    sessionStorage.setItem(AUTH_STORAGE_PURPOSE, purpose);
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_PURPOSE);
  }
}

function persistLoginPassword(password) {
  if (typeof window === "undefined") return;
  if (password) sessionStorage.setItem(AUTH_STORAGE_LOGIN_PASSWORD, password);
  else sessionStorage.removeItem(AUTH_STORAGE_LOGIN_PASSWORD);
}

export function getPendingLoginPassword() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(AUTH_STORAGE_LOGIN_PASSWORD) || null;
}

function clearResetFlowStorage() {
  persistResetEmail(null);
  persistResetOtp(null);
  persistOtpVerified(false);
  persistOtpPurpose(null);
  persistLoginPassword(null);
}

function applySession(state, { token, user }) {
  if (token) {
    state.token = token;
    state.isAuthenticated = true;
    setAuthToken(token);
  }
  if (user) {
    state.user = user;
    setStoredAuthUser(user);
  }
  if (token || user) {
    state.isAuthenticated = Boolean(token || state.token);
  }
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login({ email, password });
      return {
        email,
        password,
        message: authService.parseApiMessage(data),
      };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Sign in failed. Please check your credentials.")
      );
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword({ email });
      return { email, message: authService.parseApiMessage(data) };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Could not send verification code. Please try again.")
      );
    }
  }
);

export const verifyResetOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOtp({ email, otp });
      return { email, otp, message: authService.parseApiMessage(data) };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Invalid or expired code. Please try again.")
      );
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyLoginOtp({ email, otp });
      const parsed = authService.parseAuthResponse(data);
      return {
        ...parsed,
        email,
        message: authService.parseApiMessage(data),
      };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Invalid or expired code. Please try again.")
      );
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ email, otp, password, password_confirmation }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword({
        email,
        otp,
        password,
        password_confirmation,
      });
      return { message: authService.parseApiMessage(data) };
    } catch (error) {
      return rejectWithValue(
        getApiErrorMessage(error, "Could not reset password. Please try again.")
      );
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: idleOp(),
  forgotPassword: idleOp(),
  verifyOtp: idleOp(),
  resetPassword: idleOp(),
  resetFlow: readResetFlow(),
};

function bindAsyncOp(builder, thunk, key, onFulfilled) {
  builder
    .addCase(thunk.pending, (state) => {
      state[key].status = "loading";
      state[key].error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state[key].status = "succeeded";
      state[key].error = null;
      onFulfilled?.(state, action);
    })
    .addCase(thunk.rejected, (state, action) => {
      state[key].status = "failed";
      state[key].error = action.payload;
    });
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearLoginError(state) {
      state.login.error = null;
    },
    clearForgotPasswordError(state) {
      state.forgotPassword.error = null;
    },
    clearVerifyOtpError(state) {
      state.verifyOtp.error = null;
    },
    clearResetPasswordError(state) {
      state.resetPassword.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.login = idleOp();
      clearAuthToken();
      clearStoredAuthUser();
    },
    hydrateAuthSession(state) {
      const token = getAuthToken();
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        const storedUser = getStoredAuthUser();
        if (storedUser) state.user = storedUser;
      }
    },
    hydrateResetFlow(state) {
      state.resetFlow = readResetFlow();
    },
    /** Merge profile API fields into session user (after GET/POST profile). */
    setAuthUser(state, action) {
      const next = action.payload;
      if (!next || typeof next !== "object") return;
      state.user = { ...(state.user ?? {}), ...next };
      setStoredAuthUser(state.user);
    },
    /** Apply token + user from login/order API without running login thunk. */
    applyAuthSession(state, action) {
      const payload = action.payload;
      if (!payload || typeof payload !== "object") return;
      applySession(state, payload);
    },
    clearResetFlow(state) {
      state.resetFlow = { email: null, otp: null, otpVerified: false, purpose: null };
      clearResetFlowStorage();
    },
  },
  extraReducers: (builder) => {
    // Login only starts OTP flow — session is applied after verify-login-otp
    bindAsyncOp(builder, loginUser, "login", (state, action) => {
      const email = action.payload.email;
      state.resetFlow.email = email;
      state.resetFlow.otp = null;
      state.resetFlow.otpVerified = false;
      state.resetFlow.purpose = "login";
      persistResetEmail(email);
      persistResetOtp(null);
      persistOtpVerified(false);
      persistOtpPurpose("login");
      persistLoginPassword(action.payload.password);
    });

    bindAsyncOp(builder, requestPasswordReset, "forgotPassword", (state, action) => {
      state.resetFlow.email = action.payload.email;
      state.resetFlow.otp = null;
      state.resetFlow.otpVerified = false;
      state.resetFlow.purpose = "reset";
      persistResetEmail(action.payload.email);
      persistResetOtp(null);
      persistOtpVerified(false);
      persistOtpPurpose("reset");
      persistLoginPassword(null);
    });

    bindAsyncOp(builder, verifyResetOtp, "verifyOtp", (state, action) => {
      state.resetFlow.email = action.payload.email;
      state.resetFlow.otp = action.payload.otp;
      state.resetFlow.otpVerified = true;
      state.resetFlow.purpose = "reset";
      persistResetEmail(action.payload.email);
      persistResetOtp(action.payload.otp);
      persistOtpVerified(true);
      persistOtpPurpose("reset");
    });

    bindAsyncOp(builder, verifyLoginOtp, "verifyOtp", (state, action) => {
      applySession(state, action.payload);
      state.resetFlow = { email: null, otp: null, otpVerified: false, purpose: null };
      clearResetFlowStorage();
    });

    bindAsyncOp(builder, resetUserPassword, "resetPassword", (state) => {
      state.resetFlow = { email: null, otp: null, otpVerified: false, purpose: null };
      clearResetFlowStorage();
    });
  },
});

export const {
  clearLoginError,
  clearForgotPasswordError,
  clearVerifyOtpError,
  clearResetPasswordError,
  logout,
  hydrateAuthSession,
  hydrateResetFlow,
  setAuthUser,
  applyAuthSession,
  clearResetFlow,
} = authSlice.actions;

/** @deprecated use clearLoginError / clearForgotPasswordError etc. */
export const clearAuthError = clearLoginError;

export default authSlice.reducer;
