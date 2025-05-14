import {
  LayoutDashboard,
  ImagePlus,
  FileText,
  HelpCircle,
  Home,
} from "lucide-react";

export const navigationItems = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Classification",
    path: "/classification",
    icon: ImagePlus,
  },
  {
    name: "Results",
    path: "/results",
    icon: FileText,
  },
  {
    name: "About",
    path: "/about",
    icon: HelpCircle,
  },
];
