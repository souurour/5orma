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

// Define Maintenance types
export interface Maintenance {
  id: string;
  machineId: string;
  machineName: string;
  problemDescription: string;
  startTime: string;
  endTime: string | null;
  status: "pending" | "in-progress" | "completed";
  technician: {
    id: string;
    name: string;
  };
  notes?: string;
  partsReplaced?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateMaintenanceInput {
  machineId: string;
  problemDescription: string;
  startTime: string;
  status: "pending" | "in-progress" | "completed";
  notes?: string;
  partsReplaced?: string;
}

interface UpdateMaintenanceInput {
  problemDescription?: string;
  startTime?: string;
  endTime?: string;
  status?: "pending" | "in-progress" | "completed";
  notes?: string;
  partsReplaced?: string;
}

// Define Maintenance Context type
interface MaintenanceContextType {
  maintenance: Maintenance[];
  userMaintenance: Maintenance[];
  selectedMaintenance: Maintenance | null;
  isLoading: boolean;
  error: string | null;
  fetchMaintenance: () => Promise<void>;
  fetchUserMaintenance: () => Promise<void>;
  fetchMaintenanceById: (id: string) => Promise<void>;
  createMaintenance: (maintenance: CreateMaintenanceInput) => Promise<void>;
  updateMaintenance: (
    id: string,
    maintenance: UpdateMaintenanceInput,
  ) => Promise<void>;
  completeMaintenance: (id: string, endTime: string) => Promise<void>;
  clearSelectedMaintenance: () => void;
  clearError: () => void;
}

// Create context
const MaintenanceContext = createContext<MaintenanceContextType | undefined>(
  undefined,
);

// Provider component
export const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [userMaintenance, setUserMaintenance] = useState<Maintenance[]>([]);
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load maintenance data when component mounts if user is authenticated
  useEffect(() => {
    if (user && token) {
      fetchMaintenance();
      if (user.role === "technician") {
        fetchUserMaintenance();
      }
    }
  }, [user, token]);

  // Fetch all maintenance records
  const fetchMaintenance = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/maintenance`);
      setMaintenance(res.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to fetch maintenance records.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch maintenance records for current technician
  const fetchUserMaintenance = async () => {
    if (!user || user.role !== "technician") return;

    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/maintenance/technician`);
      setUserMaintenance(res.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to fetch your maintenance records.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single maintenance record
  const fetchMaintenanceById = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/maintenance/${id}`);
      setSelectedMaintenance(res.data);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to fetch maintenance details.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new maintenance record
  const createMaintenance = async (maintenanceData: CreateMaintenanceInput) => {
    try {
      setIsLoading(true);
      const res = await api.post(`${API_URL}/maintenance`, maintenanceData);

      // Update maintenance state
      setMaintenance((prevMaintenance) => [...prevMaintenance, res.data]);

      if (user?.role === "technician") {
        setUserMaintenance((prevMaintenance) => [...prevMaintenance, res.data]);
      }

      // Show success toast
      toast({
        title: "Maintenance Record Created",
        description: "The maintenance record has been created successfully.",
        variant: "default",
      });

      setError(null);
      return res.data;
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to create maintenance record.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a maintenance record
  const updateMaintenance = async (
    id: string,
    maintenanceData: UpdateMaintenanceInput,
  ) => {
    try {
      setIsLoading(true);
      const res = await api.put(
        `${API_URL}/maintenance/${id}`,
        maintenanceData,
      );

      // Update maintenance in state
      setMaintenance((prevMaintenance) =>
        prevMaintenance.map((record) =>
          record.id === id ? { ...record, ...res.data } : record,
        ),
      );

      // Update user maintenance if applicable
      if (user?.role === "technician") {
        setUserMaintenance((prevMaintenance) =>
          prevMaintenance.map((record) =>
            record.id === id ? { ...record, ...res.data } : record,
          ),
        );
      }

      // Update selected maintenance if it's the one being edited
      if (selectedMaintenance && selectedMaintenance.id === id) {
        setSelectedMaintenance({ ...selectedMaintenance, ...res.data });
      }

      // Show success toast
      toast({
        title: "Maintenance Record Updated",
        description: "The maintenance record has been updated successfully.",
        variant: "default",
      });

      setError(null);
      return res.data;
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to update maintenance record.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a maintenance record
  const completeMaintenance = async (id: string, endTime: string) => {
    try {
      setIsLoading(true);
      const res = await api.put(`${API_URL}/maintenance/${id}/complete`, {
        endTime,
        status: "completed",
      });

      // Update maintenance in state
      setMaintenance((prevMaintenance) =>
        prevMaintenance.map((record) =>
          record.id === id ? { ...record, ...res.data } : record,
        ),
      );

      // Update user maintenance if applicable
      if (user?.role === "technician") {
        setUserMaintenance((prevMaintenance) =>
          prevMaintenance.map((record) =>
            record.id === id ? { ...record, ...res.data } : record,
          ),
        );
      }

      // Update selected maintenance if it's the one being completed
      if (selectedMaintenance && selectedMaintenance.id === id) {
        setSelectedMaintenance({ ...selectedMaintenance, ...res.data });
      }

      // Show success toast
      toast({
        title: "Maintenance Completed",
        description: "The maintenance record has been marked as completed.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Failed to complete maintenance record.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selected maintenance
  const clearSelectedMaintenance = () => {
    setSelectedMaintenance(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        maintenance,
        userMaintenance,
        selectedMaintenance,
        isLoading,
        error,
        fetchMaintenance,
        fetchUserMaintenance,
        fetchMaintenanceById,
        createMaintenance,
        updateMaintenance,
        completeMaintenance,
        clearSelectedMaintenance,
        clearError,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

// Hook to use the maintenance context
export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error("useMaintenance must be used within a MaintenanceProvider");
  }
  return context;
};
