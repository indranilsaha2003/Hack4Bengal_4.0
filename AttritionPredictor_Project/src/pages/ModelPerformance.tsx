import React from 'react';
import { useAttrition } from '../context/AttritionContext';
import { LineChart, Activity, CheckCircle, BarChart2 } from 'lucide-react';
import ConfusionMatrix from '../components/ConfusionMatrix';
import MetricsCard from '../components/MetricsCard';
import LineChartComponent from '../components/LineChart';
import FeatureImportanceChart from '../components/FeatureImportanceChart';

const ModelPerformance: React.FC = () => {
  const { modelStats, isModelLoaded, isTraining, featureImportance } = useAttrition();

  if (isTraining) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Training model, please wait...</p>
      </div>
    );
  }

  if (!isModelLoaded || !modelStats) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Model not loaded yet. Please wait...</p>
      </div>
    );
  }

  // Format training history data for chart
  const historyData = {
    labels: Array.from({length: modelStats.trainHistory.loss.length}, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: 'Training Loss',
        data: modelStats.trainHistory.loss,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Training Accuracy',
        data: modelStats.trainHistory.acc,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Validation Loss',
        data: modelStats.trainHistory.val_loss,
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
      },
      {
        label: 'Validation Accuracy',
        data: modelStats.trainHistory.val_acc,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Model Performance Metrics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricsCard 
          title="Accuracy" 
          value={modelStats.accuracy} 
          description="Percentage of correct predictions (both positive and negative)."
          icon={<CheckCircle className="h-6 w-6 text-blue-600" />}
        />
        <MetricsCard 
          title="Precision" 
          value={modelStats.precision} 
          description="Of all predicted attritions, how many were actually correct."
          icon={<BarChart2 className="h-6 w-6 text-blue-600" />}
        />
        <MetricsCard 
          title="Recall" 
          value={modelStats.recall} 
          description="Of all actual attritions, how many were correctly identified."
          icon={<Activity className="h-6 w-6 text-blue-600" />}
        />
        <MetricsCard 
          title="F1 Score" 
          value={modelStats.f1Score} 
          description="Harmonic mean of precision and recall, balanced metric."
          icon={<LineChart className="h-6 w-6 text-blue-600" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Training History</h2>
          <div style={{ height: '400px' }}>
            <LineChartComponent data={historyData} title="Model Training Progress" yAxisLabel="Value" />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This chart shows how the model's loss and accuracy improved during training. 
            Lower loss and higher accuracy indicate better model performance.
          </p>
        </div>
        
        <ConfusionMatrix 
          truePositive={modelStats.confusionMatrix.tp}
          falsePositive={modelStats.confusionMatrix.fp}
          trueNegative={modelStats.confusionMatrix.tn}
          falseNegative={modelStats.confusionMatrix.fn}
        />
      </div>
      
      {featureImportance && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Importance</h2>
          <div style={{ height: '400px' }}>
            <FeatureImportanceChart featureImportance={featureImportance} />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            This chart shows the importance of different features in predicting employee attrition. 
            Higher values indicate features that more strongly influence the prediction.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Evaluation Metrics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="py-2 px-4 font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="py-2 px-4 font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 font-medium">Accuracy</td>
                <td className="py-3 px-4">{(modelStats.accuracy * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-gray-600">Ratio of correctly predicted observations to the total observations.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Precision</td>
                <td className="py-3 px-4">{(modelStats.precision * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-gray-600">Ratio of correctly predicted positive observations to the total predicted positives.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Recall (Sensitivity)</td>
                <td className="py-3 px-4">{(modelStats.recall * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-gray-600">Ratio of correctly predicted positive observations to all actual positives.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">F1 Score</td>
                <td className="py-3 px-4">{(modelStats.f1Score * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-gray-600">Harmonic mean of Precision and Recall, balanced score for imbalanced datasets.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Specificity</td>
                <td className="py-3 px-4">
                  {(modelStats.confusionMatrix.tn / (modelStats.confusionMatrix.tn + modelStats.confusionMatrix.fp) * 100).toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-gray-600">Ratio of correctly predicted negative observations to all actual negatives.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;