import { ClassificationResult, ImageInfo } from "./types";

/**
 * Mock service for image classification
 * In a real app, this would connect to a backend API
 */

// Mock function to simulate uploading an image
export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would return a URL or ID from the server
      resolve("image-" + Math.random().toString(36).substring(2, 15));
    }, 1500);
  });
};

// Mock function to get image info
export const getImageInfo = async (imageUrl: string): Promise<ImageInfo> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Random image info
      resolve({
        dimensions: `${Math.floor(Math.random() * 1000) + 500} x ${
          Math.floor(Math.random() * 1000) + 500
        }`,
        type: ["X-Ray", "MRI", "CT Scan", "Ultrasound"][
          Math.floor(Math.random() * 4)
        ],
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      });
    }, 800);
  });
};

// Mock function to classify an image
export const classifyImage = async (
  imageUrl: string,
): Promise<ClassificationResult> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // Simulate different classification results
      const conditions = [
        "Normal",
        "Pneumonia",
        "Tuberculosis",
        "Fracture",
        "Tumor",
        "Hemorrhage",
      ];

      // Generate random predictions with the highest probability for a random condition
      const topConditionIndex = Math.floor(Math.random() * conditions.length);
      const topProbability = Math.random() * 0.3 + 0.7; // Between 0.7 and 1.0

      // Generate remaining probabilities for other conditions
      const predictions = conditions.map((condition, index) => {
        if (index === topConditionIndex) {
          return {
            label: condition,
            probability: topProbability,
          };
        }

        // Generate smaller probabilities for other conditions
        const probability = Math.random() * (1 - topProbability);
        return {
          label: condition,
          probability,
        };
      });

      // Sort predictions by probability in descending order
      predictions.sort((a, b) => b.probability - a.probability);

      // Take top 3 predictions and normalize
      const topPredictions = predictions.slice(0, 3);
      const sum = topPredictions.reduce(
        (acc, pred) => acc + pred.probability,
        0,
      );
      const normalizedPredictions = topPredictions.map((pred) => ({
        ...pred,
        probability: pred.probability / sum,
      }));

      resolve({
        predictions: normalizedPredictions,
        processingTime: `${(Math.random() * 3 + 0.5).toFixed(1)} seconds`,
        modelUsed: ["MedNet-v3", "NeuroScan", "ChestDX"][
          Math.floor(Math.random() * 3)
        ],
        imageInfo: {
          dimensions: `${Math.floor(Math.random() * 1000) + 500} x ${
            Math.floor(Math.random() * 1000) + 500
          }`,
          type: ["X-Ray", "MRI", "CT Scan", "Ultrasound"][
            Math.floor(Math.random() * 4)
          ],
          size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        },
      });
    }, 2000);
  });
};

// Mock function to save classification result
export const saveResult = async (
  result: ClassificationResult,
): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would return a result ID from the server
      resolve("result-" + Math.random().toString(36).substring(2, 15));
    }, 1000);
  });
};

// Mock function to get all classification results
export const getResults = async (): Promise<ClassificationResult[]> => {
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would fetch results from the server
      resolve([]);
    }, 1000);
  });
};
