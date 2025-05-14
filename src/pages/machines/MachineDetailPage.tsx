import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMachines } from "@/contexts/MachineContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAlerts } from "@/contexts/AlertContext";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Wrench,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatDate, getMachineStatusColor } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const MachineDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedMachine, fetchMachine, deleteMachine } = useMachines();
  const { alerts } = useAlerts();
  const { maintenance } = useMaintenance();
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Performance data for charts (mock data)
  const performanceData = [
    { date: "Jan", availability: 92, performance: 85, quality: 98 },
    { date: "Feb", availability: 89, performance: 82, quality: 97 },
    { date: "Mar", availability: 93, performance: 88, quality: 99 },
    { date: "Apr", availability: 87, performance: 79, quality: 96 },
    { date: "May", availability: 91, performance: 86, quality: 98 },
    { date: "Jun", availability: 94, performance: 91, quality: 99 },
    { date: "Jul", availability: 92, performance: 87, quality: 97 },
  ];

  useEffect(() => {
    const loadMachine = async () => {
      if (id) {
        setIsLoading(true);
        try {
          await fetchMachine(id);
        } catch (error) {
          console.error("Failed to load machine:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadMachine();
    setIsClient(true);
  }, [id]);

  // Filter alerts for this machine
  const machineAlerts = alerts.filter((alert) => alert.machineId === id);

  // Filter maintenance records for this machine
  const machineMaintenance = maintenance.filter(
    (record) => record.machineId === id,
  );

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteMachine(id);
      navigate("/machines");
    } catch (error) {
      console.error("Failed to delete machine:", error);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!selectedMachine) {
    return (
      <div className="space-y-4">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/machines")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Machines
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Machine not found or you don't have permission to view it.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/machines")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {selectedMachine.name}
          </h1>
          <Badge
            variant="outline"
            className={getMachineStatusColor(selectedMachine.status)}
          >
            <span className="capitalize">{selectedMachine.status}</span>
          </Badge>
        </div>

        {/* Admin actions */}
        {user && user.role === "admin" && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/machines/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Machine</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this machine? This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Machine Info */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Machine Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Serial Number
                </p>
                <p className="text-sm font-medium">
                  {selectedMachine.serialNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Model
                </p>
                <p className="text-sm font-medium">{selectedMachine.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Type
                </p>
                <p className="text-sm font-medium">{selectedMachine.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Location
                </p>
                <p className="text-sm font-medium">
                  {selectedMachine.location}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Installation Date
                </p>
                <p className="text-sm font-medium">
                  {formatDate(selectedMachine.installationDate, "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant="outline"
                  className={getMachineStatusColor(selectedMachine.status)}
                >
                  <span className="capitalize">{selectedMachine.status}</span>
                </Badge>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Maintenance Schedule
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Last Maintenance</span>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedMachine.lastMaintenance
                      ? formatDate(
                          selectedMachine.lastMaintenance,
                          "MMM d, yyyy",
                        )
                      : "Never"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm">Next Maintenance</span>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedMachine.nextMaintenance
                      ? formatDate(
                          selectedMachine.nextMaintenance,
                          "MMM d, yyyy",
                        )
                      : "Not scheduled"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/maintenance/form/${id}`}>
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Performance Metrics */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Overall Equipment Effectiveness (OEE) and related metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm font-medium text-green-800 mb-1">
                  Availability
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {selectedMachine.metrics.availability}%
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Performance
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {selectedMachine.metrics.performance}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm font-medium text-purple-800 mb-1">
                  Quality
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {selectedMachine.metrics.quality}%
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm font-medium mb-4">
                Performance Trend (Last 6 Months)
              </p>
              {isClient && (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[50, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Line
                      type="monotone"
                      dataKey="availability"
                      stroke="#22c55e"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="quality"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <Button variant="default" className="w-full" asChild>
                <Link to="/dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Detailed Analytics
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Tabs for Alerts, Maintenance History, and Prediction */}
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">
            Alerts
            {machineAlerts.length > 0 && (
              <Badge className="ml-2 bg-red-500">{machineAlerts.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance History</TabsTrigger>
          <TabsTrigger value="prediction">Prediction</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="border rounded-md p-6 mt-6">
          {machineAlerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Issue</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.title}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          alert.priority === "critical"
                            ? "bg-red-100 text-red-800"
                            : alert.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }
                      >
                        <span className="capitalize">{alert.priority}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          alert.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : alert.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : alert.status === "assigned"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        <span className="capitalize">
                          {alert.status.replace("-", " ")}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.createdBy.name}</TableCell>
                    <TableCell>
                      {formatDate(alert.createdAt, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/alerts/${alert.id}`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <AlertTriangle className="mx-auto h-10 w-10 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                No Alerts Found
              </p>
              <p className="text-gray-500 mb-4">
                This machine has no reported issues.
              </p>
              <Button asChild>
                <Link to="/alerts/new">Report an Issue</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="maintenance" className="border rounded-md p-6 mt-6">
          {machineMaintenance.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineMaintenance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">
                      {record.problemDescription}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          record.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }
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
                        <Link to={`/maintenance`}>View Details</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <Wrench className="mx-auto h-10 w-10 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-1">
                No Maintenance Records
              </p>
              <p className="text-gray-500 mb-4">
                This machine has no maintenance history.
              </p>
              <Button asChild>
                <Link to={`/maintenance/form/${id}`}>Schedule Maintenance</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prediction" className="border rounded-md p-6 mt-6">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="bg-blue-50 p-4 rounded-full mr-4">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">
                  Predictive Analysis
                </h3>
                <p className="text-gray-500 mb-4">
                  Based on historical data and current performance patterns, our
                  system predicts the following:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Next Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      <span className="font-bold">August 15, 2023</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      15 days
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Regular preventive maintenance recommended based on usage
                    patterns.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Failure Risk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold">Medium</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-50 text-yellow-700"
                    >
                      28% risk
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Belt tension is showing signs of increased wear and may need
                    attention.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Expected OEE</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="font-bold">89%</span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      +2%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Projected to increase with recommended maintenance and
                    optimizations.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Recommendation</AlertTitle>
              <AlertDescription>
                Schedule preventive maintenance in the next 15 days to address
                potential belt tension issues and optimize machine performance.
                This may increase OEE by an estimated 2%.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end">
              <Button asChild>
                <Link to="/prediction">View Detailed Prediction</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MachineDetailPage;
