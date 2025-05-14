import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAlerts } from "@/contexts/AlertContext";
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
  AlertOctagon,
  AlertTriangle,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  formatDate,
  getAlertPriorityColor,
  getAlertStatusColor,
} from "@/lib/utils";
import { ALERT_PRIORITY, ALERT_STATUS } from "@/config/constants";

const AlertsPage = () => {
  const { user } = useAuth();
  const { alerts, fetchAlerts } = useAlerts();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Filter alerts based on search and filters
  const filteredAlerts = alerts.filter((alert) => {
    // Search filter - check if search term exists in title, description, or machine name
    const matchesSearch =
      searchTerm === "" ||
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.machineName.toLowerCase().includes(searchTerm.toLowerCase());

    // Priority filter
    const matchesPriority =
      priorityFilter === "all" || alert.priority === priorityFilter;

    // Status filter
    const matchesStatus =
      statusFilter === "all" || alert.status === statusFilter;

    // Date filter - simple implementation
    let matchesDate = true;
    const alertDate = new Date(alert.createdAt);
    const today = new Date();
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    if (dateFilter === "today") {
      matchesDate = alertDate >= todayStart;
    } else if (dateFilter === "week") {
      matchesDate = alertDate >= weekAgo;
    }

    return matchesSearch && matchesPriority && matchesStatus && matchesDate;
  });

  // Get alert priority icon
  const getAlertPriorityIcon = (priority: string) => {
    switch (priority) {
      case ALERT_PRIORITY.CRITICAL:
        return <AlertOctagon className="h-4 w-4 text-red-600" />;
      case ALERT_PRIORITY.MEDIUM:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            View and manage machine alerts and issues
          </p>
        </div>

        {/* Only show create alert button for users and admins */}
        {user && (user.role === "user" || user.role === "admin") && (
          <Button asChild>
            <Link to="/alerts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Alert
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value={ALERT_PRIORITY.LOW}>Low</SelectItem>
              <SelectItem value={ALERT_PRIORITY.MEDIUM}>Medium</SelectItem>
              <SelectItem value={ALERT_PRIORITY.CRITICAL}>Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={ALERT_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={ALERT_STATUS.ASSIGNED}>Assigned</SelectItem>
              <SelectItem value={ALERT_STATUS.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={ALERT_STATUS.RESOLVED}>Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Date</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Machine</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">
                    {alert.machineName}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate">{alert.title}</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1 w-fit ${getAlertPriorityColor(alert.priority)}`}
                    >
                      {getAlertPriorityIcon(alert.priority)}
                      <span className="capitalize">{alert.priority}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`w-fit ${getAlertStatusColor(alert.status)}`}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No alerts found.{" "}
                  {user?.role === "user" && (
                    <Link
                      to="/alerts/new"
                      className="text-blue-600 hover:underline"
                    >
                      Create a new alert
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

export default AlertsPage;
