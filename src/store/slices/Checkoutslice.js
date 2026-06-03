import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import { buildValidateOrderPayload } from "@/lib/checkout/buildValidateOrderPayload";
import { setAuthToken } from "@/lib/auth/tokenStorage";
import { parseAuthResponse } from "@/services/authService";
import * as checkoutApi from "@/services/checkoutApiService";
import { parsePaymentIntentResponse } from "@/lib/checkout/buildValidateOrderPayload";

/**
 * @param {import("@/lib/checkout/buildValidateOrderPayload").buildValidateOrderPayload extends (...args: infer A) => void ? A[0] : never} params
 */
export const validateOrderData = createAsyncThunk(
  "checkout/validateOrderData",
  async (params, { rejectWithValue }) => {
    try {
      const payload = buildValidateOrderPayload(params);
      const data = await checkoutApi.validateOrderData(payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not validate order."));
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "checkout/createPaymentIntent",
  async (/** @type {number} */ amount, { rejectWithValue }) => {
    try {
      const data = await checkoutApi.createPaymentIntent(amount);
      return parsePaymentIntentResponse(data);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not start payment."));
    }
  }
);

export const checkPaymentStatus = createAsyncThunk(
  "checkout/checkPaymentStatus",
  async (/** @type {string} */ paymentIntentId, { rejectWithValue }) => {
    try {
      return await checkoutApi.checkPaymentStatus(paymentIntentId);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not verify payment."));
    }
  }
);

const EMPTY_DETAILS = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  notes: "",
  title: "Mr",
  company: null,
  country: "GB",
  addressLine2: "",
  county: null,
  isGuest: true,
  password: "",
  passwordConfirmation: "",
};

const initialState = {
  step: 1,
  selectedDate: null,
  selectedTime: null,
  details: EMPTY_DETAILS,
  serviceId: null,
  variantId: null,
  amount: 0,
  subTotal: 0,
  deliveryFee: 0,
  discountAmount: 0,
  discountValue: null,
  discountType: null,
  crmScheduleKey: null,
  paymentIntentId: null,
  clientSecret: null,
  siteCountry: "GB",
  sitePostCode: "",
  siteAddressLine1: "",
  siteAddressLine2: "",
  siteTown: "",
  siteCounty: null,
  validateStatus: "idle",
  validateError: null,
  validatedOrderData: null,
  paymentIntentStatus: "idle",
  paymentIntentError: null,
  paymentStatus: "idle",
  paymentStatusError: null,
  paymentVerified: false,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    goToStep(state, action) {
      state.step = action.payload;
    },
    goBack(state) {
      if (state.step > 1) state.step -= 1;
    },
    setSelectedDate(state, action) {
      state.selectedDate = action.payload;
      state.selectedTime = null;
    },
    setSelectedTime(state, action) {
      state.selectedTime = action.payload;
    },
    setDetails(state, action) {
      state.details = { ...state.details, ...action.payload };
    },
    setCheckoutContext(state, action) {
      const { serviceId, variantId, amount, subTotal } = action.payload;
      if (serviceId != null) state.serviceId = serviceId;
      if (variantId != null) state.variantId = variantId;
      if (amount != null) state.amount = amount;
      if (subTotal != null) state.subTotal = subTotal;
    },
    initCheckout(state, action) {
      const {
        serviceId,
        variantId,
        amount,
        subTotal,
        deliveryFee,
        discountAmount,
        discountValue,
        discountType,
        crmScheduleKey,
        paymentIntentId,
        siteCountry,
        sitePostCode,
        siteAddressLine1,
        siteAddressLine2,
        siteTown,
        siteCounty,
      } = action.payload;

      state.serviceId = serviceId ?? state.serviceId;
      state.variantId = variantId ?? state.variantId;
      state.amount = amount ?? state.amount;
      state.subTotal = subTotal ?? state.subTotal;
      state.deliveryFee = deliveryFee ?? state.deliveryFee;
      state.discountAmount = discountAmount ?? state.discountAmount;
      state.discountValue = discountValue ?? state.discountValue;
      state.discountType = discountType ?? state.discountType;
      state.crmScheduleKey = crmScheduleKey ?? state.crmScheduleKey;
      state.paymentIntentId = paymentIntentId ?? state.paymentIntentId;
      state.siteCountry = siteCountry ?? state.siteCountry;
      state.sitePostCode = sitePostCode ?? state.sitePostCode;
      state.siteAddressLine1 = siteAddressLine1 ?? state.siteAddressLine1;
      state.siteAddressLine2 = siteAddressLine2 ?? state.siteAddressLine2;
      state.siteTown = siteTown ?? state.siteTown;
      state.siteCounty = siteCounty ?? state.siteCounty;
      state.step = 1;
      state.selectedDate = null;
      state.selectedTime = null;
      state.details = { ...EMPTY_DETAILS };
      state.validateStatus = "idle";
      state.validateError = null;
      state.validatedOrderData = null;
      state.paymentIntentStatus = "idle";
      state.paymentIntentError = null;
      state.clientSecret = null;
      state.paymentStatus = "idle";
      state.paymentStatusError = null;
      state.paymentVerified = false;
    },
    resetCheckout() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateOrderData.pending, (state) => {
        state.validateStatus = "loading";
        state.validateError = null;
      })
      .addCase(validateOrderData.fulfilled, (state, action) => {
        state.validateStatus = "succeeded";
        state.validatedOrderData = action.payload;
        const { token } = parseAuthResponse(action.payload);
        if (token) setAuthToken(token);
      })
      .addCase(validateOrderData.rejected, (state, action) => {
        state.validateStatus = "failed";
        state.validateError = action.payload ?? "Validation failed.";
      })

      .addCase(createPaymentIntent.pending, (state) => {
        state.paymentIntentStatus = "loading";
        state.paymentIntentError = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentIntentStatus = "succeeded";
        state.clientSecret = action.payload.clientSecret;
        if (action.payload.paymentIntentId) {
          state.paymentIntentId = action.payload.paymentIntentId;
        }
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.paymentIntentStatus = "failed";
        state.paymentIntentError = action.payload ?? "Could not start payment.";
      })

      .addCase(checkPaymentStatus.pending, (state) => {
        state.paymentStatus = "loading";
        state.paymentStatusError = null;
      })
      .addCase(checkPaymentStatus.fulfilled, (state) => {
        state.paymentStatus = "succeeded";
        state.paymentVerified = true;
      })
      .addCase(checkPaymentStatus.rejected, (state, action) => {
        state.paymentStatus = "failed";
        state.paymentStatusError = action.payload ?? "Payment verification failed.";
        state.paymentVerified = false;
      });
  },
});

export const {
  goToStep,
  goBack,
  setSelectedDate,
  setSelectedTime,
  setDetails,
  setCheckoutContext,
  initCheckout,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
