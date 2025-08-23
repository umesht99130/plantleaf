import React, { useRef, useState } from 'react';
import { Upload, FileImage, Scan } from 'lucide-react';
import { DetectionResult } from '../types';
import { detectPlantDisease } from '../utils/diseaseDetection';

interface FileUploadProps {
  onDetectionResult: (result: DetectionResult) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onDetectionResult,
  isProcessing,
  setIsProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile || !imagePreview || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const result = await detectPlantDisease(imagePreview);
      onDetectionResult(result);
    } catch (error) {
      console.error('Detection error:', error);
    }
    
    setIsProcessing(false);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">File Upload Detection</h2>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!imagePreview ? (
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload plant leaf image</p>
              <p className="text-sm text-gray-400">Supports: JPG, PNG, GIF (Max 10MB)</p>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Selected plant leaf"
                className="max-w-full h-64 mx-auto object-contain rounded-lg"
              />
              <div className="flex gap-2 justify-center">
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={analyzeImage}
                  disabled={isProcessing}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all ${
                    isProcessing
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Scan className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  {isProcessing ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileImage className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-800">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};