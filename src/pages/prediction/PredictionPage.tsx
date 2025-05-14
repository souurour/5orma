import { useState, useEffect } from "react";
import { useMachines } from "@/contexts/MachineContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  AlertCircle,
  Calendar,
  TrendingUp,
  BarChart3,
  BatteryCharging,
  Clock,
  Gauge,
  Info,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock prediction data
const predictionData = {
  failureProbability: 0.28,
  nextMaintenanceDate: new Date(2023, 7, 15),
  expectedLifespan: 1248, // days
  components: [
    { name: "Belt Tension", status: "warning", value: 68, threshold: 60 },
    { name: "Hydraulic Pressure", status: "normal", value: 82, threshold: 70 },
    { name: "Motor Temperature", status: "warning", value: 75, threshold: 70 },
    { name: "Cooling System", status: "normal", value: 90, threshold: 75 },
    { name: "Control Unit", status: "critical", value: 55, threshold: 60 },
  ],
  failureTrend: [
    { date: "Jan", probability: 0.05 },
    { date: "Feb", probability: 0.08 },
    { date: "Mar", probability: 0.12 },
    { date: "Apr", probability: 0.15 },
    { date: "May", probability: 0.2 },
    { date: "Jun", probability: 0.25 },
    { date: "Jul", probability: 0.28 },
    { date: "Aug", probability: 0.32, predicted: true },
    { date: "Sep", probability: 0.38, predicted: true },
    { date: "Oct", probability: 0.45, predicted: true },
  ],
  performanceTrend: [
    { date: "Jan", performance: 92 },
    { date: "Feb", performance: 90 },
    { date: "Mar", performance: 88 },
    { date: "Apr", performance: 86 },
    { date: "May", performance: 84 },
    { date: "Jun", performance: 82 },
    { date: "Jul", performance: 78 },
    { date: "Aug", performance: 75, predicted: true },
    { date: "Sep", performance: 71, predicted: true },
    { date: "Oct", performance: 65, predicted: true },
  ],
  recommendations: [
    {
      id: 1,
      title: "Schedule preventive maintenance",
      description:
        "Belt tension and motor temperature are showing signs of wear and should be checked within the next 15 days.",
      priority: "high",
      timeframe: "15 days",
      impact: "Improve performance by 8% and extend lifespan by 6 months",
    },
    {
      id: 2,
      title: "Replace control unit",
      description:
        "The control unit is operating below threshold and showing signs of potential failure.",
      priority: "critical",
      timeframe: "7 days",
      impact:
        "Prevent unexpected shutdown and potential damage to other components",
    },
    {
      id: 3,
      title: "Optimize operation parameters",
      description:
        "Current operation parameters are causing increased stress on components. Adjusting speed settings is recommended.",
      priority: "medium",
      timeframe: "30 days",
      impact: "Improve efficiency by 5% and reduce wear on critical components",
    },
  ],
};

const PredictionPage = () => {
  const { machines, fetchMachines } = useMachines();
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    fetchMachines();
    setIsClient(true);

    // Select first machine by default
    if (machines.length > 0 && !selectedMachineId) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines.length]);

  const selectedMachine = machines.find((m) => m.id === selectedMachineId);

  // Get color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#22c55e"; // green
      case "warning":
        return "#f59e0b"; // amber
      case "critical":
        return "#ef4444"; // red
      default:
        return "#94a3b8"; // slate
    }
  };

  // Get background color for status
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-50";
      case "warning":
        return "bg-amber-50";
      case "critical":
        return "bg-red-50";
      default:
        return "bg-slate-50";
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Calculate days until maintenance
  const daysUntilMaintenance = Math.ceil(
    (predictionData.nextMaintenanceDate.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Colors for pie chart
  const COLORS = ["#16a34a", "#f59e0b", "#ef4444"];

  // Calculate risk score (0-100)
  const riskScore = Math.floor(predictionData.failureProbability * 100);

  // Get risk label
  const getRiskLabel = (score: number) => {
    if (score < 20) return "Low";
    if (score < 40) return "Moderate";
    if (score < 60) return "Elevated";
    if (score < 80) return "High";
    return "Critical";
  };

  // Get risk color
  const getRiskColor = (score: number) => {
    if (score < 20) return "text-green-500";
    if (score < 40) return "text-amber-500";
    if (score < 60) return "text-orange-500";
    if (score < 80) return "text-red-500";
    return "text-purple-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Predictive Maintenance
          </h1>
          <p className="text-muted-foreground">
            AI-powered predictions for machine maintenance and failure
            prevention
          </p>
        </div>

        <div className="w-full md:w-64">
          <Select
            value={selectedMachineId || ""}
            onValueChange={setSelectedMachineId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a machine" />
            </SelectTrigger>
            <SelectContent>
              {machines.map((machine) => (
                <SelectItem key={machine.id} value={machine.id}>
                  {machine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMachine ? (
        <>
          {/* Risk Overview and Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Score */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Failure Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="radial-progress text-4xl font-bold relative flex items-center justify-center"
                    style={
                      {
                        "--value": riskScore,
                        "--thickness": "8px",
                        height: "120px",
                        width: "120px",
                        background: `conic-gradient(${getStatusColor(riskScore < 30 ? "normal" : riskScore > 60 ? "critical" : "warning")} ${riskScore}%, #e2e8f0 0)`,
                      } as any
                    }
                  >
                    <div className="absolute flex flex-col items-center justify-center h-full w-full">
                      <span
                        className={`text-3xl font-bold ${getRiskColor(riskScore)}`}
                      >
                        {riskScore}%
                      </span>
                      <span className="text-xs">{getRiskLabel(riskScore)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Next Failure
                      </p>
                      <p className="text-lg font-medium">
                        ~{Math.ceil(predictionData.expectedLifespan / 30)}{" "}
                        months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Confidence
                      </p>
                      <p className="text-lg font-medium">87%</p>
                    </div>
                  </div>
                </div>
                <Alert
                  variant={riskScore > 50 ? "destructive" : "default"}
                  className="mt-2"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {riskScore > 50
                      ? "High risk of failure detected. Immediate attention recommended."
                      : "Machine is operating within normal parameters but preventive maintenance is advised."}
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/machines/${selectedMachine.id}`}>
                    View Machine Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Component Status */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Component Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionData.components.map((component) => (
                    <div
                      key={component.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`size-2 rounded-full ${
                            component.status === "normal"
                              ? "bg-green-500"
                              : component.status === "warning"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {component.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              component.value >= component.threshold
                                ? "bg-green-500"
                                : component.value >= component.threshold * 0.8
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${component.value}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {component.value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span>Normal</span>
                    <div className="size-2 rounded-full bg-amber-500 ml-2" />
                    <span>Warning</span>
                    <div className="size-2 rounded-full bg-red-500 ml-2" />
                    <span>Critical</span>
                  </div>
                  <p>
                    Component health is based on sensor readings and historical
                    data analysis.
                  </p>
                </div>
              </CardFooter>
            </Card>

            {/* Next Maintenance */}
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Maintenance Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`p-4 rounded-lg ${
                    daysUntilMaintenance <= 7
                      ? "bg-red-50"
                      : daysUntilMaintenance <= 15
                        ? "bg-amber-50"
                        : "bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Next Scheduled Maintenance
                      </p>
                      <p className="text-xl font-bold">
                        {formatDate(
                          predictionData.nextMaintenanceDate,
                          "MMMM d, yyyy",
                        )}
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          daysUntilMaintenance <= 7
                            ? "bg-red-100 text-red-800"
                            : daysUntilMaintenance <= 15
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {daysUntilMaintenance} days remaining
                      </Badge>
                    </div>
                    <div
                      className={
                        daysUntilMaintenance <= 7
                          ? "text-red-500"
                          : daysUntilMaintenance <= 15
                            ? "text-amber-500"
                            : "text-blue-500"
                      }
                    >
                      <Calendar className="h-8 w-8" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Machine Age</span>
                    </div>
                    <span className="text-sm font-medium">
                      {Math.floor(
                        (new Date().getTime() -
                          new Date(
                            selectedMachine.installationDate,
                          ).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )}{" "}
                      days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm">Expected Lifespan</span>
                    </div>
                    <span className="text-sm font-medium">
                      {predictionData.expectedLifespan} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <BatteryCharging className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Remaining Life</span>
                    </div>
                    <span className="text-sm font-medium">
                      ~
                      {Math.floor(
                        predictionData.expectedLifespan *
                          (1 - predictionData.failureProbability),
                      )}{" "}
                      days
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/maintenance/form/${selectedMachine.id}`}>
                    Schedule Maintenance
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Prediction Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Failure Probability Trend</CardTitle>
                <CardDescription>
                  Predicted failure probability over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={predictionData.failureTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="failureGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ef4444"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ef4444"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis
                        tickFormatter={(value) =>
                          `${(value * 100).toFixed(0)}%`
                        }
                        domain={[0, 0.6]}
                      />
                      <Tooltip
                        formatter={(value) => [
                          `${(Number(value) * 100).toFixed(0)}%`,
                          "Failure Probability",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="probability"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#failureGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground w-full">
                  <div className="flex items-center">
                    <div className="size-3 border border-dashed border-gray-400 mr-2" />
                    <span>Predicted values (next 3 months)</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Forecast</CardTitle>
                <CardDescription>
                  Predicted performance metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isClient && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictionData.performanceTrend}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
                      <YAxis
                        domain={[50, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Performance"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="performance"
                        stroke="#4F46E5"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground w-full">
                  <div className="flex items-center">
                    <div className="size-3 border border-dashed border-gray-400 mr-2" />
                    <span>Predicted values (next 3 months)</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                AI-generated recommendations based on machine performance and
                prediction models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="critical">Critical</TabsTrigger>
                  <TabsTrigger value="preventive">Preventive</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 pt-4">
                  {predictionData.recommendations.map((recommendation) => (
                    <div
                      key={recommendation.id}
                      className={`p-4 rounded-lg border ${getStatusBgColor(
                        recommendation.priority === "critical"
                          ? "critical"
                          : recommendation.priority === "high"
                            ? "warning"
                            : "normal",
                      )}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={getPriorityColor(
                                recommendation.priority,
                              )}
                            >
                              {recommendation.priority.charAt(0).toUpperCase() +
                                recommendation.priority.slice(1)}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-800"
                            >
                              {recommendation.timeframe}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-medium mb-1">
                            {recommendation.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {recommendation.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">
                              {recommendation.impact}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 md:flex-col">
                          {recommendation.priority === "critical" ||
                          recommendation.priority === "high" ? (
                            <Button asChild size="sm" className="w-full">
                              <Link
                                to={`/maintenance/form/${selectedMachine.id}`}
                              >
                                Schedule Now
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Link
                                to={`/maintenance/form/${selectedMachine.id}`}
                              >
                                Schedule
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="w-full">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="critical" className="space-y-4 pt-4">
                  {predictionData.recommendations
                    .filter((rec) => rec.priority === "critical")
                    .map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className="p-4 rounded-lg border bg-red-50"
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                Critical
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800"
                              >
                                {recommendation.timeframe}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              {recommendation.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {recommendation.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {recommendation.impact}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 md:flex-col">
                            <Button asChild size="sm" className="w-full">
                              <Link
                                to={`/maintenance/form/${selectedMachine.id}`}
                              >
                                Schedule Now
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {predictionData.recommendations.filter(
                    (rec) => rec.priority === "critical",
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">
                        No Critical Issues
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        There are no critical issues requiring immediate
                        attention.
                      </p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="preventive" className="space-y-4 pt-4">
                  {predictionData.recommendations
                    .filter((rec) => rec.priority !== "critical")
                    .map((recommendation) => (
                      <div
                        key={recommendation.id}
                        className={`p-4 rounded-lg border ${
                          recommendation.priority === "high"
                            ? "bg-amber-50"
                            : "bg-green-50"
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={getPriorityColor(
                                  recommendation.priority,
                                )}
                              >
                                {recommendation.priority
                                  .charAt(0)
                                  .toUpperCase() +
                                  recommendation.priority.slice(1)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-800"
                              >
                                {recommendation.timeframe}
                              </Badge>
                            </div>
                            <h3 className="text-lg font-medium mb-1">
                              {recommendation.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {recommendation.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-600">
                                {recommendation.impact}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 md:flex-col">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              <Link
                                to={`/maintenance/form/${selectedMachine.id}`}
                              >
                                Schedule
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Machine Selected</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Please select a machine from the dropdown to view predictive
              maintenance analytics.
            </p>
            {machines.length === 0 ? (
              <Button asChild>
                <Link to="/machines">Manage Machines</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PredictionPage;
