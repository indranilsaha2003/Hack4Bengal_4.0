import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`rounded-lg border p-6 flex flex-col h-full shadow-sm ${colorClasses[color as keyof typeof colorClasses] || colorClasses.blue}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-sm opacity-75 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-md bg-white bg-opacity-50">{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  );
};

export default DashboardCard;