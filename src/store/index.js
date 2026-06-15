import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import ordersReducer from "@/store/slices/ordersSlice";
import profileReducer from "@/store/slices/profileSlice";
import servicesReducer from "@/store/slices/servicesSlice";
import sitesReducer from "@/store/slices/sitesSlice";
import checkoutReducer from "@/store/slices/Checkoutslice";
import locationsReducer from "@/store/slices/locationsSlice";
import websiteGeneralDataReducer from "@/store/slices/websiteGeneralDataSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      profile: profileReducer,
      orders: ordersReducer,
      services: servicesReducer,
      sites: sitesReducer,
      checkout: checkoutReducer,
      locations: locationsReducer,
      websiteGeneralData: websiteGeneralDataReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}
