/** @param {import('@/store').RootState} state */
export const selectAuth = (state) => state.auth;

export const selectLoginStatus = (state) => state.auth.login.status;
export const selectForgotPasswordStatus = (state) => state.auth.forgotPassword.status;
export const selectVerifyOtpStatus = (state) => state.auth.verifyOtp.status;
export const selectResetPasswordStatus = (state) => state.auth.resetPassword.status;

export const selectResetFlow = (state) => state.auth.resetFlow;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
