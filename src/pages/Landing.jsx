import { Link} from 'react-router-dom';
import './Landing.css';

function Landing() {
    return (
        <div className="landing">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-container">
                    
                    <div className="logo">
                        <h2>CDNB-GRID</h2>
                    </div>

                    <ul className="nav-links">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact" onClick = {(e) => {e.preventDefault(); alert('Nana Kwame, remind me to add this wai')}}>Contact</a></li>
                        <li><Link to="/login" className="login-btn">Login</Link></li>
                    </ul>

                </div>
            </nav>

            {/*Hero Section */}
            <section className="hero" id="home">

                <div className="hero-overlay">
                    <div className="hero-content">

                        <h1 className="hero-title">
                            Smart Agricultural Ecosystem <br />
                            <span>Management System</span>
                        </h1>

                        <p className="hero-subtitle">
                            Welcome to the CDNB-GRID, a smart centralized agricultural ecosystem manager
                        </p>

                        <p className="hero-description">
                            CDNB-GRID integrates AI, Robotics, IoT sensors, Networking, Cybersercurity, and Automation 
                            to create a fully intelligent agricultural ecosystem. Monitor crops, 
                             livestock, security, and environmental conditions from a single dashboard.
                        </p>

                        <div className="hero-buttons">
                            <Link to="/login" className="btn-primary">Get Started</Link>
                            <a href="#about" className="btn-secondary">Learn More</a>
                        </div>                   
                     </div>
                </div>
            </section>


            {/* Features Section */}
      <section className="features" id="about">
        <div className="container">
          <h2 className="section-title">Smart Farming Solutions</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                  <line x1="4" y1="11" x2="20" y2="11"></line>
                </svg>
              </div>

              <h3>Real-Time Monitoring</h3>
              <p>Live data tracking and alerts from integrated IoT sensor networks across your entire farm.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 22v-4M4 12H2M6 12H4M20 12h-2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"></path>
                </svg>
              </div>

              <h3>Automated Irrigation</h3>
              <p>Precision watering based on soil moisture, weather forecasts, and crop requirements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                  <path d="M2 2l7.586 7.586"></path>
                  <circle cx="11" cy="11" r="2"></circle>
                </svg>
              </div>

              <h3>360° Surveillance</h3>
              <p>Farm land scanning and monitoring to detect issues early and optimize yields.</p>
            </div>
          </div>
        </div>
      </section>   

       {/* Stats Preview Section */}
      <section className="stats-preview">
        <div className="container">
          <h2 className="section-title">Smart Farm Dashboard Preview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Soil Health</div>
              <div className="stat-value">Optimal</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Weather Forecast</div>
              <div className="stat-value">28°C</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Humidity</div>
              <div className="stat-value">65%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Nutrient Levels</div>
              <div className="stat-value">Optimal</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Features */}
      <section className="bottom-features">
        <div className="container">
          <div className="bottom-grid">
            <div className="bottom-item">
              <div className="bottom-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v16h16"></path>
                  <polyline points="4 12 8 8 12 12 16 8 20 12"></polyline>
                </svg>
              </div>
              <p>Sensor Networks</p>
            </div>
            <div className="bottom-item">
              <div className="bottom-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <p>AI & Data Analytics</p>
            </div>
            <div className="bottom-item">
              <div className="bottom-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
              </div>
              <p>Autonomous Machinery</p>
            </div>
            <div className="bottom-item">
              <div className="bottom-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 22v-4M4 12H2M6 12H4M20 12h-2M22 12h-2M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83M19.07 19.07l-2.83-2.83M4.93 4.93l2.83 2.83"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <p>Sustainable Energy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 CDNB-GRID. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing