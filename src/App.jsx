// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; 
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import DashboardOverview from './pages/DashboardOverview'; // <-- Add this
import SensorMonitoring from './pages/SensorMonitoring';
import NetworkMapping from './pages/NetworkMapping';
import AutomationEngine from './pages/AutomationEngine';
import AIPredictions from './pages/AIPredictions';
import SecuritySystem from './pages/SecuritySystem';
import RoboticsLayer from './pages/RoboticsLayer';
import FarmManagement from './pages/FarmManagement';
import Settings from './pages/Settings';





const PlaceholderPage = ({ title }) => (
  <div style={{ color: 'white' }}>
    <h1>{title}</h1>
    <p>This module is currently under construction.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />}>
          {/* Replace Placeholder with the real Overview! */}
          <Route index element={<DashboardOverview />} />
          <Route path="farm" element={<FarmManagement />} />
          <Route path="sensors" element={<SensorMonitoring/>} />
          <Route path="network" element={<NetworkMapping />} />
          <Route path="automation" element={<AutomationEngine />} />
          <Route path="ai" element={<AIPredictions />} />
          <Route path="security" element={<SecuritySystem />} />
          <Route path="robotics" element={<RoboticsLayer />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;