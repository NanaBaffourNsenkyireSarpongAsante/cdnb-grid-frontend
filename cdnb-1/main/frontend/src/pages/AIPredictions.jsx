import React from 'react';
import { aiPredictions } from '../data/mockData';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './RemainingModules.css';

const AIPredictions = () => {
  return (
    <div className="module-page">
      <div className="module-header"><h2> AI Prediction System</h2></div>
      <div className="grid-2">
        {aiPredictions.map(item => (
          <div key={item.id} className="card ai-card">
            <h3>{item.category}</h3>
            <div className="ai-value">{item.prediction}</div>
            <div className="ai-confidence">Model Confidence: {item.confidence}%</div>
            <div className="chart-box">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={item.trend.map((v, i) => ({ i, v }))}>
                  <Line type="monotone" dataKey="v" stroke="#4CAF50" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AIPredictions;