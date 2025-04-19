import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PredictionForm from './pages/PredictionForm';
import ModelPerformance from './pages/ModelPerformance';
import DataExploration from './pages/DataExploration';
import { AttritionProvider } from './context/AttritionContext';

function App() {
  return (
    <AttritionProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predict" element={<PredictionForm />} />
              <Route path="/performance" element={<ModelPerformance />} />
              <Route path="/explore" element={<DataExploration />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </AttritionProvider>
  );
}

export default App;