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

  if (typeof error === "string") return error;

  const data = error.data ?? error;
  if (data?.errors && typeof data.errors === "object") {
    const messages = Object.values(data.errors)
      .flat()
      .filter(Boolean);
    if (messages.length) return messages.join(" ");
  }

  if (data?.message && typeof data.message === "string") return data.message;
  if (error.message && typeof error.message === "string") return error.message;

  return fallback;
}
