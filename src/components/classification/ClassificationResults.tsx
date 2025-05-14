import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";

interface ClassificationResultsProps {
  results: {
    predictions: Array<{
      label: string;
      probability: number;
    }>;
    processingTime: string;
    modelUsed: string;
    imageInfo: {
      dimensions: string;
      type: string;
      size: string;
    };
  };
}

export const ClassificationResults = ({
  results,
}: ClassificationResultsProps) => {
  // Format percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Determine color based on probability
  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return "text-green-600";
    if (probability >= 0.4) return "text-amber-600";
    return "text-slate-600";
  };

  // Get progress color based on probability
  const getProgressColor = (probability: number) => {
    if (probability >= 0.7) return "bg-green-600";
    if (probability >= 0.4) return "bg-amber-600";
    return "bg-slate-600";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Classification Predictions</h4>
        <div className="space-y-3">
          {results.predictions.map((prediction, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{prediction.label}</span>
                <span
                  className={`text-sm font-medium ${getProbabilityColor(
                    prediction.probability,
                  )}`}
                >
                  {formatPercent(prediction.probability)}
                </span>
              </div>
              <Progress
                value={prediction.probability * 100}
                className={`h-2 ${getProgressColor(prediction.probability)}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Technical Information</h4>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="py-2 text-sm font-medium">
                Processing Time
              </TableCell>
              <TableCell className="py-2 text-sm">
                {results.processingTime}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2 text-sm font-medium">
                Model Used
              </TableCell>
              <TableCell className="py-2 text-sm">
                {results.modelUsed}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2 text-sm font-medium">
                Image Dimensions
              </TableCell>
              <TableCell className="py-2 text-sm">
                {results.imageInfo.dimensions}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2 text-sm font-medium">
                Image Type
              </TableCell>
              <TableCell className="py-2 text-sm">
                {results.imageInfo.type}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="py-2 text-sm font-medium">
                File Size
              </TableCell>
              <TableCell className="py-2 text-sm">
                {results.imageInfo.size}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  );
};
