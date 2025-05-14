import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/services/api";
import { API_URL } from "@/config/constants";

// Define User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "technician" | "admin";
  avatar?: string;
}

// Define Auth Context type
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          // Set authorization header in our mock API
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Using our mock API service instead of axios directly
          const res = await api.get(`${API_URL}/auth/me`);
          setUser(res.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Failed to load user:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post(`${API_URL}/auth/login`, { email, password });

      // Save token to localStorage and state
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      // Set the authorization header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const res = await api.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

      // Save token to localStorage and state
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      // Set the authorization header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    // Clear the authorization header
    delete api.defaults.headers.common["Authorization"];
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
