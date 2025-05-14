import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from "lucide-react";

interface ImageViewerProps {
  imageUrl: string;
}

export const ImageViewer = ({ imageUrl }: ImageViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360);
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end gap-2 p-2 bg-slate-50 border-b">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider
          value={[zoom]}
          min={50}
          max={200}
          step={5}
          className="w-32"
          onValueChange={(value) => setZoom(value[0])}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleRotateCounterClockwise}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleRotateClockwise}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-slate-900 flex items-center justify-center p-4 min-h-[300px]">
        <div
          className="overflow-hidden flex items-center justify-center"
          style={{ maxHeight: "500px" }}
        >
          <img
            src={imageUrl}
            alt="Medical Image"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: "transform 0.2s ease",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
