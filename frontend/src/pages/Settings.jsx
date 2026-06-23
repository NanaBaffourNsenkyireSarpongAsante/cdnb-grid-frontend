// src/pages/Settings.jsx
import React, { useState } from 'react';
import { userSettings } from '../data/mockData';
import './RemainingModules.css';

const Settings = () => {
  const [notifications, setNotifications] = useState(userSettings.notifications);

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="module-page">
      <div className="module-header"><h2>⚙️ System Settings</h2></div>
      
      <div className="grid-2">
        {/* Profile Section */}
        <div className="card">
          <h3>User Profile</h3>
          <div style={{marginTop: '20px'}}>
            <p style={{color: '#8B9A8B', fontSize: '0.8rem', margin: '0 0 4px 0'}}>Full Name</p>
            <p style={{color: '#fff', margin: '0 0 16px 0'}}>{userSettings.name}</p>
            
            <p style={{color: '#8B9A8B', fontSize: '0.8rem', margin: '0 0 4px 0'}}>Role</p>
            <p style={{color: '#fff', margin: '0 0 16px 0'}}>{userSettings.role}</p>
            
            <p style={{color: '#8B9A8B', fontSize: '0.8rem', margin: '0 0 4px 0'}}>Email</p>
            <p style={{color: '#fff', margin: 0}}>{userSettings.email}</p>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card">
          <h3>Notification Preferences</h3>
          <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{color: '#e0e8e0', textTransform: 'capitalize'}}>{key} Alerts</span>
                <button 
                  onClick={() => toggleNotif(key)}
                  style={{
                    background: value ? '#4CAF50' : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: 'none',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {value ? 'ON' : 'OFF'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;