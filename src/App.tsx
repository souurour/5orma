import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/features/FeaturesPage";
import AboutPage from "./pages/about/AboutPage";
import ContactPage from "./pages/contact/ContactPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MachinesPage from "./pages/machines/MachinesPage";
import MachineDetailPage from "./pages/machines/MachineDetailPage";
import UsersPage from "./pages/admin/UsersPage";
import AlertsPage from "./pages/alerts/AlertsPage";
import CreateAlertPage from "./pages/alerts/CreateAlertPage";
import MaintenancePage from "./pages/maintenance/MaintenancePage";
import MaintenanceFormPage from "./pages/maintenance/MaintenanceFormPage";
import PredictionPage from "./pages/prediction/PredictionPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

// Protected route component that checks for authentication and role
const ProtectedRoute = ({
  children,
  allowedRoles = ["user", "technician", "admin"],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Alerts routes */}
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/alerts/new" element={<CreateAlertPage />} />

              {/* Machine routes - accessible by all users for viewing, but CRUD only for admin */}
              <Route path="/machines" element={<MachinesPage />} />
              <Route path="/machines/:id" element={<MachineDetailPage />} />

              {/* Admin only routes */}
              <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              {/* Technician and Admin routes */}
              <Route
                path="/maintenance"
                element={
                  <ProtectedRoute allowedRoles={["technician", "admin"]}>
                    <MaintenancePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maintenance/form/:machineId?"
                element={
                  <ProtectedRoute allowedRoles={["technician", "admin"]}>
                    <MaintenanceFormPage />
                  </ProtectedRoute>
                }
              />

              {/* Prediction, reports and notifications */}
              <Route path="/prediction" element={<PredictionPage />} />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
