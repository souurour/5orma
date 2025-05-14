import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMachines } from "@/contexts/MachineContext";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CalendarIcon,
  Download,
  FileSpreadsheet,
  FileText,
  Share2,
  Mail,
  Printer,
  Clock,
  Search,
  BarChart3,
  Settings,
  Info,
} from "lucide-react";

// Create custom icon components for missing icons
const FilePdf = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-file-type"
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 13v-1h6v1" />
    <path d="M11 18v-6" />
    <path d="M9 15h4" />
  </svg>
);
import { Link } from "react-router-dom";
import { format, subDays } from "date-fns";
import { REPORT_FORMATS } from "@/config/constants";

// Mock report templates
const reportTemplates = [
  {
    id: 1,
    name: "Machine Performance Summary",
    description:
      "Overview of all machine performance metrics, OEE, and availability.",
    type: "performance",
    lastGenerated: subDays(new Date(), 2),
    format: "pdf",
  },
  {
    id: 2,
    name: "Maintenance History",
    description:
      "Detailed log of all maintenance activities with technician notes.",
    type: "maintenance",
    lastGenerated: subDays(new Date(), 5),
    format: "excel",
  },
  {
    id: 3,
    name: "Alert Analysis",
    description:
      "Summary of alerts by priority, resolution time, and frequency.",
    type: "alerts",
    lastGenerated: subDays(new Date(), 1),
    format: "pdf",
  },
  {
    id: 4,
    name: "Downtime Report",
    description:
      "Analysis of machine downtime, causes, and impact on production.",
    type: "downtime",
    lastGenerated: subDays(new Date(), 7),
    format: "excel",
  },
  {
    id: 5,
    name: "Prediction & Forecast",
    description:
      "Predictive maintenance forecasts and component failure risks.",
    type: "prediction",
    lastGenerated: subDays(new Date(), 3),
    format: "pdf",
  },
  {
    id: 6,
    name: "Monthly Executive Summary",
    description: "High-level summary of key metrics for executive review.",
    type: "executive",
    lastGenerated: subDays(new Date(), 30),
    format: "pdf",
  },
];

// Mock scheduled reports
const scheduledReports = [
  {
    id: 101,
    templateId: 1,
    name: "Weekly Performance Summary",
    recipients: ["operations@example.com", "manager@example.com"],
    frequency: "weekly",
    nextRunDate: new Date(2023, 7, 20),
    format: "pdf",
  },
  {
    id: 102,
    templateId: 3,
    name: "Daily Alert Summary",
    recipients: ["maintenance@example.com", "technicians@example.com"],
    frequency: "daily",
    nextRunDate: new Date(2023, 7, 15),
    format: "excel",
  },
  {
    id: 103,
    templateId: 6,
    name: "Monthly Executive Report",
    recipients: ["executive@example.com", "ceo@example.com"],
    frequency: "monthly",
    nextRunDate: new Date(2023, 8, 1),
    format: "pdf",
  },
];

// Mock recent reports
const recentReports = [
  {
    id: 201,
    name: "Machine Performance Summary - Aug 2023",
    generatedAt: subDays(new Date(), 2),
    generatedBy: "Admin User",
    format: "pdf",
    size: "1.2 MB",
  },
  {
    id: 202,
    name: "Maintenance History - Jul 2023",
    generatedAt: subDays(new Date(), 7),
    generatedBy: "Admin User",
    format: "excel",
    size: "3.5 MB",
  },
  {
    id: 203,
    name: "Alert Analysis - Last 30 Days",
    generatedAt: subDays(new Date(), 1),
    generatedBy: "John Smith",
    format: "pdf",
    size: "0.8 MB",
  },
  {
    id: 204,
    name: "Downtime Report - Q2 2023",
    generatedAt: subDays(new Date(), 14),
    generatedBy: "Sarah Williams",
    format: "excel",
    size: "2.1 MB",
  },
];

const ReportsPage = () => {
  const { user } = useAuth();
  const { machines } = useMachines();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to?: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedReportTemplate, setSelectedReportTemplate] =
    useState<any>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel">("pdf");
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [scheduleFrequency, setScheduleFrequency] = useState("once");

  // Filter templates based on search
  const filteredTemplates = reportTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleGenerateReport = () => {
    if (!selectedReportTemplate) return;

    setIsGenerating(true);

    // Simulate API call to generate report
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerateDialogOpen(false);

      // Show success message or download the report
      alert(`Report "${selectedReportTemplate.name}" generated successfully!`);
    }, 2000);
  };

  const handleScheduleReport = () => {
    if (!selectedReportTemplate) return;

    // Simulate API call to schedule report
    setTimeout(() => {
      setIsScheduleDialogOpen(false);

      // Show success message
      alert(`Report "${selectedReportTemplate.name}" scheduled successfully!`);
    }, 1000);
  };

  const getFormatIcon = (format: string) => {
    return format === "pdf" ? (
      <div className="h-4 w-4 text-red-500">
        <FilePdf />
      </div>
    ) : (
      <FileSpreadsheet className="h-4 w-4 text-green-500" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and manage reports
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="recent">Recent Reports</TabsTrigger>
        </TabsList>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-4 pt-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search report templates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    {getFormatIcon(template.format)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      Last generated:{" "}
                      {format(template.lastGenerated, "MMM d, yyyy")}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedReportTemplate(template);
                      setIsScheduleDialogOpen(true);
                    }}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedReportTemplate(template);
                      setSelectedFormat(template.format as "pdf" | "excel");
                      setIsGenerateDialogOpen(true);
                    }}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Generate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                No report templates match your search criteria
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-4 pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="capitalize">
                      {report.frequency}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {report.recipients.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="uppercase">{report.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(report.nextRunDate, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {scheduledReports.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No scheduled reports</h3>
              <p className="text-muted-foreground mb-4">
                You haven't scheduled any reports yet
              </p>
            </div>
          )}
        </TabsContent>

        {/* Recent Reports Tab */}
        <TabsContent value="recent" className="space-y-4 pt-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Generated At</TableHead>
                  <TableHead>Generated By</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>
                      {format(report.generatedAt, "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getFormatIcon(report.format)}
                        <span className="uppercase">{report.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>{report.size}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {recentReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recent reports</h3>
              <p className="text-muted-foreground mb-4">
                No reports have been generated recently
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Generate Report Dialog */}
      <Dialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              {selectedReportTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Date Range</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="inline-flex items-center gap-2 text-sm"
                    >
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {dateRange.from
                          ? format(dateRange.from, "LLL dd, y")
                          : "Start date"}
                      </span>
                      <span>-</span>
                      <span>
                        {dateRange.to
                          ? format(dateRange.to, "LLL dd, y")
                          : "End date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={(range) => range && setDateRange(range)}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Machines</div>
              <div className="border rounded-md p-4 max-h-40 overflow-y-auto">
                {machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      id={`machine-${machine.id}`}
                      checked={selectedMachines.includes(machine.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedMachines([
                            ...selectedMachines,
                            machine.id,
                          ]);
                        } else {
                          setSelectedMachines(
                            selectedMachines.filter((id) => id !== machine.id),
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`machine-${machine.id}`}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {machine.name}
                    </label>
                  </div>
                ))}
                {machines.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No machines found
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Format</div>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-pdf"
                    value="pdf"
                    checked={selectedFormat === "pdf"}
                    onChange={() => setSelectedFormat("pdf")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="format-pdf"
                    className="flex items-center text-sm font-medium gap-1"
                  >
                    <FilePdf className="h-4 w-4 text-red-500" />
                    PDF
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-excel"
                    value="excel"
                    checked={selectedFormat === "excel"}
                    onChange={() => setSelectedFormat("excel")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="format-excel"
                    className="flex items-center text-sm font-medium gap-1"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    Excel
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">
                Send to Email (Optional)
              </div>
              <Input
                placeholder="email@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to download the report directly
              </p>
            </div>
          </div>
          <DialogFooter className="flex space-x-2 sm:justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              Selected {selectedMachines.length} machine(s)
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <span className="flex items-center gap-1">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Generate
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Report Dialog */}
      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up automated generation and delivery of this report
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Name</label>
              <Input defaultValue={selectedReportTemplate?.name} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <Select
                value={scheduleFrequency}
                onValueChange={setScheduleFrequency}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">One-time</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Delivery Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from
                      ? format(dateRange.from, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-format-pdf"
                    value="pdf"
                    checked={selectedFormat === "pdf"}
                    onChange={() => setSelectedFormat("pdf")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="schedule-format-pdf"
                    className="flex items-center text-sm font-medium gap-1"
                  >
                    <FilePdf className="h-4 w-4 text-red-500" />
                    PDF
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="schedule-format-excel"
                    value="excel"
                    checked={selectedFormat === "excel"}
                    onChange={() => setSelectedFormat("excel")}
                    className="h-4 w-4 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="schedule-format-excel"
                    className="flex items-center text-sm font-medium gap-1"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    Excel
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Emails</label>
              <Input
                placeholder="email@example.com, another@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple emails with commas
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox id="copy-me" />
              <label
                htmlFor="copy-me"
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Send a copy to me
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleScheduleReport}>
              <Clock className="mr-2 h-4 w-4" />
              Schedule Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsPage;
