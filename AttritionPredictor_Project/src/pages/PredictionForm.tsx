import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAttrition } from '../context/AttritionContext';
import PredictionResult from '../components/PredictionResult';
import { ArrowRight } from 'lucide-react';

const PredictionForm: React.FC = () => {
  const { predictAttrition, isModelLoaded } = useAttrition();
  const [formData, setFormData] = useState({
    Age: 30,
    DailyRate: 500,
    DistanceFromHome: 5,
    Education: 3,
    EnvironmentSatisfaction: 3,
    JobInvolvement: 3,
    JobLevel: 2,
    JobSatisfaction: 3,
    MonthlyIncome: 5000,
    NumCompaniesWorked: 2,
    PercentSalaryHike: 15,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 1,
    TotalWorkingYears: 5,
    TrainingTimesLastYear: 2,
    WorkLifeBalance: 3,
    YearsAtCompany: 3,
    YearsInCurrentRole: 2,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 2,
    BusinessTravel: 'Travel_Rarely',
    Department: 'Research & Development',
    EducationField: 'Life Sciences',
    Gender: 'Male',
    JobRole: 'Research Scientist',
    MaritalStatus: 'Single',
    OverTime: 'No'
  });

  const [predictionResult, setPredictionResult] = useState<{ probability: number; willLeave: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric inputs to numbers
    const numericFields = [
      'Age', 'DailyRate', 'DistanceFromHome', 'Education', 'EnvironmentSatisfaction',
      'JobInvolvement', 'JobLevel', 'JobSatisfaction', 'MonthlyIncome', 'NumCompaniesWorked',
      'PercentSalaryHike', 'PerformanceRating', 'RelationshipSatisfaction', 'StockOptionLevel',
      'TotalWorkingYears', 'TrainingTimesLastYear', 'WorkLifeBalance', 'YearsAtCompany',
      'YearsInCurrentRole', 'YearsSinceLastPromotion', 'YearsWithCurrManager'
    ];

    const newValue = numericFields.includes(name) ? Number(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isModelLoaded) {
      toast.error('Model is not yet loaded. Please wait a moment and try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await predictAttrition(formData);
      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('An error occurred during prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const BusinessTravelOptions = ['Non-Travel', 'Travel_Rarely', 'Travel_Frequently'];
  const DepartmentOptions = ['Research & Development', 'Sales', 'Human Resources'];
  const EducationFieldOptions = ['Life Sciences', 'Medical', 'Marketing', 'Technical Degree', 'Human Resources', 'Other'];
  const GenderOptions = ['Male', 'Female'];
  const JobRoleOptions = [
    'Research Scientist', 'Laboratory Technician', 'Manufacturing Director', 
    'Healthcare Representative', 'Manager', 'Sales Representative', 
    'Research Director', 'Human Resources', 'Sales Executive'
  ];
  const MaritalStatusOptions = ['Single', 'Married', 'Divorced'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Predict Employee Attrition</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Employee Information</h2>
          <p className="text-gray-600 mt-1">
            Enter employee details to predict their likelihood of leaving the company.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="mb-4">
                <label htmlFor="Age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  id="Age"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  min="18"
                  max="65"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="Gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  id="Gender"
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  {GenderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="MaritalStatus" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  id="MaritalStatus"
                  name="MaritalStatus"
                  value={formData.MaritalStatus}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  {MaritalStatusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="DistanceFromHome" className="block text-sm font-medium text-gray-700 mb-1">Distance From Home (miles)</label>
                <input
                  type="number"
                  id="DistanceFromHome"
                  name="DistanceFromHome"
                  value={formData.DistanceFromHome}
                  onChange={handleChange}
                  min="1"
                  max="50"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            
            {/* Job Information */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Job Information</h3>
              
              <div className="mb-4">
                <label htmlFor="Department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  id="Department"
                  name="Department"
                  value={formData.Department}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  {DepartmentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="JobRole" className="block text-sm font-medium text-gray-700 mb-1">Job Role</label>
                <select
                  id="JobRole"
                  name="JobRole"
                  value={formData.JobRole}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  {JobRoleOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="JobLevel" className="block text-sm font-medium text-gray-700 mb-1">Job Level (1-5)</label>
                <input
                  type="number"
                  id="JobLevel"
                  name="JobLevel"
                  value={formData.JobLevel}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="MonthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">Monthly Income ($)</label>
                <input
                  type="number"
                  id="MonthlyIncome"
                  name="MonthlyIncome"
                  value={formData.MonthlyIncome}
                  onChange={handleChange}
                  min="1000"
                  max="20000"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            
            {/* Work Experience */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Work Experience</h3>
              
              <div className="mb-4">
                <label htmlFor="YearsAtCompany" className="block text-sm font-medium text-gray-700 mb-1">Years at Company</label>
                <input
                  type="number"
                  id="YearsAtCompany"
                  name="YearsAtCompany"
                  value={formData.YearsAtCompany}
                  onChange={handleChange}
                  min="0"
                  max="40"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="TotalWorkingYears" className="block text-sm font-medium text-gray-700 mb-1">Total Working Years</label>
                <input
                  type="number"
                  id="TotalWorkingYears"
                  name="TotalWorkingYears"
                  value={formData.TotalWorkingYears}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="YearsSinceLastPromotion" className="block text-sm font-medium text-gray-700 mb-1">Years Since Last Promotion</label>
                <input
                  type="number"
                  id="YearsSinceLastPromotion"
                  name="YearsSinceLastPromotion"
                  value={formData.YearsSinceLastPromotion}
                  onChange={handleChange}
                  min="0"
                  max="15"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="BusinessTravel" className="block text-sm font-medium text-gray-700 mb-1">Business Travel</label>
                <select
                  id="BusinessTravel"
                  name="BusinessTravel"
                  value={formData.BusinessTravel}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  {BusinessTravelOptions.map(option => (
                    <option key={option} value={option}>{option.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Satisfaction Metrics */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Satisfaction Metrics (1-4)</h3>
              
              <div className="mb-4">
                <label htmlFor="JobSatisfaction" className="block text-sm font-medium text-gray-700 mb-1">Job Satisfaction</label>
                <input
                  type="number"
                  id="JobSatisfaction"
                  name="JobSatisfaction"
                  value={formData.JobSatisfaction}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="EnvironmentSatisfaction" className="block text-sm font-medium text-gray-700 mb-1">Environment Satisfaction</label>
                <input
                  type="number"
                  id="EnvironmentSatisfaction"
                  name="EnvironmentSatisfaction"
                  value={formData.EnvironmentSatisfaction}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="WorkLifeBalance" className="block text-sm font-medium text-gray-700 mb-1">Work Life Balance</label>
                <input
                  type="number"
                  id="WorkLifeBalance"
                  name="WorkLifeBalance"
                  value={formData.WorkLifeBalance}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="RelationshipSatisfaction" className="block text-sm font-medium text-gray-700 mb-1">Relationship Satisfaction</label>
                <input
                  type="number"
                  id="RelationshipSatisfaction"
                  name="RelationshipSatisfaction"
                  value={formData.RelationshipSatisfaction}
                  onChange={handleChange}
                  min="1"
                  max="4"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            
            {/* Additional Factors */}
            <div>
              <h3 className="font-medium text-gray-900 mb-4">Additional Factors</h3>
              
              <div className="mb-4">
                <label htmlFor="OverTime" className="block text-sm font-medium text-gray-700 mb-1">Works Overtime</label>
                <select
                  id="OverTime"
                  name="OverTime"
                  value={formData.OverTime}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="StockOptionLevel" className="block text-sm font-medium text-gray-700 mb-1">Stock Option Level (0-3)</label>
                <input
                  type="number"
                  id="StockOptionLevel"
                  name="StockOptionLevel"
                  value={formData.StockOptionLevel}
                  onChange={handleChange}
                  min="0"
                  max="3"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="PercentSalaryHike" className="block text-sm font-medium text-gray-700 mb-1">Last Salary Hike (%)</label>
                <input
                  type="number"
                  id="PercentSalaryHike"
                  name="PercentSalaryHike"
                  value={formData.PercentSalaryHike}
                  onChange={handleChange}
                  min="0"
                  max="25"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="TrainingTimesLastYear" className="block text-sm font-medium text-gray-700 mb-1">Training Sessions Last Year</label>
                <input
                  type="number"
                  id="TrainingTimesLastYear"
                  name="TrainingTimesLastYear"
                  value={formData.TrainingTimesLastYear}
                  onChange={handleChange}
                  min="0"
                  max="6"
                  className="block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !isModelLoaded}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white 
                ${isLoading || !isModelLoaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
            >
              {isLoading ? 'Processing...' : 'Predict Attrition'} <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Prediction Result */}
      {predictionResult && (
        <PredictionResult
          probability={predictionResult.probability}
          willLeave={predictionResult.willLeave}
        />
      )}
    </div>
  );
};

export default PredictionForm;