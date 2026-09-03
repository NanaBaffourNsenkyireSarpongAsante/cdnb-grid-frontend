// src/App.jsx
// App shell for the CDNB smart-farm dashboard.
// The sensor API lives behind relative /api/... URLs — Vite proxies them to
// the SQLite ingestion service in dev (see vite.config.js), so this component
// never needs to know a host or port.
import SensorMonitoring from './pages/SensorMonitoring.jsx';

const App = () => (
  <div className="app">
    <header className="app-bar">
      <span className="app-logo">🌿</span>
      <div>
        <h1>CDNB Smart-Farm Grid</h1>
        <p className="app-sub">Solar CDNB nodes · edge sensing &amp; community intelligence</p>
      </div>
    </header>
    <main className="app-main">
      <SensorMonitoring />
    </main>
  </div>
);

export default App;
