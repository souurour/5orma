import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMaintenance } from "@/contexts/MaintenanceContext";
import { useMachines } from "@/contexts/MachineContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, CalendarIcon, AlertCircle, Info } from "lucide-react";
import { MAINTENANCE_STATUS } from "@/config/constants";
import { format } from "date-fns";

// Define form schema
const formSchema = z.object({
  machineId: z.string({
    required_error: "Please select a machine",
  }),
  problemDescription: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
  startTime: z.date({
    required_error: "Please select a start date and time",
  }),
  status: z.enum(["pending", "in-progress", "completed"], {
    required_error: "Please select a status",
  }),
  notes: z.string().optional(),
  partsReplaced: z.string().optional(),
  endTime: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

const MaintenanceFormPage = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const {
    createMaintenance,
    updateMaintenance,
    completeMaintenance,
    selectedMaintenance,
    fetchMaintenanceById,
  } = useMaintenance();
  const { machines, fetchMachines } = useMachines();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "pending",
    },
  });

  const selectedStatus = watch("status");
  const selectedStartDate = watch("startTime");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchMachines();

        // If machineId is provided in the URL, set it in the form
        if (machineId) {
          setValue("machineId", machineId);
        }

        // If we're editing an existing maintenance record
        if (selectedMaintenance) {
          setIsEditMode(true);
          setValue("machineId", selectedMaintenance.machineId);
          setValue(
            "problemDescription",
            selectedMaintenance.problemDescription,
          );
          setValue(
            "status",
            selectedMaintenance.status as
              | "pending"
              | "in-progress"
              | "completed",
          );
          setValue("startTime", new Date(selectedMaintenance.startTime));

          if (selectedMaintenance.notes) {
            setValue("notes", selectedMaintenance.notes);
          }

          if (selectedMaintenance.partsReplaced) {
            setValue("partsReplaced", selectedMaintenance.partsReplaced);
          }

          if (selectedMaintenance.endTime) {
            setValue("endTime", new Date(selectedMaintenance.endTime));
          }
        } else {
          // New maintenance record - set default values
          setValue("startTime", new Date());
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [machineId, selectedMaintenance]);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      if (isEditMode && selectedMaintenance) {
        // Update existing maintenance
        await updateMaintenance(selectedMaintenance.id, {
          problemDescription: data.problemDescription,
          startTime: data.startTime.toISOString(),
          status: data.status,
          notes: data.notes,
          partsReplaced: data.partsReplaced,
          endTime: data.endTime ? data.endTime.toISOString() : undefined,
        });
      } else {
        // Create new maintenance
        await createMaintenance({
          machineId: data.machineId,
          problemDescription: data.problemDescription,
          startTime: data.startTime.toISOString(),
          status: data.status,
          notes: data.notes,
          partsReplaced: data.partsReplaced,
        });
      }

      navigate("/maintenance");
    } catch (error: any) {
      setSubmissionError(
        error.message ||
          "Failed to submit maintenance record. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedMaintenance) return;

    try {
      setIsSubmitting(true);
      setSubmissionError(null);

      await completeMaintenance(
        selectedMaintenance.id,
        new Date().toISOString(),
      );

      navigate("/maintenance");
    } catch (error: any) {
      setSubmissionError(
        error.message || "Failed to complete maintenance. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/maintenance")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit Maintenance Record" : "Create Maintenance Record"}
        </h1>
      </div>

      {submissionError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submissionError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>
              {isEditMode ? "Maintenance Details" : "Machine Issue Details"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Update maintenance record information"
                : "Provide details about the maintenance to be performed"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Machine Selection - only show if not in edit mode or if no machineId was provided */}
            {(!isEditMode || !machineId) && (
              <div className="space-y-2">
                <Label htmlFor="machine">Machine</Label>
                <Select
                  onValueChange={(value) => setValue("machineId", value)}
                  defaultValue={machineId}
                >
                  <SelectTrigger
                    id="machine"
                    className={errors.machineId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select a machine" />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name} ({machine.location})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.machineId && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.machineId.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="problemDescription">Problem Description</Label>
              <Textarea
                id="problemDescription"
                {...register("problemDescription")}
                className={`min-h-[120px] ${errors.problemDescription ? "border-red-500" : ""}`}
                placeholder="Describe the issue or maintenance required"
              />
              {errors.problemDescription && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.problemDescription.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.startTime ? "border-red-500" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedStartDate ? (
                        format(selectedStartDate, "PPP HH:mm")
                      ) : (
                        <span>Select date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedStartDate}
                      onSelect={(date) => date && setValue("startTime", date)}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        onChange={(e) => {
                          if (selectedStartDate && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":");
                            const newDate = new Date(selectedStartDate);
                            newDate.setHours(
                              parseInt(hours),
                              parseInt(minutes),
                            );
                            setValue("startTime", newDate);
                          }
                        }}
                        defaultValue={
                          selectedStartDate
                            ? format(selectedStartDate, "HH:mm")
                            : ""
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                {errors.startTime && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      "status",
                      value as "pending" | "in-progress" | "completed",
                    )
                  }
                  defaultValue={
                    isEditMode ? selectedMaintenance?.status : "pending"
                  }
                >
                  <SelectTrigger
                    id="status"
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
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
                {errors.status && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* End Time - only show if status is completed */}
            {selectedStatus === "completed" && (
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.endTime ? "border-red-500" : ""
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watch("endTime") ? (
                        format(watch("endTime"), "PPP HH:mm")
                      ) : (
                        <span>Select completion date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watch("endTime") || undefined}
                      onSelect={(date) => date && setValue("endTime", date)}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <Input
                        type="time"
                        onChange={(e) => {
                          if (watch("endTime") && e.target.value) {
                            const [hours, minutes] = e.target.value.split(":");
                            const newDate = new Date(watch("endTime"));
                            newDate.setHours(
                              parseInt(hours),
                              parseInt(minutes),
                            );
                            setValue("endTime", newDate);
                          }
                        }}
                        defaultValue={
                          watch("endTime")
                            ? format(watch("endTime"), "HH:mm")
                            : ""
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Maintenance Notes</Label>
              <Textarea
                id="notes"
                {...register("notes")}
                className="min-h-[100px]"
                placeholder="Additional notes about the maintenance (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partsReplaced">Parts Replaced</Label>
              <Textarea
                id="partsReplaced"
                {...register("partsReplaced")}
                placeholder="List any parts that were replaced (optional)"
              />
            </div>

            {/* Information alert for technicians */}
            <Alert variant="info" className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">
                Maintenance Information
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                {isEditMode
                  ? "Update the maintenance record with any changes to the status, notes, or parts replaced."
                  : "After creating a maintenance record, you can update it as work progresses and mark it as completed when finished."}
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/maintenance")}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {isEditMode && selectedMaintenance?.status !== "completed" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleComplete}
                  disabled={isSubmitting}
                >
                  Mark as Completed
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Update Record"
                    : "Create Record"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MaintenanceFormPage;
