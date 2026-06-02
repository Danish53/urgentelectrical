import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import * as ordersApi from "@/services/ordersApiService";

export const loadOrders = createAsyncThunk(
  "orders/fetchAll",
  async (/** @type {{ page?: number } | undefined} */ options, { rejectWithValue }) => {
    try {
      const page = options?.page ?? 1;
      return {
        ...(await ordersApi.fetchOrders(page)),
        page,
      };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load your orders."));
    }
  }
);

export const loadOrderDetail = createAsyncThunk(
  "orders/fetchOne",
  async (/** @type {string} */ id, { rejectWithValue }) => {
    try {
      return await ordersApi.fetchOrderById(id);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load order details."));
    }
  }
);

const initialState = {
  orders: [],
  status: "idle",
  error: null,
  pagination: null,
  detail: null,
  detailOrderId: null,
  detailStatus: "idle",
  detailError: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetail(state) {
      state.detail = null;
      state.detailOrderId = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        const { orders, pagination } = action.payload;
        state.status = "succeeded";
        state.pagination = pagination;
        state.orders = orders;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load orders.";
        if (!state.orders.length) state.orders = [];
      })

      .addCase(loadOrderDetail.pending, (state, action) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.detailOrderId = action.meta.arg;
      })
      .addCase(loadOrderDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
        state.detailOrderId = action.payload.id;
      })
      .addCase(loadOrderDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload ?? "Could not load order details.";
      });
  },
});

export const { clearOrderDetail } = ordersSlice.actions;
export default ordersSlice.reducer;
