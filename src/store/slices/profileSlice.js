import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiToProfileForm } from "@/lib/auth/profileMapper";
import { getApiErrorMessage } from "@/lib/api/errors";
import * as profileApi from "@/services/profileApiService";

export const loadProfile = createAsyncThunk("profile/fetch", async (_, { rejectWithValue }) => {
  try {
    const data = await profileApi.fetchProfile();
    return { raw: data, form: apiToProfileForm(data) };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error, "Could not load your profile."));
  }
});

export const saveProfile = createAsyncThunk(
  "profile/update",
  async (/** @type {import("@/lib/auth/profileMapper").ProfileFormValues} */ form, { rejectWithValue }) => {
    try {
      const data = await profileApi.updateProfile(form);
      return { raw: data, form: apiToProfileForm(data) };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not update your profile."));
    }
  }
);

const initialState = {
  form: null,
  raw: null,
  status: "idle",
  error: null,
  saving: false,
  saveError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileSaveError(state) {
      state.saveError = null;
    },
    resetProfileState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.raw = action.payload.raw;
        state.form = action.payload.form;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load profile.";
      })

      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.raw = action.payload.raw;
        state.form = action.payload.form;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? null;
      });
  },
});

export const { clearProfileSaveError, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
