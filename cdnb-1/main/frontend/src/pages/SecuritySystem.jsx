import React from 'react';
import { securityAlerts } from '../data/mockData';
import './RemainingModules.css';

const SecuritySystem = () => {
  return (
    <div className="module-page">
      <div className="module-header"><h2> Security System</h2></div>
      <div className="grid-2">
        <div className="card">
          <h3>Recent Alerts</h3>
          <table className="alert-table">
            <thead>
              <tr><th>Time</th><th>Type</th><th>Location</th><th>Severity</th><th>Status</th></tr>
            </thead>
            <tbody>
              {securityAlerts.map(alert => (
                <tr key={alert.id}>
                  <td>{alert.time}</td>
                  <td>{alert.type}</td>
                  <td>{alert.location}</td>
                  <td className={`severity-${alert.severity.toLowerCase()}`}>{alert.severity}</td>
                  <td>{alert.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Live Camera Feeds</h3>
          <div className="camera-grid">
            {['North Gate', 'South Perimeter', 'Agro Tower A', 'Livestock Zone'].map((cam, i) => (
              <div key={i} className="camera-feed">
                <div className="live-dot"></div>
                <span style={{color: '#555'}}>{cam} - LIVE</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SecuritySystem;