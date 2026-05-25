import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import servicesReducer from "@/store/slices/servicesSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      services: servicesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}
