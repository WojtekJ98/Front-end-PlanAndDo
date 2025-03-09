import { toast } from "react-toastify";

export function useToast() {
  return {
    success: (message: string) => toast.success(message),
    errorToast: (message: string) => toast.error(message),
    info: (message: string) => toast.info(message),
    warning: (message: string) => toast.warning(message),
  };
}
