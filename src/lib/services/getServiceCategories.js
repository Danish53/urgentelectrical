import {
  buildCategoryMapById,
  buildServiceCategoriesFromApi,
} from "@/lib/services/buildServiceCategory";
import { fetchServiceCategories } from "@/services/serviceCategoriesApiService";
import { cache } from "react";

/**
 * @returns {Promise<{ categories: ReturnType<typeof buildServiceCategoriesFromApi>, categoryMap: ReturnType<typeof buildCategoryMapById> }>}
 */
export const getServiceCategories = cache(async function getServiceCategories() {
  try {
    const apiList = await fetchServiceCategories();
    const categories = buildServiceCategoriesFromApi(apiList);
    return { categories, categoryMap: buildCategoryMapById(categories) };
  } catch {
    return { categories: [], categoryMap: {} };
  }
});
