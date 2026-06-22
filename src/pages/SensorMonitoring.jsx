// src/pages/SensorMonitoring.jsx
import React, { useState } from 'react';
import { sensorDetails } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, CloudRain, Wifi, Shield, Activity, MapPin } from 'lucide-react';
import './SensorMonitoring.css';

const iconMap = {
  Temperature: Thermometer,
  'Soil Moisture': Droplets,
  Humidity: Wind,
  Rainfall: CloudRain,
  Network: Wifi,
  Boundary: Shield,
  Security: Activity,
  Activity: Activity
};

const SensorMonitoring = () => {
  const [filter, setFilter] = useState('All');

  const sensorTypes = ['All', ...new Set(sensorDetails.map(s => s.type))];

  const filteredSensors = filter === 'All' 
    ? sensorDetails 
    : sensorDetails.filter(s => s.type === filter);

  return (
    <div className="sensor-page">
      
      <div className="sensor-header">
        <h2>Sensor Monitoring Dashboard</h2>
        <div className="filter-group">
          {sensorTypes.map(type => (
            <button 
              key={type} 
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="sensor-grid">
        {filteredSensors.map(sensor => {
          const isWarning = sensor.status === 'Warning';
          const chartColor = isWarning ? '#ef4444' : '#10b981';
          const IconComponent = iconMap[sensor.type] || Activity;

          return (
            <div key={sensor.id} className={`sensor-card ${isWarning ? 'warning' : ''}`}>
              
              <div className="card-top">
                <div className="sensor-info">
                  <h3>{sensor.name}</h3>
                  <div className="sensor-zone">
                    <span className="location-icon"></span>
                    {sensor.zone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <IconComponent size={20} color={isWarning ? '#f87171' : '#10b981'} />
                  <span className={`status-badge ${isWarning ? 'status-warning' : 'status-normal'}`}>
                    {sensor.status}
                  </span>
                </div>
              </div>

              <div className="current-reading">
                <span className="reading-value">{sensor.current}</span>
                <span className="reading-unit">{sensor.unit}</span>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sensor.history}>
                    <defs>
                      <linearGradient id={`color-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="time" 
                      hide 
                    />
                    <YAxis 
                      hide 
                      domain={['dataMin - 5', 'dataMax + 5']} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(4, 18, 10, 0.98)', 
                        border: '2px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '13px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        padding: '12px 16px'
                      }} 
                      labelStyle={{ 
                        color: '#fbbf24', 
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                      itemStyle={{
                        color: '#34d399',
                        fontWeight: '600'
                      }}
                      formatter={(value) => [`${value} ${sensor.unit}`, 'Reading']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke={chartColor} 
                      fillOpacity={1} 
                      fill={`url(#color-${sensor.id})`} 
                      strokeWidth={2.5}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorMonitoring;