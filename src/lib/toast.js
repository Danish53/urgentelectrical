import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/errors";

export function toastSuccess(message) {
  toast.success(message, { duration: 4000 });
}

export function toastError(error, fallback) {
  toast.error(getApiErrorMessage(error, fallback), { duration: 5000 });
}
