import { checkServiceByPostalCode } from "@/services/serviceByPostalCodeApiService";

/**
 * @param {{
 *   source?: string,
 *   serviceSlug?: string | null,
 *   postCode: string,
 * }} params
 * @returns {Promise<{ allowed: boolean, message?: string }>}
 */
export async function verifyServicePostcodeCoverage({
  source = "checkout",
  serviceSlug,
  postCode,
}) {
  const trimmed = String(postCode ?? "").trim();
  const slug = String(serviceSlug ?? "").trim();

  if (!trimmed) {
    return { allowed: false, message: "Please enter a postcode." };
  }

  if (!slug) {
    return { allowed: true };
  }

  try {
    const result = await checkServiceByPostalCode({
      source,
      serviceSlug: slug,
      postCode: trimmed,
    });

    if (result.outcome === "out_of_area") {
      return { allowed: false };
    }

    if (result.outcome === "in_area") {
      return { allowed: true };
    }

    return {
      allowed: false,
      message: result.message || "Could not verify postcode coverage.",
    };
  } catch {
    return {
      allowed: false,
      message: "Unable to verify postcode coverage. Please try again.",
    };
  }
}
