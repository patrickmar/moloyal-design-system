import { toast } from "sonner";
import { CheckCircle, AlertCircle, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface MoLoyalToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const toastStyles = {
  success: "text-green-600",
  error: "text-red-600",
  info: "text-blue-600",
  warning: "text-yellow-600",
};

export const showMoLoyalToast = ({
  title,
  description,
  type = "info",
  duration = 4000,
}: MoLoyalToastOptions) => {
  const Icon = toastIcons[type];

  toast(title, {
    description,
    duration,
    icon: <Icon className={`h-4 w-4 ${toastStyles[type]}`} />,
    classNames: {
      toast: "bg-card border-border shadow-lg",
      title: "text-foreground font-medium",
      description: "text-muted-foreground",
      icon: "mr-2",
    },
  });
};

// Preset toast functions for common use cases
export const MoLoyalToast = {
  success: (title: string, description?: string) =>
    showMoLoyalToast({ title, description, type: "success" }),

  error: (title: string, description?: string) =>
    showMoLoyalToast({ title, description, type: "error" }),

  info: (title: string, description?: string) =>
    showMoLoyalToast({ title, description, type: "info" }),

  warning: (title: string, description?: string) =>
    showMoLoyalToast({ title, description, type: "warning" }),

  goalReached: (goalName: string) =>
    showMoLoyalToast({
      title: "Goal Achieved! 🎉",
      description: `Congratulations! You've reached your ${goalName} goal.`,
      type: "success",
      duration: 6000,
    }),

  allocationReceived: (amount: number) =>
    showMoLoyalToast({
      title: "Monthly Allocation Received",
      description: `₦${amount.toLocaleString()} has been credited to your account.`,
      type: "success",
    }),

  paymentSuccessful: (amount: number, description: string) =>
    showMoLoyalToast({
      title: "Payment Successful",
      description: `₦${amount.toLocaleString()} - ${description}`,
      type: "success",
    }),

  securityAlert: (message: string) =>
    showMoLoyalToast({
      title: "Security Alert",
      description: message,
      type: "warning",
      duration: 8000,
    }),
};

export type { MoLoyalToastOptions };
