// src/pages/Dashboard.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'; // Added useNavigate
import { dashboardModules } from '../data/mockData';
import { 
  Sprout, Thermometer, Wifi, Zap, Brain, ShieldCheck, Bot, 
  Bell, LayoutDashboard, Settings, LogOut // Added new icons
} from 'lucide-react';
import './Dashboard.css';

const iconMap = {
  Sprout, Thermometer, Wifi, Zap, Brain, ShieldCheck, Bot, LayoutDashboard
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In the future, we will clear auth tokens here.
    navigate('/'); // Sends user back to Landing Page
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          CDNB<span>-GRID</span>
        </div>
        
        {/* Main Navigation */}
        <nav className="sidebar-nav">
          {dashboardModules.map((module) => {
            const IconComponent = iconMap[module.icon];
            return (
              <NavLink 
                key={module.id} 
                to={module.route} 
                end={module.route === ""} // 'end' prop ensures exact match for the index route
                className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
              >
                {IconComponent && <IconComponent size={20} />}
                {module.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Navigation (Settings & Logout) */}
        <div className="sidebar-bottom">
          <NavLink to="settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <Settings size={20} />
            Settings
          </NavLink>
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* ... keep the rest of the main-wrapper and top-navbar exactly the same ... */}
      <div className="main-wrapper">
        <header className="top-navbar">
           {/* ... your existing navbar code ... */}
        </header>
        <main className="page-content">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Dashboard;