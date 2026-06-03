"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import {
  validateOrderData,
  createPaymentIntent,
  checkPaymentStatus,
} from "@/store/slices/Checkoutslice";
import {
  selectClientSecret,
  selectPaymentIntentId,
  selectValidateStatus,
  selectValidateError,
  selectPaymentIntentStatus,
  selectPaymentIntentError,
  selectPaymentStatusError,
} from "@/store/selectors/checkoutSelectors";
import { useBookableServices } from "@/hooks/useServices";
import { useCheckoutServiceDetail } from "@/hooks/useCheckoutServiceDetail";
import { useServiceScheduleSlots } from "@/hooks/useServiceScheduleSlots";
import CheckoutMainSkeleton from "@/components/skeletons/CheckoutMainSkeleton";
import CheckoutSummarySkeleton from "@/components/skeletons/CheckoutSummarySkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { getTodayStart } from "@/components/checkout/checkoutUtils";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const EMPTY_DETAILS = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
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
  const clientSecret = useAppSelector(selectClientSecret);
  const paymentIntentId = useAppSelector(selectPaymentIntentId);
  const validateStatus = useAppSelector(selectValidateStatus);
  const validateError = useAppSelector(selectValidateError);
  const paymentIntentStatus = useAppSelector(selectPaymentIntentStatus);
  const paymentIntentError = useAppSelector(selectPaymentIntentError);
  const paymentStatusError = useAppSelector(selectPaymentStatusError);
  const { bookable, loading: servicesLoading, failed: servicesFailed, error: servicesError } =
    useBookableServices();
  const { service: detailService, loading: detailLoading, failed: detailFailed } =
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

  const useDynamicSchedule = Boolean(service?.apiId);
  const {
    slots: scheduleSlots,
    loading: scheduleSlotsLoading,
    error: scheduleSlotsError,
  } = useServiceScheduleSlots(useDynamicSchedule ? service?.apiId : null, selectedDate);

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
    if (!service?.apiId || selectedDate) return;
    setSelectedDate(getTodayStart());
  }, [service?.apiId, selectedDate]);

  function handleSelectDate(date) {
    setSelectedDate(date);
    setSelectedTime("");
    setStepError("");
  }

  function validateStep1() {
    if (!selectedDate) {
      setStepError("Please select an available date.");
      return false;
    }
    if (useDynamicSchedule) {
      if (scheduleSlotsLoading) {
        setStepError("Loading time slots. Please wait.");
        return false;
      }
      if (!selectedTime || !scheduleSlots.length) {
        setStepError("Please select a time slot to continue.");
        return false;
      }
    } else if (!selectedTime) {
      setStepError("Please select a time slot to continue.");
      return false;
    }
    setStepError("");
    return true;
  }

  function validateStep2() {
    const { firstName, lastName, email, phone, address, postcode, password, passwordConfirmation } =
      details;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !postcode.trim() ||
      !String(password ?? "").trim() ||
      !String(passwordConfirmation ?? "").trim()
    ) {
      setStepError("Please complete all required fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStepError("Please enter a valid email address.");
      return false;
    }
    if (String(password).trim().length < 8) {
      setStepError("Password must be at least 8 characters.");
      return false;
    }
    if (String(password).trim() !== String(passwordConfirmation).trim()) {
      setStepError("Passwords do not match.");
      return false;
    }
    setStepError("");
    return true;
  }

  async function handleContinueToPayment() {
    if (!validateStep2()) return;

    const amount = parseFloat(lineItems.totalInc) || 0;
    if (!service?.apiId) {
      setStepError("Service is not available for booking. Please choose a service and try again.");
      return;
    }

    setStepError("");

    const intentResult = await dispatch(createPaymentIntent(amount));
    if (createPaymentIntent.rejected.match(intentResult)) {
      setStepError(intentResult.payload ?? paymentIntentError ?? "Could not start payment.");
      return;
    }

    const intentId = intentResult.payload?.paymentIntentId ?? paymentIntentId;

    const validateResult = await dispatch(
      validateOrderData({
        service,
        variant: selectedVariant,
        selectedDate,
        selectedTime,
        schedules: scheduleSlots,
        details,
        lineItems,
        paymentIntentId: intentId,
      })
    );

    if (validateOrderData.rejected.match(validateResult)) {
      setStepError(validateResult.payload ?? validateError ?? "Could not validate your booking.");
      return;
    }

    setStep(3);
  }

  async function handleCheckPaymentStatus(intentId) {
    const result = await dispatch(checkPaymentStatus(intentId));
    if (checkPaymentStatus.rejected.match(result)) {
      // Stripe already confirmed payment — don't block success if backend auth fails.
      return false;
    }
    return true;
  }

  function handlePaymentComplete() {
    setProcessing(false);
    setComplete(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                          useDynamicSchedule={useDynamicSchedule}
                          timeSlots={scheduleSlots}
                          slotsLoading={scheduleSlotsLoading}
                          slotsError={scheduleSlotsError}
                        />
                      ) : step === 2 ? (
                        <CheckoutDetailsStep
                          details={details}
                          onChange={setDetails}
                          onBack={() => {
                            setStep(1);
                            setStepError("");
                          }}
                          onContinue={handleContinueToPayment}
                          error={stepError || (validateStatus === "failed" ? validateError : "")}
                          submitting={
                            validateStatus === "loading" || paymentIntentStatus === "loading"
                          }
                        />
                      ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={{ clientSecret }}>
                          <CheckoutPaymentStep
                            totalInc={lineItems.totalInc}
                            clientSecret={clientSecret}
                            paymentIntentId={paymentIntentId}
                            onBack={() => {
                              setStep(2);
                              setStepError("");
                            }}
                            onCheckPaymentStatus={handleCheckPaymentStatus}
                            onComplete={handlePaymentComplete}
                            error={
                              stepError ||
                              paymentIntentError ||
                              paymentStatusError ||
                              ""
                            }
                            processing={processing}
                          />
                        </Elements>
                      ) : (
                        <div className="home1-checkout-step-panel">
                          <p className="home1-checkout-alert home1-checkout-alert--error" role="alert">
                            {paymentIntentError ||
                              validateError ||
                              "Payment session is not ready. Go back and try again."}
                          </p>
                          <button
                            type="button"
                            className="home1-checkout-back-btn mt-4"
                            onClick={() => setStep(2)}
                          >
                            ← Back
                          </button>
                        </div>
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
