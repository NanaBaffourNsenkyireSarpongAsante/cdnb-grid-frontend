// src/pages/DashboardOverview.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { dashboardModules } from '../data/mockData';
import { 
  Sprout, Thermometer, Wifi, Zap, Brain, ShieldCheck, Bot,
  Activity, Terminal, Power, RefreshCw, Moon, AlertTriangle
} from 'lucide-react';
import FarmMap from '../components/FarmMap';
import './DashboardOverview.css';

const iconMap = {
  Sprout, Thermometer, Wifi, Zap, Brain, ShieldCheck, Bot
};

const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState('vitals');
  const [logs, setLogs] = useState([
    { id: 1, time: '14:20:01', msg: 'Sensor S1 (Temp) reading: 28.5°C', type: 'info' },
    { id: 2, time: '14:19:45', msg: 'Irrigation Bot R-01 completed Zone C', type: 'success' },
    { id: 3, time: '14:18:12', msg: 'Network ping to North AP: 12ms', type: 'info' },
  ]);
  
  const logEndRef = useRef(null);

  // Simulate live telemetry data coming in every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false });
      const events = [
        { msg: `Sensor S${Math.floor(Math.random()*8)+1} moisture: ${Math.floor(Math.random()*20)+40}%`, type: 'info' },
        { msg: `Robot R-0${Math.floor(Math.random()*4)+1} battery at ${Math.floor(Math.random()*30)+60}%`, type: 'warning' },
        { msg: 'Agro Tower Alpha HVAC adjusted to 22°C', type: 'success' },
        { msg: 'CCTV C4 motion detected (Livestock)', type: 'alert' }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      setLogs(prev => [...prev.slice(-15), { id: Date.now(), time: timeString, ...randomEvent }]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll the telemetry feed
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const summaryModules = dashboardModules.slice(1, 5); // Skip the dashboard overview itself

  return (
    <div className="overview-container">
      
      {/* --- LEFT SIDE: MAP --- */}
      <div className="map-section">
        <div className="map-header">
          <h2>Live Farm Map</h2>
          <span className="system-status">● System Online</span>
        </div>
        <FarmMap />
      </div>

      {/* --- RIGHT SIDE: INTERACTIVE COCKPIT --- */}
      <div className="cockpit-section">
        
        {/* Tab Navigation */}
        <div className="cockpit-tabs">
          <button 
            className={`tab-btn ${activeTab === 'vitals' ? 'active' : ''}`} 
            onClick={() => setActiveTab('vitals')}
          >
            <Activity size={16} /> Vitals
          </button>
          <button 
            className={`tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`} 
            onClick={() => setActiveTab('telemetry')}
          >
            <Terminal size={16} /> Live Feed
          </button>
          <button 
            className={`tab-btn ${activeTab === 'control' ? 'active' : ''}`} 
            onClick={() => setActiveTab('control')}
          >
            <Power size={16} /> Control
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="cockpit-content">
          
          {/* TAB 1: VITALS */}
          {activeTab === 'vitals' && (
            <div className="tab-pane vitals-pane">
              <div className="summary-grid">
                {summaryModules.map((module) => {
                  const IconComponent = iconMap[module.icon];
                  return (
                    <Link to={module.route} key={module.id} className="summary-card">
                      <div className="card-header">
                        <div className="card-icon">
                          {IconComponent && <IconComponent size={20} />}
                        </div>
                        <span className="card-status">{module.status}</span>
                      </div>
                      <div className="card-value">{module.statValue}</div>
                      <div className="card-label">{module.statLabel}</div>
                    </Link>
                  );
                })}
              </div>
              
              {/* Extra: Grid Energy Gauge */}
              <div className="energy-gauge">
                <div className="gauge-header">
                  <span>Grid Power Load</span>
                  <span className="gauge-value">68%</span>
                </div>
                <div className="gauge-bar-bg">
                  <div className="gauge-bar-fill" style={{width: '68%'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TELEMETRY */}
          {activeTab === 'telemetry' && (
            <div className="tab-pane telemetry-pane">
              <div className="telemetry-header">
                <Terminal size={14} />
                <span>CDNB-GRID TELEMETRY STREAM</span>
              </div>
              <div className="telemetry-feed">
                {logs.map(log => (
                  <div key={log.id} className={`log-entry log-${log.type}`}>
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-msg">{log.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}

          {/* TAB 3: SYSTEM CONTROL */}
          {activeTab === 'control' && (
            <div className="tab-pane control-pane">
              <h3>Quick Actions</h3>
              <div className="control-grid">
                <button className="control-btn">
                  <RefreshCw size={20} />
                  <span>Run Diagnostics</span>
                </button>
                <button className="control-btn">
                  <Moon size={20} />
                  <span>Night Protocol</span>
                </button>
                <button className="control-btn alert-btn">
                  <AlertTriangle size={20} />
                  <span>Emergency Stop</span>
                </button>
                <button className="control-btn">
                  <Bot size={20} />
                  <span>Deploy Drones</span>
                </button>
              </div>
              <div className="system-info">
                <p>Uptime: <span>14d 2h 12m</span></p>
                <p>Active Nodes: <span>142</span></p>
                <p>Last Backup: <span>02:00 AM</span></p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;