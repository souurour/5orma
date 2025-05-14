import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMachines } from "@/contexts/MachineContext";
import { useAlerts } from "@/contexts/AlertContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertOctagon,
  ArrowUpRight,
  Clock,
  HardDrive,
  Wrench,
} from "lucide-react";

const DashboardPage = () => {
  const { machines, fetchMachines } = useMachines();
  const { alerts, fetchAlerts } = useAlerts();
  const { maintenance, fetchMaintenance } = useMaintenance();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetchMachines();
    fetchAlerts();
    fetchMaintenance();
    setIsClient(true);
  }, []);

  // Mock data for charts
  const availabilityData = [
    { name: "Jan", value: 92 },
    { name: "Feb", value: 89 },
    { name: "Mar", value: 93 },
    { name: "Apr", value: 87 },
    { name: "May", value: 91 },
    { name: "Jun", value: 94 },
    { name: "Jul", value: 92 },
  ];

  const performanceData = [
    { name: "Jan", value: 85 },
    { name: "Feb", value: 82 },
    { name: "Mar", value: 88 },
    { name: "Apr", value: 79 },
    { name: "May", value: 86 },
    { name: "Jun", value: 91 },
    { name: "Jul", value: 87 },
  ];

  const machineStatusData = [
    { name: "Operational", value: 15 },
    { name: "Maintenance", value: 3 },
    { name: "Offline", value: 2 },
  ];

  const alertsByPriorityData = [
    { name: "Low", value: 5 },
    { name: "Medium", value: 7 },
    { name: "Critical", value: 3 },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#E34A33"];
  const PRIORITY_COLORS = ["#84CC16", "#FBBF24", "#DC2626"];

  // Recent alerts data
  const recentAlerts = [
    {
      id: 1,
      machine: "DLM-1001",
      issue: "Temperature Exceeding Limits",
      priority: "high",
      time: "10 min ago",
    },
    {
      id: 2,
      machine: "DLM-2003",
      issue: "Pressure Drop Detected",
      priority: "medium",
      time: "25 min ago",
    },
    {
      id: 3,
      machine: "DLM-1008",
      issue: "Unexpected Vibration",
      priority: "low",
      time: "1 hour ago",
    },
    {
      id: 4,
      machine: "DLM-3002",
      issue: "Power Fluctuation",
      priority: "medium",
      time: "3 hours ago",
    },
  ];

  // Upcoming maintenance data
  const upcomingMaintenance = [
    {
      id: 1,
      machine: "DLM-2003",
      type: "Regular Service",
      scheduled: "Tomorrow, 10:00 AM",
    },
    {
      id: 2,
      machine: "DLM-1005",
      type: "Belt Replacement",
      scheduled: "Aug 12, 2023",
    },
    {
      id: 3,
      machine: "DLM-3001",
      type: "Calibration",
      scheduled: "Aug 15, 2023",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your denim manufacturing operations
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/reports">Export Report</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/alerts/new">Submit Alert</Link>
          </Button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-blue-100">
                <HardDrive className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Machines
                </p>
                <h3 className="text-2xl font-bold">
                  20
                  <span className="ml-2 text-sm font-medium text-green-600">
                    <ArrowUpRight className="inline h-4 w-4" /> +2
                  </span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-yellow-100">
                <AlertOctagon className="h-5 w-5 text-yellow-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Alerts
                </p>
                <h3 className="text-2xl font-bold">
                  15
                  <span className="ml-2 text-sm font-medium text-red-600">
                    <ArrowUpRight className="inline h-4 w-4" /> +3
                  </span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-indigo-100">
                <Wrench className="h-5 w-5 text-indigo-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Maintenance Today
                </p>
                <h3 className="text-2xl font-bold">
                  4
                  <span className="ml-2 text-sm font-medium text-green-600">
                    <Clock className="inline h-4 w-4" /> 2 Completed
                  </span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-green-100">
                <svg
                  className="h-5 w-5 text-green-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Overall OEE
                </p>
                <h3 className="text-2xl font-bold">
                  87%
                  <span className="ml-2 text-sm font-medium text-green-600">
                    <ArrowUpRight className="inline h-4 w-4" /> +2.5%
                  </span>
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Machine Availability</CardTitle>
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={availabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[75, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Availability"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isClient && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Performance"]}
                  />
                  <Bar dataKey="value" fill="#4F46E5" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Machine Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isClient && (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={machineStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {machineStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Machines"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Alerts by Priority</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isClient && (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={alertsByPriorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {alertsByPriorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Alerts"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent alerts and upcoming maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Alerts</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/alerts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${
                      alert.priority === "high"
                        ? "bg-red-500"
                        : alert.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">
                      {alert.machine}: {alert.issue}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                  <Link
                    to={`/alerts`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Upcoming Maintenance</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/maintenance">Schedule</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMaintenance.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-indigo-700" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{item.type}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.machine} - {item.scheduled}
                    </p>
                  </div>
                  <Link
                    to={`/maintenance`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* External Dashboards (Qlik Sense Integration) */}
      <Card>
        <CardHeader>
          <CardTitle>External Dashboards</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="performance">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="prediction">Prediction</TabsTrigger>
            </TabsList>
            <TabsContent value="performance" className="m-0">
              <div className="p-6">
                <div className="border rounded-lg h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 mx-auto text-indigo-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">
                      Performance Dashboard (Qlik Sense)
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      This embedded dashboard shows real-time performance
                      metrics for all machines
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="availability" className="m-0">
              <div className="p-6">
                <div className="border rounded-lg h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 mx-auto text-indigo-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">
                      Availability Dashboard (Qlik Sense)
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      This embedded dashboard tracks machine availability and
                      uptime percentages
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="maintenance" className="m-0">
              <div className="p-6">
                <div className="border rounded-lg h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 mx-auto text-indigo-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">
                      Maintenance Dashboard (Qlik Sense)
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      This embedded dashboard shows maintenance history and
                      upcoming schedules
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="prediction" className="m-0">
              <div className="p-6">
                <div className="border rounded-lg h-[500px] flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <svg
                      className="h-16 w-16 mx-auto text-indigo-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700">
                      Prediction Dashboard (Qlik Sense)
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      This embedded dashboard shows predictive maintenance
                      analytics and forecasts
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
