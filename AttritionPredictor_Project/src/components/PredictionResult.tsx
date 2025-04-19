import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';

interface PredictionResultProps {
  probability: number;
  willLeave: boolean;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ probability, willLeave }) => {
  // Format probability as percentage
  const formattedProbability = `${(probability * 100).toFixed(1)}%`;
  
  return (
    <div className="mt-8 rounded-lg shadow-md overflow-hidden border">
      <div className={`px-6 py-4 ${willLeave ? 'bg-red-50' : 'bg-green-50'}`}>
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${willLeave ? 'bg-red-100' : 'bg-green-100'}`}>
            {willLeave ? (
              <AlertTriangle className="h-6 w-6 text-red-600" />
            ) : (
              <Check className="h-6 w-6 text-green-600" />
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {willLeave
                ? 'Employee is likely to leave'
                : 'Employee is likely to stay'}
            </h3>
            <p className={`text-sm ${willLeave ? 'text-red-700' : 'text-green-700'}`}>
              Attrition probability: <span className="font-bold">{formattedProbability}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-white">
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Interpretation
          </h4>
          <p className="mt-2 text-gray-700">
            {willLeave ? (
              <>
                The model predicts this employee has a <strong>{formattedProbability}</strong> chance of leaving the company. 
                Consider reviewing their job satisfaction, compensation, or work environment factors.
              </>
            ) : (
              <>
                The model predicts this employee has a <strong>{formattedProbability}</strong> chance of leaving the company.
                They appear likely to remain with the organization based on the provided characteristics.
              </>
            )}
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Confidence Level
          </h4>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${willLeave ? 'bg-red-600' : 'bg-green-600'}`}
              style={{ width: formattedProbability }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;