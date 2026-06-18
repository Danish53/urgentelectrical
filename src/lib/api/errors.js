export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? 0;
    this.data = data ?? null;
  }
}

/** Flatten Laravel-style validation errors into one readable string */
export function getApiErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;

  if (typeof error === "string") return sanitizeApiErrorMessage(error, fallback);

  const data = error.data ?? error;
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flat()
      .filter(Boolean);
    if (messages.length) return sanitizeApiErrorMessage(messages.join(" "), fallback);
  }

  if (data?.message && typeof data.message === "string") {
    return sanitizeApiErrorMessage(data.message, fallback);
  }
  if (error.message && typeof error.message === "string") {
    return sanitizeApiErrorMessage(error.message, fallback);
  }

  return fallback;
}

/**
 * Hide raw PHP/server exceptions from account pages.
 * @param {string} message
 * @param {string} fallback
 */
export function sanitizeApiErrorMessage(message, fallback) {
  const text = String(message ?? "").trim();
  if (!text) return fallback;

  if (
    /syntax error|ParseError|unexpected variable|Stack trace|OrderController\.php/i.test(text)
  ) {
    return "We could not load your orders right now. Please try again in a few minutes or contact support if this continues.";
  }

  return text;
}
