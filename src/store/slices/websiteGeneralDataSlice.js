import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import { DEFAULT_SITE_DATA } from "@/lib/site/mapWebsiteGeneralData";
import { fetchWebsiteGeneralData } from "@/services/websiteGeneralDataApiService";

export const loadWebsiteGeneralData = createAsyncThunk(
  "websiteGeneralData/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchWebsiteGeneralData();
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load site settings."));
    }
  }
);

const initialState = {
  data: DEFAULT_SITE_DATA,
  status: "idle",
  error: null,
};

const websiteGeneralDataSlice = createSlice({
  name: "websiteGeneralData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWebsiteGeneralData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadWebsiteGeneralData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.error = null;
      })
      .addCase(loadWebsiteGeneralData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load site settings.";
        state.data = DEFAULT_SITE_DATA;
      });
  },
});

export default websiteGeneralDataSlice.reducer;
