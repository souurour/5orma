import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUploader } from "@/components/classification/ImageUploader";
import { ClassificationResults } from "@/components/classification/ClassificationResults";
import { ImageViewer } from "@/components/shared/ImageViewer";
import { ChevronLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";

// Mock classification data
const mockClassificationResults = {
  predictions: [
    { label: "Pneumonia", probability: 0.87 },
    { label: "Tuberculosis", probability: 0.08 },
    { label: "Normal", probability: 0.05 },
  ],
  processingTime: "2.4 seconds",
  modelUsed: "MedNet-v3",
  imageInfo: {
    dimensions: "1024 x 1024",
    type: "X-Ray",
    size: "1.2 MB",
  },
};

const ImageClassification = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleImageUpload = (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setResults(null);
  };

  const handleClassify = () => {
    if (!uploadedImage) return;

    setIsProcessing(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      setResults(mockClassificationResults);
      setIsProcessing(false);
    }, 2000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setResults(null);
  };

  return (
    <div className="flex-1 container max-w-6xl py-8">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Image Classification</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              {!uploadedImage ? (
                <ImageUploader onImageUploaded={handleImageUpload} />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Preview</h3>
                    <Button variant="outline" size="sm" onClick={handleReset}>
                      Upload Another Image
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <ImageViewer imageUrl={uploadedImage} />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleClassify} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Classify Image"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Classification Results
                </h3>
                <ClassificationResults results={results} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-medium">Instructions</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">1. Upload an Image</h4>
                  <p className="text-muted-foreground">
                    Upload a medical image in JPEG, PNG or DICOM format. Maximum
                    file size is 5MB.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">2. Verify the Image</h4>
                  <p className="text-muted-foreground">
                    Ensure the image is clear and properly oriented before
                    classification.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">3. Run Classification</h4>
                  <p className="text-muted-foreground">
                    Click the "Classify Image" button to process the image with
                    our AI models.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">4. Review Results</h4>
                  <p className="text-muted-foreground">
                    Examine the classification results and save or export them
                    as needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="models">
                <TabsList className="w-full">
                  <TabsTrigger value="models" className="flex-1">
                    Available Models
                  </TabsTrigger>
                  <TabsTrigger value="formats" className="flex-1">
                    Supported Formats
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="models" className="p-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-sm">MedNet-v3</h4>
                    <p className="text-xs text-muted-foreground">
                      General purpose medical imaging model with support for
                      X-rays, CT scans, and MRIs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">NeuroScan</h4>
                    <p className="text-xs text-muted-foreground">
                      Specialized for neurological imaging, optimized for brain
                      MRI and CT scans.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">ChestDX</h4>
                    <p className="text-xs text-muted-foreground">
                      Focused on chest X-rays and CT scans for pulmonary
                      conditions.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="formats" className="p-4">
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      JPEG/JPG (up to 5MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      PNG (up to 5MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      DICOM (up to 20MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      TIFF (up to 10MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      NIfTI (.nii, .nii.gz)
                    </li>
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImageClassification;
