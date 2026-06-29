import { cache } from "react";
import { fetchLocationBySlug } from "@/services/locationsApiService";
import { fetchPageBySlug } from "@/services/pagesApiService";
import { fetchPolicyBySlug } from "@/services/policyApiService";

/** Dedupe CMS reads within a single server request (metadata + page). */
export const getPolicyBySlug = cache(fetchPolicyBySlug);
export const getPageBySlug = cache(fetchPageBySlug);
export const getLocationBySlug = cache(fetchLocationBySlug);
