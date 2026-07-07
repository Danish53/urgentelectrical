"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { CHECKOUT_PAGE_CONTAINER } from "@/components/home1/constants";
import CheckoutSessionBar from "@/components/checkout/CheckoutSessionBar";
import CheckoutSessionExpiredModal from "@/components/checkout/CheckoutSessionExpiredModal";
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
import { computeCheckoutSummaryTotals } from "@/lib/checkout/computeCheckoutSummaryTotals";
import { useCheckoutSessionTimer } from "@/hooks/useCheckoutSessionTimer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import {
  validateOrderData,
  createPaymentIntent,
  checkPaymentStatus,
  createOrder,
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
  selectCreateOrderError,
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
import { readCheckoutAddress, resolveTravelChargePostcode, resolveTravelChargePostcodeField } from "@/lib/checkout/checkoutAddressFields";
import { getDeliveryFeeApiErrorMessage, parseDeliveryFeeResult } from "@/lib/checkout/parseDeliveryFeeResponse";
import { calculateDeliveryFee } from "@/services/checkoutApiService";
import { verifyServicePostcodeCoverage } from "@/lib/postcode/verifyServicePostcodeCoverage";
import ServicePostcodeResultModal from "@/components/shared/ServicePostcodeResultModal";

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
  siteAddress: "",
  siteAddressLine2: "",
  siteCity: "",
  sitePostcode: "",
  siteCounty: "",
  siteCountry: "GB",
  siteSameAsBilling: null,
  siteAddressId: "",
};

export default function CheckoutPageClient() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const variantId = searchParams.get("variant") ?? "";
  const variantLabelParam = searchParams.get("variantLabel") ?? "";

  const [step, setStep] = useState(1);
  const { secondsLeft, expired: sessionExpired } = useCheckoutSessionTimer(CHECKOUT_SESSION_SECONDS);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [stepError, setStepError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    billingPostcode: "",
    sitePostcode: "",
    siteSameAsBilling: "",
    selectedSite: "",
  });
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [handlingBankReturn, setHandlingBankReturn] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [deliveryFeeFromApi, setDeliveryFeeFromApi] = useState(0);
  const [deliveryFeeResolved, setDeliveryFeeResolved] = useState(false);
  const [deliveryFeeOutOfRange, setDeliveryFeeOutOfRange] = useState(false);
  const [deliveryFeeError, setDeliveryFeeError] = useState("");
  const [deliveryFeeLoading, setDeliveryFeeLoading] = useState(false);
  const [siteSameChecking, setSiteSameChecking] = useState(false);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const lastFetchedPostcodeRef = useRef("");

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
  const createOrderError = useAppSelector(selectCreateOrderError);
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
    () =>
      buildCheckoutLineItems(service, deliveryFeeFromApi, selectedVariant, {
        travelFeeIsInc: false,
      }),
    [service, selectedVariant, deliveryFeeFromApi]
  );

  const payableTotalInc = useMemo(() => {
    const { payableTotalInc: total } = computeCheckoutSummaryTotals({
      serviceExc: lineItems.service?.amountExc,
      travelExc: lineItems.travel?.amountExc,
      discount: appliedCoupon?.discountAmount ?? 0,
    });
    return total.toFixed(2);
  }, [lineItems.service?.amountExc, lineItems.travel?.amountExc, appliedCoupon]);

  const buildOrderParams = useCallback(
    (intentId) => ({
      service,
      variant: selectedVariant,
      selectedDate,
      selectedTime,
      schedules: scheduleSlots,
      details: { ...details, isGuest: !isLoggedIn },
      lineItems,
      paymentIntentId: intentId,
      coupon: appliedCoupon,
    }),
    [
      service,
      selectedVariant,
      selectedDate,
      selectedTime,
      scheduleSlots,
      details,
      isLoggedIn,
      lineItems,
      appliedCoupon,
    ]
  );

  const finalizeBookingAfterPayment = useCallback(
    async (intentId) => {
      if (!intentId) {
        setStepError("Payment could not be confirmed. Please contact support.");
        return false;
      }

      if (!service?.apiId) {
        setStepError("Service is not available for booking. Please go back and try again.");
        return false;
      }

      await dispatch(checkPaymentStatus(intentId));

      const result = await dispatch(createOrder(buildOrderParams(intentId)));
      if (createOrder.rejected.match(result)) {
        setStepError(
          result.payload ??
            "Your payment succeeded but we could not create the order. Please contact support with your payment reference."
        );
        return false;
      }

      return true;
    },
    [dispatch, service?.apiId, buildOrderParams]
  );

  const paymentCouponSnapshotRef = useRef(null);

  const initialPostcode = searchParams.get("postcode") ?? "";
  const travelPostcode = useMemo(() => {
    const fromDetails = String(resolveTravelChargePostcode(details) ?? "").trim().toUpperCase();
    if (fromDetails) return fromDetails;
    return String(initialPostcode ?? "").trim().toUpperCase();
  }, [
    details.siteSameAsBilling,
    details.siteAddressId,
    details.postcode,
    details.sitePostcode,
    initialPostcode,
  ]);
  const pageLoading = servicesLoading || (Boolean(slug) && detailLoading);
  const pageFailed = servicesFailed || (Boolean(slug) && detailFailed && !service);

  useEffect(() => {
    if (step !== 3) {
      paymentCouponSnapshotRef.current = null;
    }
  }, [step]);

  useEffect(() => {
    if (step !== 3 || !clientSecret) return;

    const snapshot = `${appliedCoupon?.code ?? ""}:${appliedCoupon?.discountAmount ?? 0}:${payableTotalInc}`;
    if (paymentCouponSnapshotRef.current === snapshot) return;

    const isInitial = paymentCouponSnapshotRef.current === null;
    paymentCouponSnapshotRef.current = snapshot;
    if (isInitial) return;

    let cancelled = false;

    async function refreshPaymentIntent() {
      const amount = parseFloat(payableTotalInc) || 0;
      const intentResult = await dispatch(createPaymentIntent(amount));
      if (cancelled || createPaymentIntent.rejected.match(intentResult)) return;

      const intentId = intentResult.payload?.paymentIntentId ?? paymentIntentId;
      if (!service?.apiId || !intentId) return;

      await dispatch(
        validateOrderData({
          service,
          variant: selectedVariant,
          selectedDate,
          selectedTime,
          schedules: scheduleSlots,
          details: { ...details, isGuest: !isLoggedIn },
          lineItems,
          paymentIntentId: intentId,
          coupon: appliedCoupon,
        })
      );
    }

    refreshPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [
    step,
    clientSecret,
    appliedCoupon,
    payableTotalInc,
    dispatch,
    paymentIntentId,
    service,
    selectedVariant,
    selectedDate,
    selectedTime,
    scheduleSlots,
    details,
    lineItems,
    isLoggedIn,
  ]);

  const refreshDeliveryFee = useCallback(async (postcode) => {
    const normalized = String(postcode ?? "").trim().toUpperCase();
    if (!normalized) {
      lastFetchedPostcodeRef.current = "";
      setDeliveryFeeFromApi(0);
      setDeliveryFeeResolved(false);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError("");
      return { ok: false, code: "api_error", message: "Please enter a postcode." };
    }

    setDeliveryFeeLoading(true);
    setDeliveryFeeOutOfRange(false);
    setDeliveryFeeError("");

    try {
      const feeResponse = await calculateDeliveryFee({ postcode: normalized });
      const result = parseDeliveryFeeResult(feeResponse);

      lastFetchedPostcodeRef.current = normalized;

      if (!result.ok) {
        setDeliveryFeeFromApi(0);
        setDeliveryFeeResolved(false);
        setDeliveryFeeOutOfRange(result.code === "out_of_range");
        setDeliveryFeeError(result.message);
        return result;
      }

      setDeliveryFeeFromApi(result.fee);
      setDeliveryFeeResolved(true);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError("");
      return result;
    } catch (err) {
      const message = getDeliveryFeeApiErrorMessage(err);
      lastFetchedPostcodeRef.current = normalized;
      setDeliveryFeeFromApi(0);
      setDeliveryFeeResolved(false);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError(message);
      return { ok: false, code: "api_error", message };
    } finally {
      setDeliveryFeeLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialPostcode) {
      setDetails((d) => ({ ...d, postcode: initialPostcode.toUpperCase() }));
    }
  }, [initialPostcode]);

  useEffect(() => {
    setAppliedCoupon(null);
  }, [service?.apiId, selectedVariant?.apiVariantId, selectedVariant?.id]);

  useEffect(() => {
    const postcode = travelPostcode;
    if (!postcode || postcode.length < 4) {
      lastFetchedPostcodeRef.current = "";
      setDeliveryFeeFromApi(0);
      setDeliveryFeeResolved(false);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError("");
      return;
    }

    if (lastFetchedPostcodeRef.current && lastFetchedPostcodeRef.current !== postcode) {
      lastFetchedPostcodeRef.current = "";
      setDeliveryFeeFromApi(0);
      setDeliveryFeeResolved(false);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError("");
    }
  }, [travelPostcode]);

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
      if (!scheduleSlots.length) {
        setStepError("");
        return false;
      }
      if (!selectedTime) {
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
            const created = await finalizeBookingAfterPayment(intentId);
            if (created) {
              setComplete(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              setStep(3);
            }
          }
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
  }, [searchParams, dispatch, stripePromise, finalizeBookingAfterPayment]);

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

  function handleDetailsChange(next) {
    const prevTravelPostcode = String(resolveTravelChargePostcode(details) ?? "")
      .trim()
      .toUpperCase();
    const nextTravelPostcode = String(resolveTravelChargePostcode(next) ?? "")
      .trim()
      .toUpperCase();

    const prevBillingPostcode = String(details.postcode ?? "").trim().toUpperCase();
    const nextBillingPostcode = String(next.postcode ?? "").trim().toUpperCase();
    const normalizedNext =
      prevBillingPostcode !== nextBillingPostcode && next.siteSameAsBilling === true
        ? { ...next, siteSameAsBilling: null }
        : next;

    setDetails(normalizedNext);

    const billingPostcode = readCheckoutAddress(normalizedNext, "billing").postcode.trim();
    const sitePostcode = readCheckoutAddress(normalizedNext, "site").postcode.trim();

    setFieldErrors((prev) => ({
      billingPostcode: billingPostcode ? "" : prev.billingPostcode,
      sitePostcode: sitePostcode ? "" : prev.sitePostcode,
      siteSameAsBilling:
        normalizedNext.siteSameAsBilling === true || normalizedNext.siteSameAsBilling === false
          ? ""
          : prev.siteSameAsBilling,
      selectedSite: normalizedNext.siteAddressId ? "" : prev.selectedSite,
    }));

    if (nextTravelPostcode && nextTravelPostcode !== prevTravelPostcode) {
      lastFetchedPostcodeRef.current = "";
      setDeliveryFeeFromApi(0);
      setDeliveryFeeResolved(false);
      setDeliveryFeeOutOfRange(false);
      setDeliveryFeeError("");
    } else if (nextTravelPostcode) {
      setDeliveryFeeError("");
    }
  }

  const verifyPostcodeCoverage = useCallback(
    async (postcode) => {
      const result = await verifyServicePostcodeCoverage({
        source: "checkout",
        serviceSlug: service?.slug ?? slug,
        postCode: postcode,
      });

      if (!result.allowed && !result.message) {
        setCoverageModalOpen(true);
      }

      return result;
    },
    [service?.slug, slug]
  );

  const handleSiteSameAsBillingChange = useCallback(
    async (same) => {
      if (same === false) {
        setDetails((prev) => ({ ...prev, siteSameAsBilling: false }));
        setFieldErrors((prev) => ({ ...prev, siteSameAsBilling: "" }));
        return;
      }

      const postcode = String(details.postcode ?? "").trim();

      if (!postcode) {
        setFieldErrors((prev) => ({
          ...prev,
          billingPostcode: "Please enter a postcode and find your billing address first.",
        }));
        return;
      }

      setSiteSameChecking(true);
      setFieldErrors((prev) => ({ ...prev, siteSameAsBilling: "" }));

      try {
        const coverage = await verifyPostcodeCoverage(postcode);

        if (!coverage.allowed) {
          setDetails((prev) => ({ ...prev, siteSameAsBilling: null }));
          if (coverage.message) {
            setFieldErrors((prev) => ({
              ...prev,
              siteSameAsBilling: coverage.message,
            }));
          }
          return;
        }

        setDetails((prev) => ({ ...prev, siteSameAsBilling: true }));
      } finally {
        setSiteSameChecking(false);
      }
    },
    [details.postcode, verifyPostcodeCoverage]
  );

  const handleSitePostcodeBeforeLookup = useCallback(
    async (postcode) => {
      const coverage = await verifyPostcodeCoverage(postcode);
      if (!coverage.allowed && coverage.message) {
        setFieldErrors((prev) => ({ ...prev, sitePostcode: coverage.message }));
      }
      return coverage;
    },
    [verifyPostcodeCoverage]
  );

  function validateStep2() {
    if (isLoggedIn) {
      const site = readCheckoutAddress(details, "site");
      const { firstName, lastName, email, phone } = details;
      const missingSite = !details.siteAddressId || !site.address?.trim() || !site.postcode.trim();
      const nextFieldErrors = {
        billingPostcode: "",
        sitePostcode: "",
        siteSameAsBilling: "",
        selectedSite: missingSite ? "Please select a saved location." : "",
      };
      setFieldErrors(nextFieldErrors);

      if (missingSite) {
        setStepError("");
        return false;
      }

      if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
        setStepError("Your account is missing contact details. Please update your profile and try again.");
        return false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setStepError("Please enter a valid email address.");
        return false;
      }

      setStepError("");
      setFieldErrors({ billingPostcode: "", sitePostcode: "", siteSameAsBilling: "", selectedSite: "" });
      return true;
    }

    const { firstName, lastName, email, phone, password, passwordConfirmation } = details;
    const billing = readCheckoutAddress(details, "billing");
    const siteSameChoice = details.siteSameAsBilling;
    const siteSameAsBilling = siteSameChoice === true;
    const siteSameUnset = siteSameChoice !== true && siteSameChoice !== false;
    const site = siteSameAsBilling ? billing : readCheckoutAddress(details, "site");

    const missingBillingPostcode = !billing.postcode.trim();
    const missingSitePostcode = siteSameChoice === false && !site.postcode.trim();
    const nextFieldErrors = {
      billingPostcode: missingBillingPostcode ? "Please enter a postcode." : "",
      sitePostcode: missingSitePostcode ? "Please enter a postcode." : "",
      siteSameAsBilling: siteSameUnset ? "Please select Yes or No." : "",
    };
    setFieldErrors(nextFieldErrors);

    if (siteSameUnset) {
      setStepError("");
      return false;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !billing.address ||
      missingBillingPostcode
    ) {
      const onlyPostcodeMissing =
        missingBillingPostcode &&
        firstName.trim() &&
        lastName.trim() &&
        email.trim() &&
        phone.trim() &&
        billing.address;

      setStepError(onlyPostcodeMissing ? "" : "Please complete all required fields.");
      return false;
    }

    if (siteSameChoice === false && (!site.address || missingSitePostcode)) {
      const onlySitePostcodeMissing = missingSitePostcode && site.address;
      setStepError(
        onlySitePostcodeMissing
          ? ""
          : "Please complete the site address or choose Yes to use billing address."
      );
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
    setFieldErrors({ billingPostcode: "", sitePostcode: "", siteSameAsBilling: "", selectedSite: "" });
    return true;
  }

  async function handleContinueToPayment() {
    if (!validateStep2()) return;

    if (!service?.apiId) {
      setStepError("Service is not available for booking. Please choose a service and try again.");
      return;
    }

    const postcode = String(resolveTravelChargePostcode(details) ?? "").trim();
    const postcodeField = resolveTravelChargePostcodeField(details, isLoggedIn);
    if (!postcode) {
      setFieldErrors((prev) => ({
        ...prev,
        [postcodeField]: "Please enter a postcode.",
      }));
      setStepError("");
      return;
    }

    const normalizedPostcode = postcode.toUpperCase();
    if (deliveryFeeError && lastFetchedPostcodeRef.current === normalizedPostcode) {
      setFieldErrors((prev) => ({ ...prev, [postcodeField]: deliveryFeeError }));
      setStepError(deliveryFeeError);
      return;
    }

    setStepError("");

    let fee = deliveryFeeFromApi;
    if (!deliveryFeeResolved || lastFetchedPostcodeRef.current !== normalizedPostcode) {
      const feeResult = await refreshDeliveryFee(postcode);
      if (!feeResult.ok) {
        setFieldErrors((prev) => ({ ...prev, [postcodeField]: feeResult.message }));
        setStepError(feeResult.message);
        return;
      }
      fee = feeResult.fee;
    }

    const updatedLineItems = buildCheckoutLineItems(service, fee, selectedVariant, {
      travelFeeIsInc: false,
    });
    const { payableTotalInc: amount } = computeCheckoutSummaryTotals({
      serviceExc: updatedLineItems.service?.amountExc,
      travelExc: updatedLineItems.travel?.amountExc,
      discount: appliedCoupon?.discountAmount ?? 0,
    });

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
        lineItems: updatedLineItems,
        paymentIntentId: intentId,
        coupon: appliedCoupon,
      })
    );

    if (validateOrderData.rejected.match(validateResult)) {
      setStepError(validateResult.payload ?? validateError ?? "Could not validate your booking.");
      return;
    }

    setStep(3);
  }

  async function handleCheckPaymentStatus(intentId) {
    setProcessing(true);
    try {
      return await finalizeBookingAfterPayment(intentId);
    } finally {
      setProcessing(false);
    }
  }

  function handlePaymentComplete() {
    setProcessing(false);
    setComplete(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const summaryPostcode = travelPostcode;

  return (
    <div
      className={`home1-page home1-checkout-page w-full min-w-0${complete ? " home1-checkout-page--complete" : ""}`}
    >
      <Navbar />

      {!complete && sessionExpired ? (
        <CheckoutSessionExpiredModal serviceSlug={slug || service?.slug || ""} />
      ) : null}

      {!complete && !sessionExpired ? (
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
                totalInc: payableTotalInc,
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
                          onChange={handleDetailsChange}
                          onSiteSameChange={handleSiteSameAsBillingChange}
                          onSitePostcodeBeforeLookup={handleSitePostcodeBeforeLookup}
                          siteSameChecking={siteSameChecking}
                          isLoggedIn={isLoggedIn}
                          fieldErrors={{
                            ...fieldErrors,
                            billingPostcode:
                              fieldErrors.billingPostcode ||
                              (!isLoggedIn && details.siteSameAsBilling !== false
                                ? deliveryFeeError
                                : ""),
                            sitePostcode:
                              fieldErrors.sitePostcode ||
                              (!isLoggedIn && details.siteSameAsBilling === false
                                ? deliveryFeeError
                                : ""),
                            selectedSite:
                              fieldErrors.selectedSite || (isLoggedIn ? deliveryFeeError : ""),
                          }}
                          onBack={() => {
                            setStep(1);
                            setStepError("");
                            setFieldErrors({
                              billingPostcode: "",
                              sitePostcode: "",
                              siteSameAsBilling: "",
                              selectedSite: "",
                            });
                          }}
                          onContinue={handleContinueToPayment}
                          error={stepError || (validateStatus === "failed" ? validateError : "")}
                          submitting={
                            deliveryFeeLoading ||
                            validateStatus === "loading" ||
                            paymentIntentStatus === "loading"
                          }
                        />
                      ) : clientSecret && stripePromise ? (
                        <Elements
                          key={`${clientSecret}:${stripePublishableKey || "default"}`}
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
                            totalInc={payableTotalInc}
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
                              createOrderError ||
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
                      serviceApiId={service?.apiId}
                      variantApiId={selectedVariant?.apiVariantId ?? selectedVariant?.id}
                      appliedCoupon={appliedCoupon}
                      onCouponApplied={setAppliedCoupon}
                      onCouponRemoved={() => setAppliedCoupon(null)}
                      deliveryFeeLoading={deliveryFeeLoading}
                      deliveryFeeResolved={deliveryFeeResolved}
                      deliveryFeeOutOfRange={deliveryFeeOutOfRange}
                      deliveryFeeError={deliveryFeeError}
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

      <ServicePostcodeResultModal
        open={coverageModalOpen}
        variant="outOfArea"
        message="Our services are unavailable in this area"
        onClose={() => setCoverageModalOpen(false)}
      />
    </div>
  );
}
