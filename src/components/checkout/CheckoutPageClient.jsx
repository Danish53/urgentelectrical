"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { CHECKOUT_PAGE_CONTAINER } from "@/components/home1/constants";
import CheckoutSessionBar from "@/components/checkout/CheckoutSessionBar";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutDateTimeStep from "@/components/checkout/CheckoutDateTimeStep";
import CheckoutDetailsStep from "@/components/checkout/CheckoutDetailsStep";
import CheckoutPaymentStep from "@/components/checkout/CheckoutPaymentStep";
import CheckoutComplete from "@/components/checkout/CheckoutComplete";
import {
  CHECKOUT_SESSION_SECONDS,
  buildCheckoutLineItems,
  getDefaultCheckoutService,
} from "@/data/checkoutPage";
import { useCheckoutSessionTimer } from "@/hooks/useCheckoutSessionTimer";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices } from "@/hooks/useServices";
import { useCheckoutServiceDetail } from "@/hooks/useCheckoutServiceDetail";
import CheckoutMainSkeleton from "@/components/skeletons/CheckoutMainSkeleton";
import CheckoutSummarySkeleton from "@/components/skeletons/CheckoutSummarySkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import {
  dateHasAvailableSlots,
  getDefaultBookingDateForSchedules,
} from "@/components/checkout/checkoutUtils";

const EMPTY_DETAILS = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  notes: "",
};

export default function CheckoutPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const variantId = searchParams.get("variant") ?? "";
  const variantLabelParam = searchParams.get("variantLabel") ?? "";

  const [step, setStep] = useState(1);
  const secondsLeft = useCheckoutSessionTimer(CHECKOUT_SESSION_SECONDS);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [stepError, setStepError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const dispatch = useAppDispatch();
  const { bookable, loading: servicesLoading, failed: servicesFailed, error: servicesError } =
    useBookableServices();
  const { service: detailService, schedules, loading: detailLoading, failed: detailFailed } =
    useCheckoutServiceDetail(slug);

  const bookingList = useMemo(
    () => bookable.map((s) => ({ name: s.name, price: s.price, priceIncVat: s.priceIncVat, slug: s.slug })),
    [bookable]
  );

  const service = useMemo(() => {
    const name = searchParams.get("service");
    if (detailService) return detailService;
    if (name) {
      const match = bookable.find((s) => s.name === name);
      if (match) return match;
    }
    return getDefaultCheckoutService(bookingList);
  }, [searchParams, detailService, bookable, bookingList]);

  const selectedVariant = useMemo(() => {
    if (!service?.variants?.length) return null;
    if (variantId) {
      return service.variants.find((v) => v.id === variantId) ?? null;
    }
    return null;
  }, [service, variantId]);

  const variantLabel = selectedVariant?.label ?? (variantLabelParam || null);

  const lineItems = useMemo(
    () => buildCheckoutLineItems(service, 0, selectedVariant),
    [service, selectedVariant]
  );

  const initialPostcode = searchParams.get("postcode") ?? "";
  const pageLoading = servicesLoading || (Boolean(slug) && detailLoading);
  const pageFailed = servicesFailed || (Boolean(slug) && detailFailed && !service);

  useEffect(() => {
    if (initialPostcode) {
      setDetails((d) => ({ ...d, postcode: initialPostcode.toUpperCase() }));
    }
  }, [initialPostcode]);

  useEffect(() => {
    if (!schedules.length) return;
    const next = getDefaultBookingDateForSchedules(schedules);
    if (next) setSelectedDate(next);
  }, [schedules]);

  function handleSelectDate(date) {
    setSelectedDate(date);
    setSelectedTime("");
    setStepError("");
  }

  function validateStep1() {
    if (!selectedDate || !dateHasAvailableSlots(selectedDate, schedules)) {
      setStepError("Please select an available date.");
      return false;
    }
    if (!selectedTime) {
      setStepError("Please select a time slot to continue.");
      return false;
    }
    setStepError("");
    return true;
  }

  function validateStep2() {
    const { firstName, lastName, email, phone, address, postcode } = details;
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !address.trim() || !postcode.trim()) {
      setStepError("Please complete all required fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStepError("Please enter a valid email address.");
      return false;
    }
    setStepError("");
    return true;
  }

  function handlePaymentComplete() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  }

  const summaryPostcode = details.postcode || initialPostcode;

  return (
    <div
      className={`home1-page home1-checkout-page w-full min-w-0${complete ? " home1-checkout-page--complete" : ""}`}
    >
      <Navbar />

      {!complete ? (
        <div className="home1-checkout-top">
          <CheckoutSessionBar secondsLeft={secondsLeft} />
        </div>
      ) : null}

      <main id="main-content" className="home1-checkout-main w-full min-w-0">
        <div className={`${CHECKOUT_PAGE_CONTAINER} home1-checkout-shell`}>

          {complete ? (
            <CheckoutComplete
              booking={{
                firstName: details.firstName,
                serviceName: service?.name ?? "Service",
                date: selectedDate,
                time: selectedTime,
                totalInc: lineItems.totalInc,
              }}
            />
          ) : pageLoading ? (
            <div className="home1-checkout-flow home1-checkout-flow--loading">
              <div className="home1-checkout-skeleton-stepper" aria-hidden="true">
                <div className="ue-skeleton home1-checkout-skeleton-stepper-bar" />
              </div>
              <div className="home1-checkout-flow-inner">
                <div className="home1-checkout-layout">
                  <div className="home1-checkout-main-col min-w-0 w-full">
                    <CheckoutMainSkeleton />
                  </div>
                  <CheckoutSummarySkeleton />
                </div>
              </div>
            </div>
          ) : pageFailed ? (
            <ServicesLoadError message={servicesError} onRetry={() => dispatch(fetchServices())} />
          ) : (
            <>
              <div className="home1-checkout-flow">
                <CheckoutStepper currentStep={step} />

                <div className="home1-checkout-flow-inner">
                  <div className="home1-checkout-layout">
                    <div className="home1-checkout-main-col min-w-0">
                      {step === 1 ? (
                        <CheckoutDateTimeStep
                          schedules={schedules}
                          selectedDate={selectedDate}
                          selectedTime={selectedTime}
                          onSelectDate={handleSelectDate}
                          onSelectTime={(t) => {
                            setSelectedTime(t);
                            setStepError("");
                          }}
                          onContinue={() => {
                            if (validateStep1()) setStep(2);
                          }}
                          error={stepError}
                        />
                      ) : step === 2 ? (
                        <CheckoutDetailsStep
                          details={details}
                          onChange={setDetails}
                          onBack={() => {
                            setStep(1);
                            setStepError("");
                          }}
                          onContinue={() => {
                            if (validateStep2()) setStep(3);
                          }}
                          error={stepError}
                        />
                      ) : (
                        <CheckoutPaymentStep
                          totalInc={lineItems.totalInc}
                          onBack={() => {
                            setStep(2);
                            setStepError("");
                          }}
                          onComplete={handlePaymentComplete}
                          error={stepError}
                          processing={processing}
                        />
                      )}
                    </div>

                    <CheckoutSummary
                      service={service}
                      variantLabel={variantLabel}
                      lineItems={lineItems}
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      postcode={summaryPostcode}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {!complete ? <CTAHome1 /> : null}
      {!complete ? <Footer /> : null}
      {!complete ? <FloatingCTA /> : null}
    </div>
  );
}
