import React from 'react';

interface MetricsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, description, icon }) => {
  // Format the value as a percentage with 1 decimal place
  const formattedValue = `${(value * 100).toFixed(1)}%`;
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {formattedValue}
              </div>
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm text-gray-500">
          {description}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;