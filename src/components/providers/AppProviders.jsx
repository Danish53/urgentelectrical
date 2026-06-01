"use client";

import { Toaster } from "sonner";
import AuthSessionHydrator from "@/components/providers/AuthSessionHydrator";
import ServicesHydrator from "@/components/providers/ServicesHydrator";
import { VatPreferenceProvider } from "@/components/providers/VatPreferenceProvider";
import ReduxProvider from "@/store/provider";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
      <VatPreferenceProvider>
        <AuthSessionHydrator />
        <ServicesHydrator />
        {children}
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
