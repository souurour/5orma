import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
}

export const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUploaded(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-slate-200 hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <ImageIcon className="h-6 w-6 text-slate-500" />
      </div>
      <h3 className="mt-4 text-lg font-medium">Upload Medical Image</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Drag and drop your image here, or click to browse
      </p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="relative"
          onClick={(e) => {
            e.stopPropagation();
            openFileDialog();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select File
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, DICOM, TIFF, NIfTI
      </p>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*,.dcm,.nii,.nii.gz"
        onChange={handleFileSelect}
      />
    </div>
  );
};
