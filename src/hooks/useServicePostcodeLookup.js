"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { checkServiceByPostalCode } from "@/services/serviceByPostalCodeApiService";

/**
 * Hero / locations postcode lookup — shows success or error modal after API check.
 * @param {"home" | "locations"} source
 */
export function useServicePostcodeLookup(source) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVariant, setModalVariant] = useState(
    /** @type {"success" | "outOfArea" | "error"} */ ("error"),
  );
  const [modalMessage, setModalMessage] = useState("");
  const [matchedServiceSlug, setMatchedServiceSlug] = useState("");

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setMatchedServiceSlug("");
  }, []);

  const bookService = useCallback(() => {
    if (!matchedServiceSlug) return;
    const slug = matchedServiceSlug;
    closeModal();
    router.push(`/services/${slug}`);
  }, [closeModal, matchedServiceSlug, router]);

  const lookup = useCallback(
    async ({ serviceSlug, postCode }) => {
      if (!serviceSlug || !String(postCode ?? "").trim()) return;

      setSubmitting(true);
      setModalOpen(false);
      try {
        const result = await checkServiceByPostalCode({ source, serviceSlug, postCode });
        if (result.outcome === "in_area") {
          setMatchedServiceSlug(serviceSlug);
          setModalVariant("success");
          setModalMessage("");
          setModalOpen(true);
          return;
        }
        if (result.outcome === "out_of_area") {
          setMatchedServiceSlug("");
          setModalVariant("outOfArea");
          setModalMessage("Our services are unavailable in this area");
          setModalOpen(true);
          return;
        }
        setMatchedServiceSlug("");
        setModalVariant("error");
        setModalMessage(result.message);
        setModalOpen(true);
      } catch {
        setMatchedServiceSlug("");
        setModalVariant("error");
        setModalMessage("Unable to check postcode coverage. Please try again.");
        setModalOpen(true);
      } finally {
        setSubmitting(false);
      }
    },
    [source],
  );

  return {
    lookup,
    submitting,
    modalOpen,
    modalVariant,
    modalMessage,
    matchedServiceSlug,
    closeModal,
    bookService,
  };
}
