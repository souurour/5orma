// API Configuration
export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Application Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  MACHINES: "/machines",
  MACHINE_DETAIL: (id: string) => `/machines/${id}`,
  ALERTS: "/alerts",
  CREATE_ALERT: "/alerts/new",
  MAINTENANCE: "/maintenance",
  MAINTENANCE_FORM: "/maintenance/form",
  MAINTENANCE_FORM_WITH_ID: (id: string) => `/maintenance/form/${id}`,
  PREDICTION: "/prediction",
  REPORTS: "/reports",
  NOTIFICATIONS: "/notifications",
  USERS: "/users",
  PROFILE: "/profile",
  SETTINGS: "/settings",
};

// Machine Status Options
export const MACHINE_STATUS = {
  OPERATIONAL: "operational",
  MAINTENANCE: "maintenance",
  OFFLINE: "offline",
};

// Alert Priority Options
export const ALERT_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  CRITICAL: "critical",
};

// Alert Status Options
export const ALERT_STATUS = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
};

// Maintenance Status Options
export const MAINTENANCE_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

// User Roles
export const USER_ROLES = {
  USER: "user",
  TECHNICIAN: "technician",
  ADMIN: "admin",
};

// Machine Types
export const MACHINE_TYPES = [
  "Denim Washing",
  "Laser Processing",
  "Cutting",
  "Sewing",
  "Finishing",
  "Quality Control",
];

// Date Format
export const DATE_FORMAT = "MMM d, yyyy";
export const DATE_TIME_FORMAT = "MMM d, yyyy HH:mm";

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Reporting formats
export const REPORT_FORMATS = {
  PDF: "pdf",
  EXCEL: "excel",
};
