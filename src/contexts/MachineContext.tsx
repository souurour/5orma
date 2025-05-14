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

// Define Machine types
export interface Machine {
  id: string;
  name: string;
  serialNumber: string;
  model: string;
  type: string;
  location: string;
  status: "operational" | "maintenance" | "offline";
  lastMaintenance: string | null;
  nextMaintenance: string | null;
  metrics: {
    availability: number;
    performance: number;
    quality: number;
    oee: number;
  };
  installationDate: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateMachineInput {
  name: string;
  serialNumber: string;
  model: string;
  type: string;
  location: string;
  installationDate: string;
  imageUrl?: string;
}

interface UpdateMachineInput {
  name?: string;
  serialNumber?: string;
  model?: string;
  type?: string;
  location?: string;
  status?: "operational" | "maintenance" | "offline";
  installationDate?: string;
  imageUrl?: string;
}

// Define Machine Context type
interface MachineContextType {
  machines: Machine[];
  selectedMachine: Machine | null;
  isLoading: boolean;
  error: string | null;
  fetchMachines: () => Promise<void>;
  fetchMachine: (id: string) => Promise<void>;
  createMachine: (machine: CreateMachineInput) => Promise<void>;
  updateMachine: (id: string, machine: UpdateMachineInput) => Promise<void>;
  deleteMachine: (id: string) => Promise<void>;
  clearSelectedMachine: () => void;
  clearError: () => void;
}

// Create context
const MachineContext = createContext<MachineContextType | undefined>(undefined);

// Provider component
export const MachineProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load machines when component mounts if user is authenticated
  useEffect(() => {
    if (user && token) {
      fetchMachines();
    }
  }, [user, token]);

  // Fetch all machines
  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/machines`);
      setMachines(res.data);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch machines.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single machine
  const fetchMachine = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await api.get(`${API_URL}/machines/${id}`);
      setSelectedMachine(res.data);
      setError(null);
      return res.data;
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Failed to fetch machine details.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new machine
  const createMachine = async (machineData: CreateMachineInput) => {
    try {
      setIsLoading(true);
      const res = await api.post(`${API_URL}/machines`, machineData);

      // Update machines state
      setMachines((prevMachines) => [...prevMachines, res.data]);

      // Show success toast
      toast({
        title: "Machine Created",
        description: "The machine has been added successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create machine.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a machine
  const updateMachine = async (id: string, machineData: UpdateMachineInput) => {
    try {
      setIsLoading(true);
      const res = await api.put(`${API_URL}/machines/${id}`, machineData);

      // Update machines in state
      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine.id === id ? { ...machine, ...res.data } : machine,
        ),
      );

      // Update selected machine if it's the one being edited
      if (selectedMachine && selectedMachine.id === id) {
        setSelectedMachine({ ...selectedMachine, ...res.data });
      }

      // Show success toast
      toast({
        title: "Machine Updated",
        description: "The machine has been updated successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update machine.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a machine
  const deleteMachine = async (id: string) => {
    try {
      setIsLoading(true);
      await api.delete(`${API_URL}/machines/${id}`);

      // Update machines state
      setMachines((prevMachines) =>
        prevMachines.filter((machine) => machine.id !== id),
      );

      // Clear selected machine if it's the one being deleted
      if (selectedMachine && selectedMachine.id === id) {
        setSelectedMachine(null);
      }

      // Show success toast
      toast({
        title: "Machine Deleted",
        description: "The machine has been deleted successfully.",
        variant: "default",
      });

      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to delete machine.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear selected machine
  const clearSelectedMachine = () => {
    setSelectedMachine(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <MachineContext.Provider
      value={{
        machines,
        selectedMachine,
        isLoading,
        error,
        fetchMachines,
        fetchMachine,
        createMachine,
        updateMachine,
        deleteMachine,
        clearSelectedMachine,
        clearError,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
};

// Hook to use the machine context
export const useMachines = () => {
  const context = useContext(MachineContext);
  if (context === undefined) {
    throw new Error("useMachines must be used within a MachineProvider");
  }
  return context;
};
