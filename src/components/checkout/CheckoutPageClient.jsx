"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar.jsx";
import Footer from "@/components/Footer.jsx";
import FloatingCTA from "@/components/FloatingCTA.jsx";
import CTAHome1 from "@/components/home1/CTAHome1";
import { CONTAINER } from "@/components/home1/constants";
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
  findServiceByName,
  getDefaultCheckoutService,
} from "@/data/checkoutPage";
import { useAppDispatch } from "@/store/hooks";
import { fetchServices } from "@/store/slices/servicesSlice";
import { useBookableServices } from "@/hooks/useServices";
import CheckoutMainSkeleton from "@/components/skeletons/CheckoutMainSkeleton";
import CheckoutSummarySkeleton from "@/components/skeletons/CheckoutSummarySkeleton";
import ServicesLoadError from "@/components/services/ServicesLoadError";
import { dateHasSlots, getDefaultBookingDate } from "@/components/checkout/checkoutUtils";

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
  const [step, setStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(CHECKOUT_SESSION_SECONDS);
  const [selectedDate, setSelectedDate] = useState(() => getDefaultBookingDate());
  const [selectedTime, setSelectedTime] = useState("");
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [stepError, setStepError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);

  const dispatch = useAppDispatch();
  const { bookable, loading: servicesLoading, failed: servicesFailed, error: servicesError } =
    useBookableServices();

  const service = useMemo(() => {
    const bookingList = bookable.map((s) => ({ name: s.name, price: s.price }));
    const name = searchParams.get("service");
    return name ? findServiceByName(name, bookingList) : getDefaultCheckoutService(bookingList);
  }, [searchParams, bookable]);

  const lineItems = useMemo(() => buildCheckoutLineItems(service), [service]);

  const initialPostcode = searchParams.get("postcode") ?? "";

  useEffect(() => {
    if (initialPostcode) {
      setDetails((d) => ({ ...d, postcode: initialPostcode.toUpperCase() }));
    }
  }, [initialPostcode]);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function handleSelectDate(date) {
    setSelectedDate(date);
    setSelectedTime("");
    setStepError("");
  }

  function validateStep1() {
    if (!selectedDate || !dateHasSlots(selectedDate)) {
      setStepError("Please select an available date.");
      return false;
    }
    if (!selectedTime) {
      setStepError("Please select a time slot.");
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
      {!complete ? <CheckoutSessionBar secondsLeft={secondsLeft} /> : null}

      <main id="main-content" className="home1-checkout-main w-full min-w-0">
        <div className={`${CONTAINER} home1-checkout-shell`}>
          {!complete ? (
            <nav className="home1-checkout-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Cart</Link>
              <span aria-hidden="true">/</span>
              <span>Checkout</span>
            </nav>
          ) : null}

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
          ) : servicesLoading ? (
            <div className="home1-checkout-layout">
              <div className="home1-checkout-main-col min-w-0">
                <CheckoutMainSkeleton />
              </div>
              <CheckoutSummarySkeleton />
            </div>
          ) : servicesFailed ? (
            <ServicesLoadError message={servicesError} onRetry={() => dispatch(fetchServices())} />
          ) : (
            <>
              <CheckoutStepper currentStep={step} />
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
                  lineItems={lineItems}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  postcode={summaryPostcode}
                />
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
