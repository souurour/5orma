import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/services/api";
import { API_URL } from "@/config/constants";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/use-toast";

// Define Alert types
export interface Alert {
  id: string;
  title: string;
  description: string;
  machineId: string;
  machineName: string;
  priority: "low" | "medium" | "critical";
  status: "pending" | "assigned" | "in-progress" | "resolved";
  createdBy: {
    id: string;
    name: string;
  };
  assignedTo?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CreateAlertInput {
  title: string;
  description: string;
  machineId: string;
  priority: "low" | "medium" | "critical";
}

interface UpdateAlertInput {
  status?: "pending" | "assigned" | "in-progress" | "resolved";
  assignedToId?: string;
}

// Define Alert Context type
interface AlertContextType {
  alerts: Alert[];
  userAlerts: Alert[];
  isLoading: boolean;
  error: string | null;
  createAlert: (alert: CreateAlertInput) => Promise<void>;
  updateAlert: (id: string, alert: UpdateAlertInput) => Promise<void>;
  assignAlert: (id: string, technicianId: string) => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchUserAlerts: () => Promise<void>;
  clearError: () => void;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Provider component
export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [userAlerts, setUserAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load alerts when component mounts if user is authenticated
  useEffect(() => {
    if (user && token) {
      fetchAlerts();
      fetchUserAlerts();
    }
  }, [user, token]);

  // Fetch all alerts (admin gets all, technicians get assigned, users get created by them)
  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/alerts`);
      setAlerts(res.data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch alerts specific to the current user
  const fetchUserAlerts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/alerts/user`);
      setUserAlerts(res.data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch your alerts.");
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new alert
  const createAlert = async (alertData: CreateAlertInput) => {
    try {
      setIsLoading(true);
      const res = await api.post(`${API_URL}/alerts`, alertData);

      // Update alerts state
      setAlerts((prevAlerts) => [...prevAlerts, res.data]);
      setUserAlerts((prevAlerts) => [...prevAlerts, res.data]);

      // Show success toast
      toast({
        title: "Alert Created",
        description: "Your alert has been submitted successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create alert.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an alert
  const updateAlert = async (id: string, alertData: UpdateAlertInput) => {
    try {
      setIsLoading(true);
      const res = await api.put(`${API_URL}/alerts/${id}`, alertData);

      // Update alerts in state
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === id ? { ...alert, ...res.data } : alert,
        ),
      );
      setUserAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === id ? { ...alert, ...res.data } : alert,
        ),
      );

      // Show success toast
      toast({
        title: "Alert Updated",
        description: "The alert has been updated successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update alert.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Assign alert to a technician
  const assignAlert = async (id: string, technicianId: string) => {
    try {
      setIsLoading(true);
      const res = await api.put(`${API_URL}/alerts/${id}/assign`, {
        technicianId,
      });

      // Update alerts in state
      setAlerts((prevAlerts) =>
        prevAlerts.map((alert) =>
          alert.id === id ? { ...alert, ...res.data } : alert,
        ),
      );

      // Show success toast
      toast({
        title: "Alert Assigned",
        description: "The alert has been assigned successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to assign alert.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        userAlerts,
        isLoading,
        error,
        createAlert,
        updateAlert,
        assignAlert,
        fetchAlerts,
        fetchUserAlerts,
        clearError,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

// Hook to use the alert context
export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};
