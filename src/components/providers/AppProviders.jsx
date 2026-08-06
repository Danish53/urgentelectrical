"use client";

import { Toaster } from "sonner";
import AuthSessionHydrator from "@/components/providers/AuthSessionHydrator";
import ServicesHydrator from "@/components/providers/ServicesHydrator";
import WebsiteGeneralDataHydrator from "@/components/providers/WebsiteGeneralDataHydrator";
import { VatPreferenceProvider } from "@/components/providers/VatPreferenceProvider";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import CopyProtection from "@/components/common/CopyProtection";
import CookieSessionHydrator from "@/components/providers/CookieSessionHydrator";
import PageVisitTracker from "@/components/providers/PageVisitTracker";
import ReduxProvider from "@/store/provider";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <VatPreferenceProvider>
        <AuthSessionHydrator />
        <CookieSessionHydrator />
        <ServicesHydrator />
        <WebsiteGeneralDataHydrator />
        <PageVisitTracker />
        <CopyProtection />
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
