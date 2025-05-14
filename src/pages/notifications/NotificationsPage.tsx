import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertOctagon,
  Wrench,
  BarChart3,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";

// Mock notification data
const notificationsData = [
  {
    id: 1,
    title: "Critical Alert: Machine DLM-1001",
    message:
      "Temperature exceeding critical threshold (95°C). Immediate attention required.",
    type: "alert",
    priority: "critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: false,
    actionLink: "/alerts/123",
    actionText: "View Alert",
  },
  {
    id: 2,
    title: "Maintenance Complete",
    message:
      "Scheduled maintenance for Machine DLM-2003 has been completed by Tech: John Smith.",
    type: "maintenance",
    priority: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionLink: "/maintenance",
    actionText: "View Details",
  },
  {
    id: 3,
    title: "Failure Risk Warning",
    message:
      "Machine DLM-1005 has a 67% probability of belt failure within 15 days. Schedule preventive maintenance.",
    type: "prediction",
    priority: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    actionLink: "/prediction",
    actionText: "View Prediction",
  },
  {
    id: 4,
    title: "Report Generated",
    message:
      "Monthly Performance Report for July 2023 has been generated and is ready for review.",
    type: "report",
    priority: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionLink: "/reports",
    actionText: "View Report",
  },
  {
    id: 5,
    title: "New User Added",
    message:
      "Sarah Williams has been added as a Technician. You can assign maintenance tasks to this user.",
    type: "system",
    priority: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    actionLink: "/users",
    actionText: "View Users",
  },
  {
    id: 6,
    title: "Machine Status Update",
    message:
      "Machine DLM-3002 has been marked as Offline. Maintenance required.",
    type: "alert",
    priority: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 36 hours ago
    read: false,
    actionLink: "/machines/3002",
    actionText: "View Machine",
  },
  {
    id: 7,
    title: "Scheduled Maintenance Reminder",
    message:
      "Upcoming maintenance for Machine DLM-1008 is scheduled for tomorrow at 10:00 AM.",
    type: "maintenance",
    priority: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
    read: true,
    actionLink: "/maintenance",
    actionText: "View Schedule",
  },
  {
    id: 8,
    title: "Performance Alert",
    message:
      "Machine DLM-2001 performance has dropped below 75% threshold. Inspection recommended.",
    type: "alert",
    priority: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    actionLink: "/machines/2001",
    actionText: "View Machine",
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [filteredNotifications, setFilteredNotifications] =
    useState(notifications);

  useEffect(() => {
    // Apply filters
    const filtered = notifications.filter((notification) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        typeFilter === "all" || notification.type === typeFilter;

      return matchesSearch && matchesType;
    });

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter]);

  // Mark a notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
  };

  // Clear all read notifications
  const clearReadNotifications = () => {
    setNotifications(
      notifications.filter((notification) => !notification.read),
    );
  };

  // Get the count of unread notifications
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // Get the icon for a notification type
  const getNotificationIcon = (type: string, priority: string) => {
    const color =
      priority === "critical"
        ? "text-red-500"
        : priority === "warning"
          ? "text-amber-500"
          : "text-blue-500";

    switch (type) {
      case "alert":
        return <AlertOctagon className={`h-5 w-5 ${color}`} />;
      case "maintenance":
        return <Wrench className={`h-5 w-5 ${color}`} />;
      case "prediction":
        return <BarChart3 className={`h-5 w-5 ${color}`} />;
      case "report":
        return (
          <svg
            className={`h-5 w-5 ${color}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      default:
        return <Bell className={`h-5 w-5 ${color}`} />;
    }
  };

  // Get the background color for a notification based on priority
  const getNotificationBgColor = (priority: string, read: boolean) => {
    if (read) return "bg-gray-50";

    switch (priority) {
      case "critical":
        return "bg-red-50";
      case "warning":
        return "bg-amber-50";
      default:
        return "bg-blue-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with alerts, maintenance activities, and system
            notifications
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={clearReadNotifications}>
            <XCircle className="h-4 w-4 mr-2" />
            Clear Read Notifications
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter by Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="alert">Alerts</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="prediction">Predictions</SelectItem>
              <SelectItem value="report">Reports</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notification Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <Badge className="ml-2 bg-gray-500" variant="secondary">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500" variant="secondary">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`overflow-hidden ${getNotificationBgColor(
                  notification.priority,
                  notification.read,
                )}`}
              >
                <CardContent className="p-0">
                  <div className="flex p-4 relative">
                    {!notification.read && (
                      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                    <div className="mr-4 mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority,
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.message}
                      </p>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {notification.type.charAt(0).toUpperCase() +
                              notification.type.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(notification.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="flex gap-2 ml-auto">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-8"
                          >
                            <Link to={notification.actionLink}>
                              {notification.actionText}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No notifications found
                </h3>
                <p className="text-muted-foreground mb-4 text-center max-w-md">
                  {searchTerm || typeFilter !== "all"
                    ? "No notifications match your filters. Try adjusting your search criteria."
                    : "You don't have any notifications at the moment."}
                </p>
                {(searchTerm || typeFilter !== "all") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setTypeFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="unread" className="mt-6 space-y-4">
          {filteredNotifications.filter((n) => !n.read).length > 0 ? (
            filteredNotifications
              .filter((notification) => !notification.read)
              .map((notification) => (
                <Card
                  key={notification.id}
                  className={`overflow-hidden ${getNotificationBgColor(
                    notification.priority,
                    false,
                  )}`}
                >
                  <CardContent className="p-0">
                    <div className="flex p-4 relative">
                      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
                      <div className="mr-4 mt-1">
                        {getNotificationIcon(
                          notification.type,
                          notification.priority,
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-medium mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.type.charAt(0).toUpperCase() +
                                notification.type.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          <div className="flex gap-2 ml-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8"
                            >
                              <Link to={notification.actionLink}>
                                {notification.actionText}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You have no unread notifications at the moment.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
