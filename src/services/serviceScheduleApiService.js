import { GET_SERVICE_SCHEDULE_PROXY } from "@/constants/serviceScheduleApi";
import { formatScheduleRequestDate, isNoSlotsScheduleMessage } from "@/lib/schedules";
import { ApiError } from "@/lib/api/errors";
import { getAuthToken } from "@/lib/auth/tokenStorage";

/**
 * POST /services/get-service-schedule
 * @param {number | string} serviceId
 * @param {Date | string} selectedDate
 */
export async function fetchServiceSchedule(serviceId, selectedDate) {
  if (!serviceId || !selectedDate) {
    throw new ApiError("Service and date are required.", { status: 0 });
  }

  const apiDate = formatScheduleRequestDate(selectedDate);
  if (!apiDate) {
    throw new ApiError("A valid date is required.", { status: 0 });
  }

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(GET_SERVICE_SCHEDULE_PROXY, {
      method: "POST",
      headers,
      body: JSON.stringify({
        service_id: Number(serviceId),
        selected_date: apiDate,
      }),
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", {
      status: 0,
    });
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    const message =
      data?.message ||
      (data?.errors && typeof data.errors === "object"
        ? Object.values(data.errors).flat().filter(Boolean).join(" ")
        : null) ||
      `Request failed (${response.status})`;

    if (isNoSlotsScheduleMessage(message) || response.status === 404) {
      return { data: { schedule: [] } };
    }

    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}
