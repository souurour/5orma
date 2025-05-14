import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import {
  MACHINE_STATUS,
  ALERT_PRIORITY,
  ALERT_STATUS,
  MAINTENANCE_STATUS,
} from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date with specified format string
export function formatDate(date: string | Date, formatStr: string = "PPP") {
  return format(new Date(date), formatStr);
}

// Get status badge color based on machine status
export function getMachineStatusColor(status: string) {
  switch (status) {
    case MACHINE_STATUS.OPERATIONAL:
      return "bg-green-100 text-green-800";
    case MACHINE_STATUS.MAINTENANCE:
      return "bg-yellow-100 text-yellow-800";
    case MACHINE_STATUS.OFFLINE:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Get status badge color based on alert priority
export function getAlertPriorityColor(priority: string) {
  switch (priority) {
    case ALERT_PRIORITY.LOW:
      return "bg-green-100 text-green-800";
    case ALERT_PRIORITY.MEDIUM:
      return "bg-yellow-100 text-yellow-800";
    case ALERT_PRIORITY.CRITICAL:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Get status badge color based on alert status
export function getAlertStatusColor(status: string) {
  switch (status) {
    case ALERT_STATUS.PENDING:
      return "bg-gray-100 text-gray-800";
    case ALERT_STATUS.ASSIGNED:
      return "bg-blue-100 text-blue-800";
    case ALERT_STATUS.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case ALERT_STATUS.RESOLVED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Get status badge color based on maintenance status
export function getMaintenanceStatusColor(status: string) {
  switch (status) {
    case MAINTENANCE_STATUS.PENDING:
      return "bg-gray-100 text-gray-800";
    case MAINTENANCE_STATUS.IN_PROGRESS:
      return "bg-yellow-100 text-yellow-800";
    case MAINTENANCE_STATUS.COMPLETED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Truncate string with ellipsis
export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Calculate percentage change
export function calculatePercentChange(
  current: number,
  previous: number,
): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Format number with commas as thousands separators
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Random ID generator
export function generateId(length: number = 6): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
