import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserMinus, UserPlus, Briefcase, Building2, School, ArrowRight } from 'lucide-react';
import { useAttrition } from '../context/AttritionContext';
import DashboardCard from '../components/DashboardCard';
import FeatureImportanceChart from '../components/FeatureImportanceChart';

const Dashboard: React.FC = () => {
  const { originalData, isModelLoaded, featureImportance } = useAttrition();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    attritionRate: 0,
    avgAge: 0,
    avgYearsAtCompany: 0,
    topDepartments: [] as { name: string; count: number }[],
    avgSalary: 0,
  });

  useEffect(() => {
    if (originalData.length > 0) {
      // Calculate dashboard statistics
      const attritionCount = originalData.filter((emp) => emp.Attrition === 'Yes').length;
      const attritionRate = attritionCount / originalData.length;
      
      const ages = originalData.map((emp) => emp.Age);
      const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
      
      const yearsAtCompany = originalData.map((emp) => emp.YearsAtCompany);
      const avgYearsAtCompany = yearsAtCompany.reduce((sum, years) => sum + years, 0) / yearsAtCompany.length;
      
      const monthlySalaries = originalData.map((emp) => emp.MonthlyIncome);
      const avgSalary = monthlySalaries.reduce((sum, salary) => sum + salary, 0) / monthlySalaries.length;
      
      // Get top departments
      const departmentCounts: Record<string, number> = {};
      originalData.forEach((emp) => {
        departmentCounts[emp.Department] = (departmentCounts[emp.Department] || 0) + 1;
      });
      
      const topDepartments = Object.entries(departmentCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
      
      setStats({
        totalEmployees: originalData.length,
        attritionRate,
        avgAge,
        avgYearsAtCompany,
        topDepartments,
        avgSalary,
      });
    }
  }, [originalData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Employee Attrition Dashboard</h1>
        <Link
          to="/predict"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Predict Employee Attrition <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users className="h-6 w-6" />}
          color="blue"
        />
        <DashboardCard
          title="Attrition Rate"
          value={`${(stats.attritionRate * 100).toFixed(1)}%`}
          icon={<UserMinus className="h-6 w-6" />}
          color="red"
          subtitle={`${Math.round(stats.attritionRate * stats.totalEmployees)} employees left`}
        />
        <DashboardCard
          title="Average Monthly Income"
          value={`$${Math.round(stats.avgSalary).toLocaleString()}`}
          icon={<Briefcase className="h-6 w-6" />}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Average Age"
          value={stats.avgAge.toFixed(1)}
          icon={<UserPlus className="h-6 w-6" />}
          color="teal"
        />
        <DashboardCard
          title="Average Tenure"
          value={`${stats.avgYearsAtCompany.toFixed(1)} years`}
          icon={<Building2 className="h-6 w-6" />}
          color="purple"
        />
        <DashboardCard
          title="Top Department"
          value={stats.topDepartments[0]?.name || 'N/A'}
          icon={<School className="h-6 w-6" />}
          color="orange"
          subtitle={`${stats.topDepartments[0]?.count || 0} employees`}
        />
      </div>

      {isModelLoaded && featureImportance && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Attrition Factors</h2>
          <div className="h-80">
            <FeatureImportanceChart featureImportance={featureImportance} />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This chart shows the most important factors that influence employee attrition according to our machine learning model.
            Higher values indicate factors that have a stronger influence on whether an employee stays or leaves.
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Actions to Take</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="font-medium text-blue-800 mb-2">Predict Attrition Risk</h3>
            <p className="text-sm text-gray-700 mb-4">
              Use our ML model to predict which employees are at risk of leaving the company.
            </p>
            <Link
              to="/predict"
              className="text-blue-600 font-medium text-sm inline-flex items-center"
            >
              Go to prediction tool <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="font-medium text-green-800 mb-2">Explore Model Performance</h3>
            <p className="text-sm text-gray-700 mb-4">
              See how accurately our model predicts employee attrition and view detailed metrics.
            </p>
            <Link
              to="/performance"
              className="text-green-600 font-medium text-sm inline-flex items-center"
            >
              View model metrics <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;