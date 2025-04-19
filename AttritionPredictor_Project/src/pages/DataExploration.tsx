import React, { useState, useEffect } from 'react';
import { useAttrition } from '../context/AttritionContext';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { ArrowUpRight } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DataExploration: React.FC = () => {
  const { originalData } = useAttrition();
  const [selectedFeature, setSelectedFeature] = useState('Department');
  
  const [chartData, setChartData] = useState<{
    attritionByFeature: any;
    featureDistribution: any;
    ageDistribution: any;
    salaryDistribution: any;
  }>({
    attritionByFeature: null,
    featureDistribution: null,
    ageDistribution: null,
    salaryDistribution: null,
  });
  
  useEffect(() => {
    if (originalData.length > 0) {
      updateCharts(selectedFeature);
    }
  }, [originalData, selectedFeature]);
  
  const updateCharts = (feature: string) => {
    // Group data by the selected feature
    const featureGroups: Record<string, { total: number; attrition: number }> = {};
    
    originalData.forEach((employee) => {
      const featureValue = String(employee[feature as keyof typeof employee]);
      
      if (!featureGroups[featureValue]) {
        featureGroups[featureValue] = { total: 0, attrition: 0 };
      }
      
      featureGroups[featureValue].total += 1;
      if (employee.Attrition === 'Yes') {
        featureGroups[featureValue].attrition += 1;
      }
    });
    
    // Prepare data for attrition by feature chart
    const attritionData = {
      labels: Object.keys(featureGroups),
      datasets: [
        {
          label: 'Attrition Rate',
          data: Object.values(featureGroups).map(group => 
            (group.attrition / group.total) * 100
          ),
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    // Prepare data for feature distribution chart
    const distributionData = {
      labels: Object.keys(featureGroups),
      datasets: [
        {
          label: 'Employee Count',
          data: Object.values(featureGroups).map(group => group.total),
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
        },
      ],
    };
    
    // Prepare age distribution data
    const ageGroups: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
    };
    
    originalData.forEach((employee) => {
      const age = employee.Age;
      if (age <= 25) ageGroups['18-25']++;
      else if (age <= 35) ageGroups['26-35']++;
      else if (age <= 45) ageGroups['36-45']++;
      else if (age <= 55) ageGroups['46-55']++;
      else ageGroups['56+']++;
    });
    
    const ageDistribution = {
      labels: Object.keys(ageGroups),
      datasets: [
        {
          label: 'Employee Count',
          data: Object.values(ageGroups),
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 99, 132, 0.7)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    // Prepare salary distribution data
    const salaryGroups: Record<string, number> = {
      '<5K': 0,
      '5K-10K': 0,
      '10K-15K': 0,
      '15K-20K': 0,
      '>20K': 0,
    };
    
    originalData.forEach((employee) => {
      const salary = employee.MonthlyIncome;
      if (salary < 5000) salaryGroups['<5K']++;
      else if (salary < 10000) salaryGroups['5K-10K']++;
      else if (salary < 15000) salaryGroups['10K-15K']++;
      else if (salary < 20000) salaryGroups['15K-20K']++;
      else salaryGroups['>20K']++;
    });
    
    const salaryDistribution = {
      labels: Object.keys(salaryGroups),
      datasets: [
        {
          label: 'Employee Count',
          data: Object.values(salaryGroups),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
        },
      ],
    };
    
    setChartData({
      attritionByFeature: attritionData,
      featureDistribution: distributionData,
      ageDistribution,
      salaryDistribution,
    });
  };
  
  const features = [
    'Department', 
    'JobRole', 
    'MaritalStatus', 
    'Gender', 
    'EducationField', 
    'BusinessTravel',
    'OverTime'
  ];
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Data Exploration</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Analyze Attrition by Feature</h2>
            <p className="text-gray-600 text-sm mt-1">Select a feature to explore its relationship with employee attrition</p>
          </div>
          
          <div className="mt-3 sm:mt-0">
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              {features.map(feature => (
                <option key={feature} value={feature}>{feature}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {chartData.attritionByFeature && (
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium mb-4 text-gray-700">Attrition Rate by {selectedFeature}</h3>
              <div className="h-80">
                <Bar
                  data={chartData.attritionByFeature}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Attrition Rate (%)',
                        },
                        max: 100,
                      },
                      x: {
                        title: {
                          display: true,
                          text: selectedFeature,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          
          {chartData.featureDistribution && (
            <div className="border rounded-lg p-4">
              <h3 className="text-md font-medium mb-4 text-gray-700">Employee Distribution by {selectedFeature}</h3>
              <div className="h-80">
                <Bar
                  data={chartData.featureDistribution}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Number of Employees',
                        },
                      },
                      x: {
                        title: {
                          display: true,
                          text: selectedFeature,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartData.ageDistribution && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
            <div className="h-64">
              <Doughnut
                data={chartData.ageDistribution}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        
        {chartData.salaryDistribution && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Income Distribution</h2>
            <div className="h-64">
              <Bar
                data={chartData.salaryDistribution}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Employees',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Monthly Income',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 bg-blue-50 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-2">Key Insights</h2>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Employees working overtime show higher attrition rates than those who don't work overtime.</span>
          </li>
          <li className="flex items-start">
            <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Younger employees (18-35) tend to leave more frequently than older employees.</span>
          </li>
          <li className="flex items-start">
            <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Single employees have higher attrition rates compared to married employees.</span>
          </li>
          <li className="flex items-start">
            <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Lower monthly income correlates with higher attrition rates.</span>
          </li>
          <li className="flex items-start">
            <ArrowUpRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <span>Employees who travel frequently show higher attrition compared to those who rarely travel.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DataExploration;