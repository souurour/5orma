import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Search, Filter, Download, Eye } from "lucide-react";
import { format } from "date-fns";

// Mock data for classified images
const classifiedImages = [
  {
    id: 1,
    name: "Brain_MRI_001.jpg",
    date: new Date(2023, 9, 15, 14, 30),
    classification: "Normal",
    confidence: 0.92,
    patient: "P-10045",
  },
  {
    id: 2,
    name: "Chest_XRay_237.png",
    date: new Date(2023, 9, 14, 10, 15),
    classification: "Pneumonia",
    confidence: 0.87,
    patient: "P-23187",
  },
  {
    id: 3,
    name: "Abdominal_CT_112.dcm",
    date: new Date(2023, 9, 13, 16, 45),
    classification: "Normal",
    confidence: 0.95,
    patient: "P-45290",
  },
  {
    id: 4,
    name: "Knee_MRI_078.jpg",
    date: new Date(2023, 9, 12, 9, 0),
    classification: "ACL Tear",
    confidence: 0.89,
    patient: "P-33476",
  },
  {
    id: 5,
    name: "Spine_XRay_345.png",
    date: new Date(2023, 9, 11, 13, 20),
    classification: "Scoliosis",
    confidence: 0.76,
    patient: "P-67129",
  },
  {
    id: 6,
    name: "Brain_CT_224.dcm",
    date: new Date(2023, 9, 10, 11, 10),
    classification: "Hemorrhage",
    confidence: 0.94,
    patient: "P-56732",
  },
  {
    id: 7,
    name: "Hand_XRay_127.jpg",
    date: new Date(2023, 9, 9, 15, 40),
    classification: "Fracture",
    confidence: 0.81,
    patient: "P-72941",
  },
  {
    id: 8,
    name: "Lung_CT_092.dcm",
    date: new Date(2023, 9, 8, 12, 5),
    classification: "Nodule",
    confidence: 0.68,
    patient: "P-39518",
  },
];

// Format confidence as percentage
const formatConfidence = (confidence: number) => {
  return `${(confidence * 100).toFixed(1)}%`;
};

// Get badge variant based on classification
const getClassificationBadge = (classification: string) => {
  switch (classification) {
    case "Normal":
      return "outline";
    case "Pneumonia":
    case "Hemorrhage":
    case "Fracture":
      return "destructive";
    default:
      return "default";
  }
};

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter function
  const filteredResults = classifiedImages.filter((image) => {
    // Search filter
    const matchesSearch =
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.classification.toLowerCase().includes(searchTerm.toLowerCase());

    // Classification filter
    const matchesClassification =
      classificationFilter === "all" ||
      image.classification === classificationFilter;

    // Date filter - simple implementation
    let matchesDate = true;
    const today = new Date();
    if (dateFilter === "today") {
      matchesDate = image.date.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      matchesDate = image.date >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      matchesDate = image.date >= monthAgo;
    }

    return matchesSearch && matchesClassification && matchesDate;
  });

  return (
    <div className="flex-1 container max-w-6xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Classification Results</h1>
        <p className="text-muted-foreground">
          View and filter your classified medical images
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by image name, patient ID or classification..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              value={classificationFilter}
              onValueChange={setClassificationFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classifications</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Pneumonia">Pneumonia</SelectItem>
                <SelectItem value="Hemorrhage">Hemorrhage</SelectItem>
                <SelectItem value="Fracture">Fracture</SelectItem>
                <SelectItem value="ACL Tear">ACL Tear</SelectItem>
                <SelectItem value="Scoliosis">Scoliosis</SelectItem>
                <SelectItem value="Nodule">Nodule</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
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
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image Name</TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length > 0 ? (
              filteredResults.map((image) => (
                <TableRow key={image.id}>
                  <TableCell className="font-medium">{image.name}</TableCell>
                  <TableCell>{image.patient}</TableCell>
                  <TableCell>
                    {format(image.date, "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getClassificationBadge(image.classification)}
                    >
                      {image.classification}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatConfidence(image.confidence)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {filteredResults.length} of {classifiedImages.length} results
        </p>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Results
        </Button>
      </div>
    </div>
  );
};

export default Results;
