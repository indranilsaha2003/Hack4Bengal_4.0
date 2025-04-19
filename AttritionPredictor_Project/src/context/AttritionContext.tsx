import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as tf from '@tensorflow/tfjs';
import { processData, getOneHotEncodings, getFeatureImportance } from '../utils/dataProcessing';
import { Employee, ModelStats } from '../types';

interface AttritionContextType {
  isModelLoaded: boolean;
  isTraining: boolean;
  modelStats: ModelStats | null;
  featureImportance: { feature: string; importance: number }[] | null;
  originalData: Employee[];
  predictAttrition: (employee: Partial<Employee>) => Promise<{ probability: number; willLeave: boolean }>;
  trainModel: () => Promise<void>;
}

const AttritionContext = createContext<AttritionContextType | undefined>(undefined);

export const useAttrition = () => {
  const context = useContext(AttritionContext);
  if (!context) {
    throw new Error('useAttrition must be used within an AttritionProvider');
  }
  return context;
};

interface AttritionProviderProps {
  children: ReactNode;
}

export const AttritionProvider: React.FC<AttritionProviderProps> = ({ children }) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [modelStats, setModelStats] = useState<ModelStats | null>(null);
  const [featureImportance, setFeatureImportance] = useState<{ feature: string; importance: number }[] | null>(null);
  const [originalData, setOriginalData] = useState<Employee[]>([]);
  const [encodings, setEncodings] = useState<any>({});
  const [preprocessedData, setPreprocessedData] = useState<{
    features: number[][];
    labels: number[][];
    featureNames: string[];
  } | null>(null);

  useEffect(() => {
    // Load the CSV data we embedded in the data.js file
    import('../data/employeeData').then((module) => {
      const data = module.employeeData;
      setOriginalData(data);
      
      // Process data on load
      const { features, labels, featureNames, encodings: encObj } = processData(data);
      setEncodings(encObj);
      setPreprocessedData({ features, labels, featureNames });
      
      // Train model automatically
      trainModelInternal(features, labels, featureNames, encObj);
    });
  }, []);

  const trainModelInternal = async (
    features: number[][],
    labels: number[][],
    featureNames: string[],
    encodingsObj: any
  ) => {
    setIsTraining(true);
    
    try {
      // Split data into training and testing sets (80% training, 20% testing)
      const numSamples = features.length;
      const numTrainSamples = Math.floor(0.8 * numSamples);
      
      // Shuffle the data
      const indices = Array.from(Array(numSamples).keys());
      tf.util.shuffle(indices);
      
      const shuffledFeatures = indices.map(i => features[i]);
      const shuffledLabels = indices.map(i => labels[i]);
      
      const trainFeatures = shuffledFeatures.slice(0, numTrainSamples);
      const trainLabels = shuffledLabels.slice(0, numTrainSamples);
      const testFeatures = shuffledFeatures.slice(numTrainSamples);
      const testLabels = shuffledLabels.slice(numTrainSamples);
      
      // Convert to tensors
      const trainX = tf.tensor2d(trainFeatures);
      const trainY = tf.tensor2d(trainLabels);
      const testX = tf.tensor2d(testFeatures);
      const testY = tf.tensor2d(testLabels);
      
      // Build and train the model
      const newModel = tf.sequential();
      
      newModel.add(tf.layers.dense({
        units: 32,
        activation: 'relu',
        inputShape: [trainFeatures[0].length]
      }));
      
      newModel.add(tf.layers.dense({
        units: 16, 
        activation: 'relu'
      }));
      
      newModel.add(tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      }));
      
      newModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      
      // Train the model
      const history = await newModel.fit(trainX, trainY, {
        epochs: 50,
        validationData: [testX, testY],
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
          }
        }
      });
      
      // Evaluate the model
      const result = newModel.evaluate(testX, testY) as tf.Scalar[];
      const testLoss = result[0].dataSync()[0];
      const testAcc = result[1].dataSync()[0];

      // Generate predictions to compute confusion matrix
      const predictions = newModel.predict(testX) as tf.Tensor;
      const predArray = Array.from(predictions.dataSync());
      const trueLabels = Array.from(testY.dataSync());

      // Calculate confusion matrix values
      let tp = 0, fp = 0, tn = 0, fn = 0;
      for (let i = 0; i < predArray.length; i++) {
        const prediction = predArray[i] >= 0.5 ? 1 : 0;
        const actual = trueLabels[i];
        
        if (prediction === 1 && actual === 1) tp++;
        else if (prediction === 1 && actual === 0) fp++;
        else if (prediction === 0 && actual === 0) tn++;
        else if (prediction === 0 && actual === 1) fn++;
      }

      // Calculate metrics
      const precision = tp / (tp + fp) || 0;
      const recall = tp / (tp + fn) || 0;
      const f1Score = 2 * ((precision * recall) / (precision + recall)) || 0;
      
      // Calculate feature importance
      const importanceScores = await getFeatureImportance(newModel, trainFeatures, featureNames);
      
      setModel(newModel);
      // In the trainModelInternal function, update the setModelStats call:
      setModelStats({
        accuracy: testAcc,
        loss: testLoss,
        confusionMatrix: { tp, fp, tn, fn },
        precision,
        recall,
        f1Score,
        trainHistory: {
          loss: history.history.loss as number[],
          acc: history.history.acc as number[],
          val_loss: history.history.val_loss as number[],
          val_acc: history.history.val_acc as number[],
          // Include any other metrics that might be present
          ...Object.fromEntries(
            Object.entries(history.history)
              .filter(([key]) => !['loss', 'acc', 'val_loss', 'val_acc'].includes(key))
              .map(([key, value]) => [key, (value as number[]).map(v => typeof v === 'number' ? v : v[0])])
          )
        }
      });
      setFeatureImportance(importanceScores);
      setIsModelLoaded(true);
      
      // Clean up tensors
      trainX.dispose();
      trainY.dispose();
      testX.dispose();
      testY.dispose();
      predictions.dispose();
    } catch (error) {
      console.error('Error training model:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const trainModel = async () => {
    if (!preprocessedData) return;
    
    const { features, labels, featureNames } = preprocessedData;
    await trainModelInternal(features, labels, featureNames, encodings);
  };

  const predictAttrition = async (employee: Partial<Employee>) => {
    if (!model || !encodings || !preprocessedData) {
      throw new Error('Model not loaded');
    }
    
    // Process input data
    const processedInput = getOneHotEncodings(employee, encodings, preprocessedData.featureNames);
    
    // Make prediction
    const inputTensor = tf.tensor2d([processedInput]);
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const probability = prediction.dataSync()[0];
    
    // Clean up tensors
    inputTensor.dispose();
    prediction.dispose();
    
    return {
      probability, 
      willLeave: probability >= 0.5
    };
  };

  const value = {
    isModelLoaded,
    isTraining,
    modelStats,
    featureImportance,
    originalData,
    predictAttrition,
    trainModel
  };

  return (
    <AttritionContext.Provider value={value}>
      {children}
    </AttritionContext.Provider>
  );
};