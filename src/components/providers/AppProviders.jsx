"use client";

import { Toaster } from "sonner";
import AuthSessionHydrator from "@/components/providers/AuthSessionHydrator";
import ServicesHydrator from "@/components/providers/ServicesHydrator";
import ReduxProvider from "@/store/provider";

export default function AppProviders({ children }) {
  return (
    <ReduxProvider>
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
    </ReduxProvider>
  );
}
