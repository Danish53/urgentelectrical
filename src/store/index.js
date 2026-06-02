import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import ordersReducer from "@/store/slices/ordersSlice";
import profileReducer from "@/store/slices/profileSlice";
import servicesReducer from "@/store/slices/servicesSlice";
import sitesReducer from "@/store/slices/sitesSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      orders: ordersReducer,
      services: servicesReducer,
      sites: sitesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}
