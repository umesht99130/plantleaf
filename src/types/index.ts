export interface DetectionResult {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string;
  timestamp: Date;
}

export interface PlantDiseases {
  [key: string]: {
    name: string;
    description: string;
    treatment: string;
    severity: 'Low' | 'Medium' | 'High';
  };
}

export interface CameraState {
  isActive: boolean;
  stream: MediaStream | null;
  isProcessing: boolean;
}