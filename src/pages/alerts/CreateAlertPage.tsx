import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAlerts } from "@/contexts/AlertContext";
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
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { ALERT_PRIORITY } from "@/config/constants";

// Define form schema
const formSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(100, { message: "Title cannot exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
  machineId: z.string({
    required_error: "Please select a machine",
  }),
  priority: z.enum(["low", "medium", "critical"], {
    required_error: "Please select a priority level",
  }),
});

type FormData = z.infer<typeof formSchema>;

const CreateAlertPage = () => {
  const { createAlert, error: alertError } = useAlerts();
  const { machines, fetchMachines } = useMachines();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  // Fetch machines for dropdown
  useEffect(() => {
    fetchMachines();
  }, []);

  const selectedPriority = watch("priority");

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      await createAlert({
        title: data.title,
        description: data.description,
        machineId: data.machineId,
        priority: data.priority as "low" | "medium" | "critical",
      });
      navigate("/alerts");
    } catch (error: any) {
      setSubmissionError(
        error.message || "Failed to create alert. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Submit New Alert</h1>
        <p className="text-muted-foreground">
          Report an issue or problem with a machine
        </p>
      </div>

      {(submissionError || alertError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{submissionError || alertError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Machine Alert Details</CardTitle>
            <CardDescription>
              Provide details about the issue you're reporting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="machine">Machine</Label>
              <Select onValueChange={(value) => setValue("machineId", value)}>
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

            <div className="space-y-2">
              <Label htmlFor="title">Issue Title</Label>
              <Input
                id="title"
                {...register("title")}
                className={errors.title ? "border-red-500" : ""}
                placeholder="Brief description of the issue"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                placeholder="Provide details about the issue, what happened, when it started, etc."
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                defaultValue="medium"
                onValueChange={(value) =>
                  setValue("priority", value as "low" | "medium" | "critical")
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALERT_PRIORITY.LOW}>Low</SelectItem>
                  <SelectItem value={ALERT_PRIORITY.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={ALERT_PRIORITY.CRITICAL}>
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-3">
                {selectedPriority === ALERT_PRIORITY.LOW && (
                  <Alert
                    variant="outline"
                    className="bg-green-50 border-green-200"
                  >
                    <Info className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">
                      Low Priority
                    </AlertTitle>
                    <AlertDescription className="text-green-700">
                      Minor issues that don't affect production. Will be
                      addressed in regular maintenance.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedPriority === ALERT_PRIORITY.MEDIUM && (
                  <Alert
                    variant="outline"
                    className="bg-yellow-50 border-yellow-200"
                  >
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle className="text-yellow-800">
                      Medium Priority
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Issues affecting performance but not stopping production.
                      Will be addressed within 24 hours.
                    </AlertDescription>
                  </Alert>
                )}

                {selectedPriority === ALERT_PRIORITY.CRITICAL && (
                  <Alert variant="outline" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">
                      Critical Priority
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      Urgent issues stopping production or creating safety
                      hazards. Will be addressed immediately.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/alerts")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Alert"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateAlertPage;
