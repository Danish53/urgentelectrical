import { slugify } from "@/lib/slugs";

/**
 * @param {import("@/services/serviceCategoriesApiService").ApiServiceCategory} api
 */
export function buildServiceCategoryFromApi(api) {
  const label = String(api.category_name ?? "").trim() || "Category";
  const slug = String(api.slug ?? "").trim() || slugify(label);
  const rawDescription = String(api.description ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
  const imageRaw = String(api.image ?? "").trim();
  let image = null;
  if (imageRaw.startsWith("http")) {
    try {
      const { pathname } = new URL(imageRaw);
      image = pathname.length > 1 ? imageRaw : null;
    } catch {
      image = null;
    }
  }

  return {
    id: api.id,
    slug,
    label,
    image,
    description: rawDescription,
    href: `/services#${slug}`,
  };
}

/**
 * @param {import("@/services/serviceCategoriesApiService").ApiServiceCategory[]} list
 */
export function buildServiceCategoriesFromApi(list) {
  return list.map(buildServiceCategoryFromApi);
}

/**
 * @param {ReturnType<typeof buildServiceCategoryFromApi>[]} categories
 */
export function buildCategoryMapById(categories) {
  return Object.fromEntries(categories.map((c) => [c.id, c]));
}

/** Filter tabs for services catalogue */
export function buildServiceCategoryFilters(categories) {
  return [
    { id: "all", label: "All services", slug: "all" },
    ...categories.map((c) => ({ id: c.slug, label: c.label, slug: c.slug })),
  ];
}
