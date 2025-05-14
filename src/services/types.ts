// Classification related types

export interface ImageInfo {
  dimensions: string;
  type: string;
  size: string;
}

export interface Prediction {
  label: string;
  probability: number;
}

export interface ClassificationResult {
  predictions: Prediction[];
  processingTime: string;
  modelUsed: string;
  imageInfo: ImageInfo;
}

export interface PatientInfo {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  notes?: string;
}

export interface ClassificationSession {
  id: string;
  imageUrl: string;
  result: ClassificationResult;
  date: Date;
  patientInfo?: PatientInfo;
  notes?: string;
}

// User and authentication types

export interface User {
  id: string;
  name: string;
  email: string;
  role: "doctor" | "technician" | "admin";
  department?: string;
  lastActive?: Date;
}

// Dashboard related types

export interface StatData {
  label: string;
  value: number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
}

export interface ActivityData {
  date: string;
  value: number;
}

export interface RecentImage {
  id: string;
  name: string;
  timestamp: Date;
  classification: string;
  flagged: boolean;
  thumbnail: string;
}
