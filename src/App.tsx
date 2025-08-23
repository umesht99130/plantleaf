import React, { useState } from 'react';
import { Leaf, Brain, Camera, Upload } from 'lucide-react';
import { CameraCapture } from './components/CameraCapture';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { DetectionResult } from './types';

function App() {
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDetectionResult = (result: DetectionResult) => {
    setResults(prev => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-600 rounded-xl">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Plant Leaf Disease Detection</h1>
            <div className="p-3 bg-blue-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced Deep Convolutional Neural Network for Real-time Plant Leaf Disease Detection
          </p>
          <div className="mt-4">
            <a 
              href="https://real-time-plant-leaf-q6a7.bolt.host" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Visit Live Site
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Detection Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('camera')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'camera'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Real-time Camera
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === 'upload'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  File Upload
                </button>
              </div>
            </div>

            {/* Detection Interface */}
            {activeTab === 'camera' ? (
              <CameraCapture
                onDetectionResult={handleDetectionResult}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            ) : (
              <FileUpload
                onDetectionResult={handleDetectionResult}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            )}

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <div>
                    <h3 className="font-semibold text-blue-800">CNN Model Processing</h3>
                    <p className="text-blue-600 text-sm">
                      Analyzing image through deep convolutional layers...
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm text-blue-600">
                    <span>Feature Extraction</span>
                    <span>Processing...</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-1">
            <ResultsDisplay results={results} />
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Deep CNN Analysis</h3>
            <p className="text-gray-600 text-sm">
              Advanced convolutional neural networks trained on thousands of plant disease images.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Real-time Detection</h3>
            <p className="text-gray-600 text-sm">
              Instant disease identification through live camera feed with high accuracy.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Treatment Guidance</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive treatment recommendations for identified plant diseases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;