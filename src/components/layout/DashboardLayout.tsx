import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import DashboardNavbar from "./DashboardNavbar";
import { AlertProvider } from "@/contexts/AlertContext";
import { MachineProvider } from "@/contexts/MachineContext";
import { MaintenanceProvider } from "@/contexts/MaintenanceContext";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AlertProvider>
      <MachineProvider>
        <MaintenanceProvider>
          <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for larger screens and overlay for mobile */}
            <Sidebar
              isOpen={sidebarOpen}
              setIsOpen={setSidebarOpen}
              user={user}
            />

            <div className="flex w-full flex-1 flex-col">
              <DashboardNavbar
                onMenuButtonClick={() => setSidebarOpen(true)}
                user={user}
              />

              <main className="flex-1 px-4 py-6 md:px-8">
                <Outlet />
              </main>
            </div>
          </div>
        </MaintenanceProvider>
      </MachineProvider>
    </AlertProvider>
  );
};

export default DashboardLayout;
