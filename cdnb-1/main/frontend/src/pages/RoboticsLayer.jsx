import React from 'react';
import { robots } from '../data/mockData';
import './RemainingModules.css';

const RoboticsLayer = () => {
  return (
    <div className="module-page">
      <div className="module-header"><h2> Robotics Layer</h2></div>
      <div className="grid-4">
        {robots.map(robot => (
          <div key={robot.id} className="card robot-card">
            <div className="robot-header">
              <h3 style={{margin: 0, fontSize: '1.1rem'}}>{robot.name}</h3>
              <span style={{color: robot.status === 'Active' ? '#4CAF50' : '#ffbd2e', fontWeight: 'bold'}}>{robot.status}</span>
            </div>
            <div className="robot-type">{robot.type} Unit</div>
            
            <div style={{marginTop: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px'}}>
                <span>Battery</span>
                <span>{robot.battery}%</span>
              </div>
              <div className="battery-bar-bg">
                <div 
                  className={`battery-bar-fill ${robot.battery < 30 ? 'battery-low' : ''}`} 
                  style={{width: `${robot.battery}%`}}
                ></div>
              </div>
            </div>

            <div className="robot-task">
              <strong>Current Task:</strong><br/>
              {robot.task}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RoboticsLayer;