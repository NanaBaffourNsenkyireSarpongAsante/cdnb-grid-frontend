// src/pages/AutomationEngine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { initialAutomationRules, initialActivityLogs } from '../data/mockData';
import './AutomationEngine.css';

const AutomationEngine = () => {
  const [rules, setRules] = useState(initialAutomationRules);
  const [logs, setLogs] = useState(initialActivityLogs);
  
  // Form state
  const [newSensor, setNewSensor] = useState('Soil Moisture');
  const [newCondition, setNewCondition] = useState('< 30%');
  const [newAction, setNewAction] = useState('Activate Irrigation Robot');

  // Auto-scroll to bottom of terminal
  const terminalEndRef = useRef(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleAddRule = (e) => {
    e.preventDefault();
    const newRule = {
      id: rules.length + 1,
      sensor: newSensor,
      condition: newCondition,
      action: newAction,
      status: 'Active'
    };
    
    setRules([...rules, newRule]);
    
    // Add a log entry when a rule is created
    addLog(`New automation rule created: IF ${newSensor} ${newCondition} THEN ${newAction}`, 'success');
  };

  const addLog = (message, type = 'info') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newLog = {
      id: logs.length + 1,
      time: timeString,
      message,
      type
    };
    
    setLogs(prev => [...prev, newLog]);
  };

  // Simulate a random event every 10 seconds to make the terminal look alive
  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        { msg: 'Heartbeat ping received from Agro Tower Alpha.', type: 'info' },
        { msg: 'Network signal strength fluctuating at North Perimeter.', type: 'warning' },
        { msg: 'Surveillance Robot 02 completed patrol route.', type: 'success' },
        { msg: 'Boundary sensor F6 triggered. Checking cameras...', type: 'warning' }
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      addLog(randomEvent.msg, randomEvent.type);
    }, 12000); // Every 12 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="automation-page">
      
      {/* Left Side: Rule Builder */}
      <div className="rule-builder-section">
        <div className="section-card">
          <h2>⚙️ Automation Rule Builder</h2>
          <form className="rule-form" onSubmit={handleAddRule}>
            <div className="form-group">
              <label>IF Sensor</label>
              <select value={newSensor} onChange={(e) => setNewSensor(e.target.value)}>
                <option>Soil Moisture</option>
                <option>Temperature</option>
                <option>Humidity</option>
                <option>Boundary Sensor</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)}>
                <option>&lt; 30%</option>
                <option>&gt; 35°C</option>
                <option>Triggered</option>
                <option>&lt; 50%</option>
              </select>
            </div>
            <div className="form-group">
              <label>THEN Action</label>
              <select value={newAction} onChange={(e) => setNewAction(e.target.value)}>
                <option>Activate Irrigation Robot</option>
                <option>Turn on Agro Tower Cooling</option>
                <option>Deploy Surveillance Robot</option>
                <option>Send Security Alert</option>
              </select>
            </div>
            <button type="submit" className="add-rule-btn">Add Rule</button>
          </form>
        </div>

        <div className="section-card" style={{ flex: 1 }}>
          <h2>Active Rules</h2>
          <div className="rules-list">
            {rules.map(rule => (
              <div key={rule.id} className="rule-item">
                <div className="rule-text">
                  IF <strong>{rule.sensor}</strong> {rule.condition} <br/>
                  THEN {rule.action}
                </div>
                <span className="rule-status">{rule.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Terminal Activity Log */}
      <div className="terminal-section">
        <div className="section-card terminal-window">
          <div className="terminal-header">
            <div className="terminal-dot dot-red"></div>
            <div className="terminal-dot dot-yellow"></div>
            <div className="terminal-dot dot-green"></div>
            <span className="terminal-title">cdnb-grid@automation:~$ live_feed.log</span>
          </div>
          
          {logs.map(log => (
            <div key={log.id} className={`log-entry log-${log.type}`}>
              <span className="log-time">[{log.time}]</span>
              {log.message}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>
      </div>

    </div>
  );
};

export default AutomationEngine;