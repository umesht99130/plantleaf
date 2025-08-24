import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { DetectionResult, CameraState } from '../types';
import { detectPlantDisease, preprocessImage } from '../utils/diseaseDetection';
import * as faceapi from 'face-api.js';

interface CameraCaptureProps {
  onDetectionResult: (result: DetectionResult) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onDetectionResult,
  isProcessing,
  setIsProcessing
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraState, setCameraState] = useState<CameraState>({
    isActive: false,
    stream: null,
    isProcessing: false
  });

  // Load face detection model once
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models'); // models folder must contain weights
      } catch (error) {
        console.error("Error loading face detection model:", error);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'environment'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraState({ isActive: true, stream, isProcessing: false });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }
    setCameraState({ isActive: false, stream: null, isProcessing: false });
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);

      // ✅ First check for human face
      const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions());
      if (detections.length > 0) {
        alert("❌ Human face detected! Only plant leaf images are allowed.");
        setIsProcessing(false);
        return;
      }

      // ✅ If no face found → preprocess & detect disease
      const processedImageData = preprocessImage(canvas);
      
      try {
        const result = await detectPlantDisease(processedImageData);
        onDetectionResult(result);
      } catch (error) {
        console.error('Detection error:', error);
      }
    }
    
    setIsProcessing(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Real-time Camera Detection</h2>
        <div className="flex gap-3">
          {!cameraState.isActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Camera className="w-4 h-4" />
              Start Camera
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              Stop Camera
            </button>
          )}
        </div>
      </div>

      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className={`w-full h-80 bg-gray-100 rounded-lg object-cover ${
            !cameraState.isActive ? 'hidden' : ''
          }`}
        />
        
        {!cameraState.isActive && (
          <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Click "Start Camera" to begin detection</p>
            </div>
          </div>
        )}

        {cameraState.isActive && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={captureAndAnalyze}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-all ${
                isProcessing
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <Scan className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? 'Analyzing...' : 'Analyze Leaf'}
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
