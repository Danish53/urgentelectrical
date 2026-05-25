import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import {
  buildBookableServicesFromApi,
  toBookingOptions,
  toFeaturedCard,
} from "@/lib/services/buildBookableService";
import { fetchServicesList } from "@/services/servicesApiService";

export const fetchServices = createAsyncThunk(
  "services/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { services: apiList, meta, links } = await fetchServicesList();
      const bookable = buildBookableServicesFromApi(apiList);
      return {
        raw: apiList,
        meta,
        links,
        bookable,
        bookingOptions: toBookingOptions(bookable),
        featured: bookable.map(toFeaturedCard),
      };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load services."));
    }
  }
);

const initialState = {
  raw: [],
  meta: null,
  links: null,
  bookable: [],
  bookingOptions: [],
  featured: [],
  status: "idle",
  error: null,
  source: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.raw = action.payload.raw;
        state.meta = action.payload.meta;
        state.links = action.payload.links;
        state.bookable = action.payload.bookable;
        state.bookingOptions = action.payload.bookingOptions;
        state.featured = action.payload.featured;
        state.source = "api";
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.bookable = [];
        state.bookingOptions = [];
        state.featured = [];
        state.source = null;
      });
  },
});

export default servicesSlice.reducer;
