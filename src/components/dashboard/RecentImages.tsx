import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock data for recent images
const recentImagesData = [
  {
    id: 1,
    name: "Brain MRI - Frontal View",
    timestamp: new Date(2023, 9, 15, 14, 30),
    classification: "Normal",
    flagged: false,
    thumbnail: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Chest X-Ray",
    timestamp: new Date(2023, 9, 14, 10, 15),
    classification: "Pneumonia",
    flagged: true,
    thumbnail: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Abdominal CT Scan",
    timestamp: new Date(2023, 9, 13, 16, 45),
    classification: "Normal",
    flagged: false,
    thumbnail: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Knee MRI",
    timestamp: new Date(2023, 9, 12, 9, 0),
    classification: "ACL Tear",
    flagged: true,
    thumbnail: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Spine X-Ray",
    timestamp: new Date(2023, 9, 11, 13, 20),
    classification: "Scoliosis",
    flagged: false,
    thumbnail: "/placeholder.svg",
  },
  {
    id: 6,
    name: "Brain CT Scan",
    timestamp: new Date(2023, 9, 10, 11, 10),
    classification: "Hemorrhage",
    flagged: true,
    thumbnail: "/placeholder.svg",
  },
];

interface RecentImagesProps {
  flaggedOnly?: boolean;
}

export const RecentImages = ({ flaggedOnly = false }: RecentImagesProps) => {
  const images = flaggedOnly
    ? recentImagesData.filter((image) => image.flagged)
    : recentImagesData;

  return (
    <div className="divide-y">
      {images.length > 0 ? (
        images.map((image) => (
          <div
            key={image.id}
            className="flex items-center gap-3 p-4 hover:bg-muted/50"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-slate-100">
              <img
                src={image.thumbnail}
                alt={image.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{image.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    image.classification === "Normal" ? "outline" : "default"
                  }
                  className={cn(
                    "text-xs",
                    image.flagged && "bg-destructive hover:bg-destructive/80",
                  )}
                >
                  {image.classification}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(image.timestamp, "MMM d, HH:mm")}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-muted-foreground">
          No images found
        </div>
      )}
    </div>
  );
};
