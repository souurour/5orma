import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { Plus, Search, SlidersHorizontal, Filter } from "lucide-react";
import { formatDate, getMachineStatusColor } from "@/lib/utils";
import { MACHINE_STATUS, MACHINE_TYPES } from "@/config/constants";

const MachinesPage = () => {
  const { user } = useAuth();
  const { machines, fetchMachines } = useMachines();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchMachines();
  }, []);

  // Filter machines based on search and filters
  const filteredMachines = machines.filter((machine) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === "all" || machine.status === statusFilter;

    // Type filter
    const matchesType = typeFilter === "all" || machine.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Machines</h1>
          <p className="text-muted-foreground">
            View and manage your manufacturing machines
          </p>
        </div>

        {/* Only show create machine button for admins */}
        {user && user.role === "admin" && (
          <Button asChild>
            <Link to="/machines/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Machine
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search machines by name, serial number, or location..."
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
              <SelectItem value={MACHINE_STATUS.OPERATIONAL}>
                Operational
              </SelectItem>
              <SelectItem value={MACHINE_STATUS.MAINTENANCE}>
                Maintenance
              </SelectItem>
              <SelectItem value={MACHINE_STATUS.OFFLINE}>Offline</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Machine Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {MACHINE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Machines Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Maintenance</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell className="font-medium">{machine.name}</TableCell>
                  <TableCell>{machine.serialNumber}</TableCell>
                  <TableCell>{machine.type}</TableCell>
                  <TableCell>{machine.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`w-fit ${getMachineStatusColor(machine.status)}`}
                    >
                      <span className="capitalize">{machine.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {machine.lastMaintenance
                      ? formatDate(machine.lastMaintenance, "MMM d, yyyy")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/machines/${machine.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No machines found.{" "}
                  {user?.role === "admin" && (
                    <Link
                      to="/machines/new"
                      className="text-blue-600 hover:underline"
                    >
                      Add a new machine
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

export default MachinesPage;
