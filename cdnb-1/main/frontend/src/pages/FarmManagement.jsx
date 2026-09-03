// src/pages/FarmManagement.jsx
import React, { useState } from 'react';
import { farmZones, livestockRegistry, workforce, farmFinancials } from '../data/mockData';
import { Sprout, PawPrint, Users, DollarSign } from 'lucide-react';
import './FarmManagement.css';

const FarmManagement = () => {
  const [activeTab, setActiveTab] = useState('zones');

  return (
    <div className="farm-mgmt-page">
      
      {/* Top Quick Stats */}
      <div className="mgmt-stats-row">
        <div className="mgmt-stat-card">
          <span className="mgmt-stat-label">Active Zones</span>
          <span className="mgmt-stat-value">{farmZones.length}</span>
          <span className="mgmt-stat-sub">2 Vertical, 2 Field, 2 Livestock</span>
        </div>
        <div className="mgmt-stat-card">
          <span className="mgmt-stat-label">Total Livestock</span>
          <span className="mgmt-stat-value">755</span>
          <span className="mgmt-stat-sub">Across 5 species</span>
        </div>
        <div className="mgmt-stat-card">
          <span className="mgmt-stat-label">Active Workforce</span>
          <span className="mgmt-stat-value">{workforce.filter(w => w.status === 'Active').length}</span>
          <span className="mgmt-stat-sub">{workforce.length} Total Staff</span>
        </div>
        <div className="mgmt-stat-card">
          <span className="mgmt-stat-label">Est. Total Yield</span>
          <span className="mgmt-stat-value">9,850 kg</span>
          <span className="mgmt-stat-sub">Next 30 Days</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mgmt-content">
        
        {/* Tabs */}
        <div className="mgmt-tabs">
          <button className={`mgmt-tab ${activeTab === 'zones' ? 'active' : ''}`} onClick={() => setActiveTab('zones')}>
            <Sprout size={16} style={{marginRight: '8px', verticalAlign: 'middle'}} /> Zones & Crops
          </button>
          <button className={`mgmt-tab ${activeTab === 'livestock' ? 'active' : ''}`} onClick={() => setActiveTab('livestock')}>
            <PawPrint size={16} style={{marginRight: '8px', verticalAlign: 'middle'}} /> Livestock Registry
          </button>
          <button className={`mgmt-tab ${activeTab === 'workforce' ? 'active' : ''}`} onClick={() => setActiveTab('workforce')}>
            <Users size={16} style={{marginRight: '8px', verticalAlign: 'middle'}} /> Workforce
          </button>
          <button className={`mgmt-tab ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>
            <DollarSign size={16} style={{marginRight: '8px', verticalAlign: 'middle'}} /> Financials
          </button>
        </div>

        {/* Tab Content */}
        <div className="mgmt-tab-content">
          
          {/* TAB 1: ZONES & CROPS (Farmer/Scientist View) */}
          {activeTab === 'zones' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Zone Name</th>
                  <th>Type</th>
                  <th>Crops / Livestock</th>
                  <th>Soil/Env pH</th>
                  <th>Planting Date</th>
                  <th>Harvest Date</th>
                  <th>Exp. Yield</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {farmZones.map(zone => (
                  <tr key={zone.id}>
                    <td style={{fontWeight: 'bold', color: '#fff'}}>{zone.name}</td>
                    <td>{zone.type}</td>
                    <td>{zone.crops}</td>
                    <td style={{fontFamily: 'monospace', color: '#a7f3d0'}}>{zone.soilPh}</td>
                    <td>{zone.planted}</td>
                    <td>{zone.harvestDate}</td>
                    <td>{zone.expectedYield}</td>
                    <td><span className={`status-badge status-${zone.status.toLowerCase().replace(' ', '')}`}>{zone.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 2: LIVESTOCK (Farmer/Vet View) */}
          {activeTab === 'livestock' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Species</th>
                  <th>Head Count</th>
                  <th>Health Status</th>
                  <th>Last Vet Check</th>
                  <th>Daily Feed Consumption</th>
                </tr>
              </thead>
              <tbody>
                {livestockRegistry.map(animal => (
                  <tr key={animal.id}>
                    <td style={{fontFamily: 'monospace'}}>{animal.id}</td>
                    <td style={{fontWeight: 'bold', color: '#fff'}}>{animal.type}</td>
                    <td>{animal.count}</td>
                    <td><span className={`status-badge status-${animal.health.toLowerCase().split(' ')[0]}`}>{animal.health}</span></td>
                    <td>{animal.lastVetCheck}</td>
                    <td>{animal.feedConsumption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 3: WORKFORCE (Manager View) */}
          {activeTab === 'workforce' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Assigned Zone</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {workforce.map(worker => (
                  <tr key={worker.id}>
                    <td style={{fontFamily: 'monospace'}}>{worker.id}</td>
                    <td style={{fontWeight: 'bold', color: '#fff'}}>{worker.name}</td>
                    <td>{worker.role}</td>
                    <td>{worker.zone}</td>
                    <td style={{fontFamily: 'monospace'}}>{worker.contact}</td>
                    <td><span className={`status-badge status-${worker.status.toLowerCase().replace(' ', '')}`}>{worker.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* TAB 4: FINANCIALS (Accountant View) */}
          {activeTab === 'financials' && (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Zone</th>
                  <th>Type</th>
                  <th>Amount (GHS)</th>
                </tr>
              </thead>
              <tbody>
                {farmFinancials.map(fin => (
                  <tr key={fin.id}>
                    <td>{fin.date}</td>
                    <td style={{fontWeight: 'bold', color: '#fff'}}>{fin.category}</td>
                    <td>{fin.zone}</td>
                    <td><span className={`status-badge status-${fin.type.toLowerCase()}`}>{fin.type}</span></td>
                    <td className={`amount-${fin.type.toLowerCase()}`}>
                      {fin.type === 'Income' ? '+' : ''}{fin.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </div>
    </div>
  );
};

export default FarmManagement;