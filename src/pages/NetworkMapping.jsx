// src/pages/NetworkMapping.jsx
import React from 'react';
import NetworkMap from '../components/NetworkMap';
import { networkRouters } from '../data/mockData';
import './NetworkMapping.css';

const NetworkMapping = () => {
  return (
    <div className="network-page">
      
      {/* Left Side: The Interactive Map */}
      <div className="map-container">
        <NetworkMap />
      </div>

      {/* Right Side: The Math & Data Panel */}
      <div className="data-panel">
        <h2>Network Topology</h2>
        <p className="panel-desc">
          Signal strength estimation using <span className="highlight">Lagrange Interpolation</span>.
        </p>

        <div className="data-card">
          <h3>Known Data Points (Inputs)</h3>
          <ul className="data-list">
            {networkRouters.map(r => (
              <li key={r.id}>
                <span className="data-name">{r.name}</span>
                <div className="data-values">
                  <span>Dist: {r.distance}m</span>
                  <span className="signal-val">{r.signal} dBm</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="data-card math-card">
          <h3>Algorithm Status</h3>
          <div className="math-formula">
            L(x) = Σ [ y<sub>j</sub> Π (x - x<sub>i</sub>) / (x<sub>j</sub> - x<sub>i</sub>) ]
          </div>
          <p className="status-text">
            <span className="dot green"></span> System Ready. Click the map to interpolate unknown signal values.
          </p>
        </div>

      </div>
    </div>
  );
};

export default NetworkMapping;