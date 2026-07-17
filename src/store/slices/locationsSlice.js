import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import { fetchLocationsPage } from "@/services/locationsApiService";

export const fetchLocations = createAsyncThunk(
  "locations/fetchPage",
  async (/** @type {{ page?: number } | undefined} */ options, { rejectWithValue }) => {
    try {
      const page = options?.page ?? 1;
      const result = await fetchLocationsPage(page);
      return { ...result, page };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load locations."));
    }
  }
);

export const loadMoreLocations = createAsyncThunk(
  "locations/loadMore",
  async (_, { getState, rejectWithValue }) => {
    const { pagination } = getState().locations;
    const currentPage = pagination?.currentPage ?? 1;
    const lastPage = pagination?.lastPage ?? 1;
    const nextPage = currentPage + 1;

    if (nextPage > lastPage) {
      return rejectWithValue("No more locations to load.");
    }

    try {
      const result = await fetchLocationsPage(nextPage);
      return { ...result, page: nextPage };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load more locations."));
    }
  }
);

const initialState = {
  locations: [],
  pagination: null,
  status: "idle",
  loadingMore: false,
  loadMoreError: null,
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    /**
     * Seed list from SSR so crawlers and first paint see real internal links.
     * @param {typeof initialState} state
     * @param {{ payload: { locations: import("@/lib/locations/parseLocationsList").LocationListItem[], pagination: import("@/lib/locations/parseLocationsList").LocationsPagination | null } }} action
     */
    hydrateLocations(state, action) {
      state.locations = action.payload.locations ?? [];
      state.pagination = action.payload.pagination ?? null;
      state.status = state.locations.length ? "succeeded" : "idle";
      state.error = null;
      state.loadMoreError = null;
      state.loadingMore = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.locations = action.payload.locations;
        state.pagination = action.payload.pagination;
        state.error = null;
        state.loadMoreError = null;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load locations.";
      })

      .addCase(loadMoreLocations.pending, (state) => {
        state.loadingMore = true;
        state.loadMoreError = null;
      })
      .addCase(loadMoreLocations.fulfilled, (state, action) => {
        state.loadingMore = false;
        state.loadMoreError = null;

        const seen = new Set(state.locations.map((item) => item.slug));
        const next = action.payload.locations.filter((item) => !seen.has(item.slug));
        state.locations.push(...next);
        state.pagination = action.payload.pagination;
      })
      .addCase(loadMoreLocations.rejected, (state, action) => {
        state.loadingMore = false;
        state.loadMoreError = action.payload ?? "Could not load more locations.";
      });
  },
});

export const { hydrateLocations } = locationsSlice.actions;
export default locationsSlice.reducer;
