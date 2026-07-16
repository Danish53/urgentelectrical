import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errors";

/** Strip mailto: so toasts never open the desktop mail client. */
function sanitizeToastMessage(message) {
  return String(message ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/mailto:\S+/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function toastSuccess(message) {
  const safe = sanitizeToastMessage(message);
  toast.success(safe || "Success", { duration: 4000 });
}

export function toastError(error, fallback) {
  const raw = getApiErrorMessage(error, fallback);
  toast.error(sanitizeToastMessage(raw) || fallback || "Something went wrong.", { duration: 5000 });
}
