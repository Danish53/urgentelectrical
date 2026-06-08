"use client";

import { Toaster } from "sonner";
import AuthSessionHydrator from "@/components/providers/AuthSessionHydrator";
import ServicesHydrator from "@/components/providers/ServicesHydrator";
import { VatPreferenceProvider } from "@/components/providers/VatPreferenceProvider";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import ReduxProvider from "@/store/provider";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <VatPreferenceProvider>
        <AuthSessionHydrator />
        <ServicesHydrator />
        {children}
        <CookieConsentBanner />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast: "font-sans text-sm",
            title: "font-semibold",
          },
        }}
      />
      </VatPreferenceProvider>
    </ReduxProvider>
  );
}
