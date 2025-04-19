import React from 'react';

interface ConfusionMatrixProps {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  truePositive,
  falsePositive,
  trueNegative,
  falseNegative,
}) => {
  const total = truePositive + falsePositive + trueNegative + falseNegative;
  
  const formatPercentage = (value: number) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  return (
    <div className="overflow-hidden rounded-lg shadow">
      <div className="p-4 bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Confusion Matrix</h3>
        
        <div className="grid grid-cols-2 gap-1 max-w-md mx-auto">
          <div className="flex justify-center items-center p-2 bg-gray-100 font-semibold">
            Predicted ↓ / Actual →
          </div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex justify-center items-center p-2 bg-gray-100 font-semibold">Stays</div>
            <div className="flex justify-center items-center p-2 bg-gray-100 font-semibold">Leaves</div>
          </div>
          
          <div className="flex justify-center items-center p-2 bg-gray-100 font-semibold">Stays</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col justify-center items-center p-3 bg-green-100 text-green-800 rounded">
              <span className="font-bold">{trueNegative}</span>
              <span className="text-xs mt-1">True Negative</span>
              <span className="text-xs">{formatPercentage(trueNegative)}</span>
            </div>
            <div className="flex flex-col justify-center items-center p-3 bg-red-100 text-red-800 rounded">
              <span className="font-bold">{falseNegative}</span>
              <span className="text-xs mt-1">False Negative</span>
              <span className="text-xs">{formatPercentage(falseNegative)}</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center p-2 bg-gray-100 font-semibold">Leaves</div>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col justify-center items-center p-3 bg-red-100 text-red-800 rounded">
              <span className="font-bold">{falsePositive}</span>
              <span className="text-xs mt-1">False Positive</span>
              <span className="text-xs">{formatPercentage(falsePositive)}</span>
            </div>
            <div className="flex flex-col justify-center items-center p-3 bg-green-100 text-green-800 rounded">
              <span className="font-bold">{truePositive}</span>
              <span className="text-xs mt-1">True Positive</span>
              <span className="text-xs">{formatPercentage(truePositive)}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <ul className="space-y-1 list-disc pl-5">
            <li><strong>True Negative:</strong> Correctly predicted employees who stayed</li>
            <li><strong>False Negative:</strong> Incorrectly predicted employees who left as staying</li>
            <li><strong>False Positive:</strong> Incorrectly predicted employees who stayed as leaving</li>
            <li><strong>True Positive:</strong> Correctly predicted employees who left</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConfusionMatrix;