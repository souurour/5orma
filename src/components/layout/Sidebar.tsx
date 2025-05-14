import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Settings,
  Bell,
  LayoutDashboard,
  AlertOctagon,
  FileText,
  BarChart3,
  Wrench,
  PanelLeftClose,
  PanelLeftOpen,
  HardDrive,
  BarChart,
  LucideIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User as UserType } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserType | null;
}

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
  roles: string[];
  badge?: number | string;
}

const Sidebar = ({ isOpen, setIsOpen, user }: SidebarProps) => {
  const location = useLocation();

  // Define sidebar items with role-based access
  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["user", "technician", "admin"],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      roles: ["user", "technician", "admin"],
    },
    {
      name: "Machines",
      path: "/machines",
      icon: HardDrive,
      roles: ["user", "technician", "admin"],
      badge: 15, // Sample count of machines
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: AlertOctagon,
      roles: ["user", "technician", "admin"],
      badge: 3, // Sample count of alerts
    },
    {
      name: "Maintenance",
      path: "/maintenance",
      icon: Wrench,
      roles: ["technician", "admin"],
    },
    {
      name: "Prediction",
      path: "/prediction",
      icon: BarChart,
      roles: ["technician", "admin"],
    },
    {
      name: "Reports",
      path: "/reports",
      icon: FileText,
      roles: ["admin"],
    },
    {
      name: "Users",
      path: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
      roles: ["user", "technician", "admin"],
      badge: 2, // Sample count of unread notifications
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["user", "technician", "admin"],
    },
  ];

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(
    (item) => user && item.roles.includes(user.role),
  );

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-gray-200 pt-4 pb-0 flex flex-col transition-transform md:translate-x-0 md:sticky md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar header */}
        <div className="px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-slate-900">
              MIC Service
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
            <div className="mt-1 inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </div>
          </div>
        )}

        {/* Links */}
        <ScrollArea className="flex-1">
          <div className="px-3 py-2">
            <nav className="space-y-1 text-sm">
              {filteredItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-gray-700 hover:bg-gray-100 group flex items-center px-3 py-2.5 rounded-md gap-3.5",
                    location.pathname === item.path &&
                      "bg-indigo-50 text-indigo-700 font-medium",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      location.pathname === item.path
                        ? "text-indigo-700"
                        : "text-gray-500 group-hover:text-gray-700",
                    )}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        location.pathname === item.path
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>

        {/* Collapse button for desktop */}
        <div className="hidden md:flex p-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            <PanelLeftOpen className="mr-2 h-4 w-4" />
            Collapse
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
