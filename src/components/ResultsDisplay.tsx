import React from 'react';
import { AlertCircle, CheckCircle, Clock, Stethoscope, Pill } from 'lucide-react';
import { DetectionResult } from '../types';

interface ResultsDisplayProps {
  results: DetectionResult[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Analysis Results</h3>
        <p className="text-gray-500">Upload an image or use the camera to detect plant diseases</p>
      </div>
    );
  }

  const latestResult = results[0];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'High': return <AlertCircle className="w-5 h-5" />;
      case 'Medium': return <Clock className="w-5 h-5" />;
      case 'Low': return <CheckCircle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Latest Result - Detailed View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Latest Detection Result</h2>
          <span className="text-sm text-gray-500">
            {latestResult.timestamp.toLocaleTimeString()}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Disease Identified</h3>
              <p className="text-xl font-bold text-gray-900">{latestResult.disease}</p>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Confidence Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {(latestResult.confidence * 100).toFixed(1)}%
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(latestResult.severity)}`}>
                  {getSeverityIcon(latestResult.severity)}
                  {latestResult.severity} Severity
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${latestResult.confidence * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Description
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {latestResult.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Pill className="w-4 h-4" />
                Recommended Treatment
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {latestResult.treatment}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {results.length > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detection History</h3>
          <div className="space-y-3">
            {results.slice(1, 6).map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getSeverityColor(result.severity)}`}>
                    {getSeverityIcon(result.severity)}
                    {result.severity}
                  </span>
                  <span className="font-medium text-gray-800">{result.disease}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};