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
  selectStripePublishableKey,
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
import { useAuthSession } from "@/hooks/useAuthSession";
import { selectAuthUser } from "@/store/selectors/authSelectors";

import { Elements } from "@stripe/react-stripe-js";
import { createStripePromise } from "@/lib/checkout/stripeLoader";
import {
  formatCreateIntentApiResponse,
  logPaymentIntentDebug,
} from "@/lib/checkout/logPaymentIntentDebug";

const EMPTY_DETAILS = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  phone: "",
  address: "",
  addressLine2: "",
  city: "",
  postcode: "",
  county: "",
  country: "GB",
  title: "Mr",
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
  const [handlingBankReturn, setHandlingBankReturn] = useState(false);

  const dispatch = useAppDispatch();
  const clientSecret = useAppSelector(selectClientSecret);
  const stripePublishableKey = useAppSelector(selectStripePublishableKey);
  const paymentIntentId = useAppSelector(selectPaymentIntentId);
  const stripePromise = useMemo(
    () => createStripePromise(stripePublishableKey),
    [stripePublishableKey]
  );
  const validateStatus = useAppSelector(selectValidateStatus);
  const validateError = useAppSelector(selectValidateError);
  const paymentIntentStatus = useAppSelector(selectPaymentIntentStatus);
  const paymentIntentError = useAppSelector(selectPaymentIntentError);
  const paymentStatusError = useAppSelector(selectPaymentStatusError);
  const { isLoggedIn } = useAuthSession();
  const authUser = useAppSelector(selectAuthUser);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function scrollCheckoutTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStepClick(targetStep) {
    if (targetStep === step) {
      scrollCheckoutTop();
      return;
    }

    if (targetStep > step) return;

    setStepError("");
    setStep(targetStep);
    scrollCheckoutTop();
  }

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

  useEffect(() => {
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret");
    const redirectStatus = searchParams.get("redirect_status");
    const returnedPaymentIntentId = searchParams.get("payment_intent");

    if (!paymentIntentClientSecret || !redirectStatus) return;

    let cancelled = false;

    async function handleStripeReturn() {
      setHandlingBankReturn(true);
      setProcessing(true);
      setStepError("");

      try {
        const stripe = await stripePromise;
        if (!stripe || cancelled) return;

        const { paymentIntent, error } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);

        if (cancelled) return;

        if (error) {
          setStepError(error.message ?? "Payment could not be verified.");
          setStep(3);
          return;
        }

        if (
          redirectStatus === "succeeded" &&
          (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing")
        ) {
          const intentId = paymentIntent?.id ?? returnedPaymentIntentId;
          if (intentId) {
            await dispatch(checkPaymentStatus(intentId));
          }
          setComplete(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          setStepError("Payment was not completed. Please try again.");
          setStep(3);
        }
      } catch (err) {
        if (!cancelled) {
          setStepError(err?.message ?? "Payment could not be verified.");
          setStep(3);
        }
      } finally {
        if (!cancelled) {
          setProcessing(false);
          setHandlingBankReturn(false);

          const cleanUrl = new URL(window.location.href);
          cleanUrl.searchParams.delete("payment_intent");
          cleanUrl.searchParams.delete("payment_intent_client_secret");
          cleanUrl.searchParams.delete("redirect_status");
          window.history.replaceState({}, "", cleanUrl.toString());
        }
      }
    }

    handleStripeReturn();

    return () => {
      cancelled = true;
    };
  }, [searchParams, dispatch, stripePromise]);

  useEffect(() => {
    if (!isLoggedIn || !authUser) return;

    setDetails((current) => ({
      ...current,
      firstName: current.firstName || String(authUser.first_name ?? authUser.firstName ?? "").trim(),
      lastName: current.lastName || String(authUser.last_name ?? authUser.lastName ?? "").trim(),
      email: current.email || String(authUser.email ?? "").trim(),
      phone:
        current.phone ||
        String(authUser.mobile ?? authUser.mobile_number ?? authUser.phone ?? "").trim(),
    }));
  }, [isLoggedIn, authUser]);

  function validateStep2() {
    const { firstName, lastName, email, phone, address, postcode, password, passwordConfirmation } =
      details;
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !postcode.trim()
    ) {
      setStepError("Please complete all required fields.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStepError("Please enter a valid email address.");
      return false;
    }
    if (!isLoggedIn) {
      if (!String(password ?? "").trim() || !String(passwordConfirmation ?? "").trim()) {
        setStepError("Please complete all required fields.");
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

    logPaymentIntentDebug("Laravel API response", formatCreateIntentApiResponse(intentResult.payload?.raw));
    logPaymentIntentDebug("Parsed for checkout", {
      paymentIntentId: intentResult.payload?.paymentIntentId,
      hasClientSecret: Boolean(intentResult.payload?.clientSecret),
      paymentMethodTypesFromApi: intentResult.payload?.paymentMethodTypes,
      stripePublishableKeyFromApi: intentResult.payload?.stripePublishableKey
        ? `${String(intentResult.payload.stripePublishableKey).slice(0, 12)}…`
        : null,
    });

    const intentId = intentResult.payload?.paymentIntentId ?? paymentIntentId;

    const validateResult = await dispatch(
      validateOrderData({
        service,
        variant: selectedVariant,
        selectedDate,
        selectedTime,
        schedules: scheduleSlots,
        details: { ...details, isGuest: !isLoggedIn },
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
          ) : pageLoading || handlingBankReturn ? (
            <div className="home1-checkout-flow home1-checkout-flow--loading">
              {handlingBankReturn ? (
                <p className="home1-checkout-bank-return-message" role="status">
                  Verifying your payment…
                </p>
              ) : null}
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
                <CheckoutStepper currentStep={step} onStepClick={handleStepClick} />

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
                          isLoggedIn={isLoggedIn}
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
                      ) : clientSecret && stripePromise ? (
                        <Elements
                          stripe={stripePromise}
                          options={{
                            clientSecret,
                            locale: "en-GB",
                            developerTools: {
                              assistant: {
                                enabled: false,
                              },
                            },
                            appearance: {
                              theme: "stripe",
                              variables: {
                                colorPrimary: "#635bff",
                                colorText: "#111827",
                                colorDanger: "#dc2626",
                                fontFamily: "Inter, system-ui, sans-serif",
                                borderRadius: "8px",
                                spacingUnit: "4px",
                              },
                              rules: {
                                ".Tab": {
                                  border: "1px solid #e5e7eb",
                                  boxShadow: "none",
                                },
                                ".Tab--selected": {
                                  borderColor: "#635bff",
                                  backgroundColor: "#f8f7ff",
                                },
                                ".Input": {
                                  border: "1px solid #e5e7eb",
                                  boxShadow: "none",
                                },
                              },
                            },
                          }}
                        >
                          <CheckoutPaymentStep
                            totalInc={lineItems.totalInc}
                            clientSecret={clientSecret}
                            paymentIntentId={paymentIntentId}
                            billingName={[details.firstName, details.lastName].filter(Boolean).join(" ")}
                            billingEmail={details.email}
                            billingPhone={details.phone}
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
