import { DetectionResult, PlantDiseases } from '../types';

const plantDiseases: PlantDiseases = {
  'Healthy': {
    name: 'Healthy Leaf',
    description: 'The leaf appears to be healthy with no visible signs of disease.',
    treatment: 'Continue regular care and monitoring.',
    severity: 'Low'
  },
  'Late Blight': {
    name: 'Late Blight (Phytophthora infestans)',
    description: 'A serious disease causing dark, water-soaked lesions on leaves.',
    treatment: 'Apply copper-based fungicides and remove affected plant parts.',
    severity: 'High'
  },
  'Early Blight': {
    name: 'Early Blight (Alternaria solani)',
    description: 'Characterized by brown spots with concentric rings on older leaves.',
    treatment: 'Use fungicides containing chlorothalonil or copper compounds.',
    severity: 'Medium'
  },
  'Leaf Mold': {
    name: 'Leaf Mold (Passalora fulva)',
    description: 'Yellow spots on leaf surfaces with olive-green mold underneath.',
    treatment: 'Improve air circulation and reduce humidity. Apply fungicides.',
    severity: 'Medium'
  },
  'Bacterial Spot': {
    name: 'Bacterial Spot (Xanthomonas)',
    description: 'Small, dark spots with yellow halos on leaves and fruits.',
    treatment: 'Use copper bactericides and maintain good garden hygiene.',
    severity: 'Medium'
  },
  'Mosaic Virus': {
    name: 'Mosaic Virus',
    description: 'Mottled light and dark green areas creating a mosaic pattern.',
    treatment: 'Remove infected plants and control aphid vectors.',
    severity: 'High'
  }
};

// Simulate CNN model prediction
export const detectPlantDisease = async (imageData: string): Promise<DetectionResult> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const diseases = Object.keys(plantDiseases);
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = 0.7 + Math.random() * 0.25; // 70-95% confidence
  
  const diseaseInfo = plantDiseases[randomDisease];
  
  return {
    disease: randomDisease,
    confidence: Math.round(confidence * 100) / 100,
    severity: diseaseInfo.severity,
    description: diseaseInfo.description,
    treatment: diseaseInfo.treatment,
    timestamp: new Date()
  };
};

export const preprocessImage = (canvas: HTMLCanvasElement): string => {
  // Simulate image preprocessing for CNN
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Apply some visual effects to simulate preprocessing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Simple contrast enhancement simulation
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * 1.1);     // Red
    data[i + 1] = Math.min(255, data[i + 1] * 1.1); // Green
    data[i + 2] = Math.min(255, data[i + 2] * 1.1); // Blue
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};