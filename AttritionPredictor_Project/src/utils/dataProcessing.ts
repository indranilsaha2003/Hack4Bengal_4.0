import * as tf from '@tensorflow/tfjs';
import { Employee } from '../types';

// Process the data for machine learning
export const processData = (data: Employee[]) => {
  // Collect unique values for categorical features
  const categoricalFeatures = [
    'BusinessTravel', 'Department', 'EducationField', 
    'Gender', 'JobRole', 'MaritalStatus', 'OverTime'
  ];
  
  const encodings: Record<string, Record<string, number>> = {};
  
  categoricalFeatures.forEach(feature => {
    encodings[feature] = {};
    const uniqueValues = [...new Set(data.map(item => item[feature as keyof typeof item]))];
    uniqueValues.forEach((value, index) => {
      encodings[feature][value as string] = index;
    });
  });
  
  // Define features to use in the model
  const selectedFeatures = [
    'Age', 'BusinessTravel', 'DailyRate', 'Department', 'DistanceFromHome',
    'Education', 'EducationField', 'EnvironmentSatisfaction', 'Gender',
    'JobInvolvement', 'JobLevel', 'JobRole', 'JobSatisfaction',
    'MaritalStatus', 'MonthlyIncome', 'NumCompaniesWorked', 'OverTime',
    'PercentSalaryHike', 'PerformanceRating', 'RelationshipSatisfaction',
    'StockOptionLevel', 'TotalWorkingYears', 'TrainingTimesLastYear',
    'WorkLifeBalance', 'YearsAtCompany', 'YearsInCurrentRole',
    'YearsSinceLastPromotion', 'YearsWithCurrManager'
  ];
  
  // Prepare feature vectors and labels
  const features: number[][] = [];
  const labels: number[][] = [];
  
  data.forEach(employee => {
    const featureVector: number[] = [];
    
    // Process each selected feature
    selectedFeatures.forEach(feature => {
      const value = employee[feature as keyof typeof employee];
      
      if (categoricalFeatures.includes(feature)) {
        // One-hot encode categorical features
        const featureEncoding = encodings[feature];
        const encodedValue = featureEncoding[value as string];
        featureVector.push(encodedValue);
      } else {
        // Normalize numerical features to [0,1] range
        featureVector.push(Number(value));
      }
    });
    
    // Add feature vector
    features.push(featureVector);
    
    // Add label (1 for attrition, 0 for no attrition)
    labels.push([employee.Attrition === 'Yes' ? 1 : 0]);
  });
  
  // Calculate min and max for numerical features for normalization
  const numericalFeatures = selectedFeatures.filter(f => !categoricalFeatures.includes(f));
  
  const minMax: Record<string, { min: number; max: number }> = {};
  
  numericalFeatures.forEach(feature => {
    const values = data.map(item => Number(item[feature as keyof typeof item]));
    minMax[feature] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });
  
  // Normalize features
  const normalizedFeatures = features.map(featureVec => {
    const normalized: number[] = [];
    let idx = 0;
    
    selectedFeatures.forEach(feature => {
      if (categoricalFeatures.includes(feature)) {
        normalized.push(featureVec[idx]);
      } else {
        const { min, max } = minMax[feature];
        const normalizedValue = (featureVec[idx] - min) / (max - min || 1);
        normalized.push(normalizedValue);
      }
      idx++;
    });
    
    return normalized;
  });
  
  // Store encodings for later use
  const fullEncodings = {
    categorical: encodings,
    numerical: minMax
  };
  
  return {
    features: normalizedFeatures,
    labels,
    featureNames: selectedFeatures,
    encodings: fullEncodings
  };
};

// Process a single employee for prediction
export const getOneHotEncodings = (
  employee: Partial<Employee>,
  encodings: any,
  featureNames: string[]
) => {
  const categoricalFeatures = [
    'BusinessTravel', 'Department', 'EducationField', 
    'Gender', 'JobRole', 'MaritalStatus', 'OverTime'
  ];
  
  const featureVector: number[] = [];
  
  featureNames.forEach(feature => {
    const value = employee[feature as keyof typeof employee];
    
    if (categoricalFeatures.includes(feature)) {
      // One-hot encode categorical features
      const featureEncoding = encodings.categorical[feature];
      const encodedValue = featureEncoding[value as string];
      featureVector.push(encodedValue);
    } else {
      // Normalize numerical features
      const { min, max } = encodings.numerical[feature];
      const normalizedValue = ((value as number) - min) / (max - min || 1);
      featureVector.push(normalizedValue);
    }
  });
  
  return featureVector;
};

// Calculate feature importance
export const getFeatureImportance = async (
  model: tf.LayersModel,
  features: number[][],
  featureNames: string[]
) => {
  // Create a permutation importance calculation
  // We'll measure how much performance drops when each feature is permuted
  
  // First, get baseline prediction
  const numSamples = Math.min(1000, features.length); // Use a subset for efficiency
  const indices = Array.from(Array(features.length).keys()).slice(0, numSamples);
  
  const sampleFeatures = indices.map(i => features[i]);
  const inputTensor = tf.tensor2d(sampleFeatures);
  
  // Get baseline predictions
  const baseline = model.predict(inputTensor) as tf.Tensor;
  const baselinePreds = Array.from(baseline.dataSync());
  
  // Calculate importance for each feature
  const importanceScores: { feature: string; importance: number }[] = [];
  
  for (let featureIdx = 0; featureIdx < featureNames.length; featureIdx++) {
    // Permute this feature
    const permutedFeatures = [...sampleFeatures];
    const originalValues = sampleFeatures.map(f => f[featureIdx]);
    
    // Shuffle the values for this feature
    const shuffledValues = [...originalValues];
    tf.util.shuffle(shuffledValues);
    
    // Replace with shuffled values
    for (let i = 0; i < permutedFeatures.length; i++) {
      permutedFeatures[i] = [...permutedFeatures[i]];
      permutedFeatures[i][featureIdx] = shuffledValues[i];
    }
    
    // Get predictions with permuted feature
    const permutedTensor = tf.tensor2d(permutedFeatures);
    const permutedPreds = model.predict(permutedTensor) as tf.Tensor;
    const permutedPredsArray = Array.from(permutedPreds.dataSync());
    
    // Calculate importance as the difference in predictions
    let importance = 0;
    for (let i = 0; i < baselinePreds.length; i++) {
      importance += Math.abs(baselinePreds[i] - permutedPredsArray[i]);
    }
    importance /= baselinePreds.length;
    
    // Store feature importance
    importanceScores.push({
      feature: featureNames[featureIdx],
      importance
    });
    
    // Clean up tensors
    permutedTensor.dispose();
    permutedPreds.dispose();
  }
  
  // Clean up tensors
  inputTensor.dispose();
  baseline.dispose();
  
  // Sort by importance
  importanceScores.sort((a, b) => b.importance - a.importance);
  
  return importanceScores;
};