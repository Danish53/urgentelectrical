import {
  buildCategoryMapById,
  buildServiceCategoriesFromApi,
} from "@/lib/services/buildServiceCategory";
import { fetchServiceCategories } from "@/services/serviceCategoriesApiService";

/**
 * @returns {Promise<{ categories: ReturnType<typeof buildServiceCategoriesFromApi>, categoryMap: ReturnType<typeof buildCategoryMapById> }>}
 */
export async function getServiceCategories() {
  try {
    const apiList = await fetchServiceCategories();
    const categories = buildServiceCategoriesFromApi(apiList);
    return { categories, categoryMap: buildCategoryMapById(categories) };
  } catch {
    return { categories: [], categoryMap: {} };
  }
}
