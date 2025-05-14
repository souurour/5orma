import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useMachines } from "@/contexts/MachineContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  SlidersHorizontal,
  PlusCircle,
  ClipboardList,
} from "lucide-react";
import { formatDate, getMaintenanceStatusColor } from "@/lib/utils";
import { MAINTENANCE_STATUS } from "@/config/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MaintenancePage = () => {
  const { user } = useAuth();
  const {
    maintenance,
    userMaintenance,
    fetchMaintenance,
    fetchUserMaintenance,
  } = useMaintenance();
  const { machines, fetchMachines } = useMachines();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeframeFilter, setTimeframeFilter] = useState("all");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetchMaintenance();
    if (user?.role === "technician") {
      fetchUserMaintenance();
    }
    fetchMachines();
    setIsClient(true);
  }, []);

  // Get maintenance records based on user role
  const getMaintenanceRecords = () => {
    if (user?.role === "technician") {
      return userMaintenance;
    }
    return maintenance;
  };

  // Filter maintenance records based on search and filters
  const filteredMaintenance = getMaintenanceRecords().filter((record) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      record.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.problemDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (record.notes &&
        record.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    // Timeframe filter
    let matchesTimeframe = true;
    const recordDate = new Date(record.startTime);
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    if (timeframeFilter === "today") {
      matchesTimeframe = recordDate.toDateString() === today.toDateString();
    } else if (timeframeFilter === "week") {
      matchesTimeframe = recordDate >= weekAgo;
    } else if (timeframeFilter === "month") {
      matchesTimeframe = recordDate >= monthAgo;
    }

    return matchesSearch && matchesStatus && matchesTimeframe;
  });

  // Calculate maintenance statistics
  const totalMaintenance = getMaintenanceRecords().length;
  const completedMaintenance = getMaintenanceRecords().filter(
    (record) => record.status === "completed",
  ).length;
  const pendingMaintenance = getMaintenanceRecords().filter(
    (record) => record.status === "pending",
  ).length;
  const inProgressMaintenance = getMaintenanceRecords().filter(
    (record) => record.status === "in-progress",
  ).length;

  // Chart data for maintenance by machine
  const maintenanceByMachine = machines
    .map((machine) => {
      const count = getMaintenanceRecords().filter(
        (record) => record.machineId === machine.id,
      ).length;
      return {
        machine: machine.name,
        count: count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 machines by maintenance count

  // Chart data for maintenance by status
  const maintenanceByStatus = [
    { status: "Completed", value: completedMaintenance },
    { status: "In Progress", value: inProgressMaintenance },
    { status: "Pending", value: pendingMaintenance },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">
            Track and manage machine maintenance activities
          </p>
        </div>

        {/* Only show create maintenance button for technicians and admins */}
        {user && (user.role === "technician" || user.role === "admin") && (
          <Button asChild>
            <Link to="/maintenance/form">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Maintenance
            </Link>
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Maintenance
                </p>
                <p className="text-2xl font-bold">{totalMaintenance}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <ClipboardList className="h-4 w-4 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">{completedMaintenance}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Progress
                </p>
                <p className="text-2xl font-bold">{inProgressMaintenance}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-yellow-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold">{pendingMaintenance}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Machine</CardTitle>
            <CardDescription>
              Top 5 machines by maintenance count
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceByMachine}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="machine" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#4F46E5"
                    name="Maintenance Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Status</CardTitle>
            <CardDescription>
              Distribution of maintenance records by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={maintenanceByStatus}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance by machine or description..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={MAINTENANCE_STATUS.PENDING}>
                Pending
              </SelectItem>
              <SelectItem value={MAINTENANCE_STATUS.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={MAINTENANCE_STATUS.COMPLETED}>
                Completed
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframeFilter} onValueChange={setTimeframeFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Timeframe</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>Problem Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>End Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaintenance.length > 0 ? (
              filteredMaintenance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.machineName}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">
                      {record.problemDescription}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`w-fit ${getMaintenanceStatusColor(record.status)}`}
                    >
                      <span className="capitalize">{record.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{record.technician.name}</TableCell>
                  <TableCell>
                    {formatDate(record.startTime, "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {record.endTime
                      ? formatDate(record.endTime, "MMM d, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/maintenance/${record.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No maintenance records found.{" "}
                  {(user?.role === "technician" || user?.role === "admin") && (
                    <Link
                      to="/maintenance/form"
                      className="text-blue-600 hover:underline"
                    >
                      Create a new maintenance record
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaintenancePage;
