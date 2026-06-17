import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApiErrorMessage } from "@/lib/api/errors";
import { apiRecordToSavedSite, formToApiPayload } from "@/lib/sites/siteApiMapper";
import * as siteApi from "@/services/siteAddressesApiService";

/**
 * @param {number} page
 */
async function loadSitesFromApi(page = 1) {
  const { sites, pagination } = await siteApi.fetchSiteAddresses(page);
  const mapped = sites.map(apiRecordToSavedSite).sort((a, b) => Number(b.primary) - Number(a.primary));
  return { sites: mapped, pagination };
}

export const fetchSites = createAsyncThunk(
  "sites/fetchAll",
  async (/** @type {{ page?: number } | undefined} */ options, { rejectWithValue }) => {
    try {
      const page = options?.page ?? 1;
      return { ...(await loadSitesFromApi(page)), page };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load your saved sites."));
    }
  }
);

export const fetchSiteById = createAsyncThunk(
  "sites/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const row = await siteApi.fetchSiteAddressById(id);
      return apiRecordToSavedSite(row);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not load site details."));
    }
  }
);

export const createSite = createAsyncThunk(
  "sites/create",
  async (/** @type {import("@/lib/sites/siteForm").SiteFormValues} */ form, { rejectWithValue, getState }) => {
    try {
      const created = await siteApi.createSiteAddress(formToApiPayload(form));
      const createdSite =
        created && typeof created === "object" && created.id != null
          ? apiRecordToSavedSite(/** @type {Record<string, unknown>} */ (created))
          : null;
      const page = getState().sites.pagination?.currentPage ?? 1;
      let result = await loadSitesFromApi(page);

      if (!result.sites.length && createdSite) {
        result = {
          sites: [createdSite],
          pagination: result.pagination,
        };
      } else if (createdSite) {
        const idx = result.sites.findIndex((s) => String(s.id) === String(createdSite.id));
        if (idx === -1) {
          result = { ...result, sites: [createdSite, ...result.sites] };
        } else {
          const sites = [...result.sites];
          sites[idx] = createdSite;
          result = { ...result, sites };
        }
      }

      return { ...result, page, createdSite };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not add this site."));
    }
  }
);

export const updateSite = createAsyncThunk(
  "sites/update",
  async (
    /** @type {{ id: string, form: import("@/lib/sites/siteForm").SiteFormValues }} */ { id, form },
    { rejectWithValue, getState }
  ) => {
    try {
      await siteApi.updateSiteAddress(id, formToApiPayload(form));
      const page = getState().sites.pagination?.currentPage ?? 1;
      return await loadSitesFromApi(page);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not update this site."));
    }
  }
);

export const deleteSite = createAsyncThunk(
  "sites/delete",
  async (/** @type {string} */ id, { rejectWithValue, getState }) => {
    try {
      await siteApi.deleteSiteAddress(id);
      const page = getState().sites.pagination?.currentPage ?? 1;
      return await loadSitesFromApi(page);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Could not delete this site."));
    }
  }
);

const initialState = {
  sites: [],
  status: "idle",
  error: null,
  pagination: null,
  saving: false,
  saveError: null,
  detailSite: null,
  detailStatus: "idle",
  detailError: null,
};

const sitesSlice = createSlice({
  name: "sites",
  initialState,
  reducers: {
    clearSitesSaveError(state) {
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.sites = action.payload.sites;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Could not load sites.";
        if (!state.sites.length) state.sites = [];
      })

      .addCase(fetchSiteById.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
      })
      .addCase(fetchSiteById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detailSite = action.payload;
        const idx = state.sites.findIndex((s) => s.id === action.payload.id);
        if (idx >= 0) {
          state.sites[idx] = action.payload;
        } else {
          state.sites.push(action.payload);
        }
      })
      .addCase(fetchSiteById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload ?? null;
      })

      .addCase(createSite.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.saving = false;
        state.sites = action.payload.sites;
        state.pagination = action.payload.pagination;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? null;
      })

      .addCase(updateSite.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(updateSite.fulfilled, (state, action) => {
        state.saving = false;
        state.sites = action.payload.sites;
        state.pagination = action.payload.pagination;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updateSite.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? null;
      })

      .addCase(deleteSite.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(deleteSite.fulfilled, (state, action) => {
        state.saving = false;
        state.sites = action.payload.sites;
        state.pagination = action.payload.pagination;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteSite.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? null;
      });
  },
});

export const { clearSitesSaveError } = sitesSlice.actions;
export default sitesSlice.reducer;
