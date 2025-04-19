import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FeatureImportanceChartProps {
  featureImportance: { feature: string; importance: number }[];
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureImportance }) => {
  // Sort features by importance and take top 10
  const sortedFeatures = [...featureImportance]
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 10);

  const data = {
    labels: sortedFeatures.map(item => item.feature),
    datasets: [
      {
        label: 'Feature Importance',
        data: sortedFeatures.map(item => item.importance),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Top 10 Features by Importance',
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Importance: ${context.formattedValue}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Importance Score',
        },
        ticks: {
          precision: 2,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Feature',
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-96">
      <Bar data={data} options={options} />
    </div>
  );
};

export default FeatureImportanceChart;