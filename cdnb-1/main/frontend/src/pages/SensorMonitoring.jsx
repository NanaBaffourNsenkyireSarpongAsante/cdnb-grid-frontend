// src/pages/SensorMonitoring.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { sensorDetails } from '../data/mockData';
import { fetchSensors, fetchHistory, fetchStats } from '../api/sensors';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, CloudRain, Wifi, Shield, Activity, Database } from 'lucide-react';
import './SensorMonitoring.css';

const iconMap = {
  Temperature: Thermometer,
  'Soil Moisture': Droplets,
  Humidity: Wind,
  Rainfall: CloudRain,
  Network: Wifi,
  Boundary: Shield,
  Security: Activity,
  Activity: Activity
};

const POLL_MS = 5000;      // refresh live values (cheap: 8 rows)
const HISTORY_EVERY = 6;   // refresh charts every 6th poll (~30s)

// ISO ts -> short local HH:MM label for the chart x-axis / tooltip
const timeLabel = (ts) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

const relative = (isoTs) => {
  const s = Math.max(0, Math.round((Date.now() - new Date(isoTs).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
};

const SensorMonitoring = () => {
  const [filter, setFilter] = useState('All');
  const [sensors, setSensors] = useState([]);
  const [histories, setHistories] = useState({}); // { sensorId: [{time, value}] }
  const [stats, setStats] = useState(null);
  const [live, setLive] = useState(true);         // API reachable?
  const [loading, setLoading] = useState(true);
  const tick = useRef(0);

  // Fallback: if the API is down, keep the dashboard usable with mock data.
  const fallbackToMock = useCallback(() => {
    setSensors(sensorDetails);
    setHistories(Object.fromEntries(sensorDetails.map(s => [s.id, s.history])));
    setLive(false);
    setLoading(false);
  }, []);

  const loadData = useCallback(async (initial) => {
    try {
      const [sensorsRes, statsRes] = await Promise.all([fetchSensors(), fetchStats()]);
      setSensors(sensorsRes.sensors);
      setStats(statsRes);
      setLive(true);
      setLoading(false);

      // Charts: fetch on first load, then every HISTORY_EVERY-th poll
      if (initial || tick.current % HISTORY_EVERY === 0) {
        const hist = await Promise.all(
          sensorsRes.sensors.map(s => fetchHistory(s.id, 24).catch(() => null))
        );
        setHistories(prev => ({
          ...prev,
          ...Object.fromEntries(sensorsRes.sensors.map((s, i) => [
            s.id,
            hist[i] ? hist[i].points.map(p => ({ time: timeLabel(p.ts), value: p.value })) : (prev[s.id] ?? [])
          ]))
        }));
      }
    } catch {
      if (initial) fallbackToMock(); else setLive(false);
    }
  }, [fallbackToMock]);

  useEffect(() => {
    // Kick off the first load in a callback (not synchronously in the effect
    // body), then keep polling — live values every 5s, charts every ~30s.
    const initial = setTimeout(() => loadData(true), 0);
    const interval = setInterval(() => { tick.current++; loadData(false); }, POLL_MS);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [loadData]);

  const sensorTypes = ['All', ...new Set(sensors.map(s => s.type))];
  const filteredSensors = filter === 'All'
    ? sensors
    : sensors.filter(s => s.type === filter);

  return (
    <div className="sensor-page">

      <div className="sensor-header">
        <div className="sensor-header-left">
          <h2>Sensor Monitoring Dashboard</h2>
          <span className={`live-indicator ${live ? 'online' : 'offline'}`}>
            <span className="live-dot"></span>
            {live ? 'Live · SQLite' : 'Offline · Mock Data'}
          </span>
        </div>
        <div className="filter-group">
          {sensorTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {!live && !loading && (
        <div className="api-banner">
          ⚠️ Ingestion API unreachable — showing mock data.
          Start it with <code>npm run dev</code> (or <code>npm run dev:api</code>) from <code>cdnb-1/main</code>.
        </div>
      )}

      <div className="sensor-grid">
        {filteredSensors.map(sensor => {
          const isWarning = sensor.status === 'Warning';
          const chartColor = isWarning ? '#ef4444' : '#10b981';
          const IconComponent = iconMap[sensor.type] || Activity;
          const history = histories[sensor.id] ?? [];

          return (
            <div key={sensor.id} className={`sensor-card ${isWarning ? 'warning' : ''}`}>

              <div className="card-top">
                <div className="sensor-info">
                  <h3>{sensor.name}</h3>
                  <div className="sensor-zone">
                    <span className="location-icon"></span>
                    {sensor.zone}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <IconComponent size={20} color={isWarning ? '#f87171' : '#10b981'} />
                  <span className={`status-badge ${isWarning ? 'status-warning' : 'status-normal'}`}>
                    {sensor.status}
                  </span>
                </div>
              </div>

              <div className="current-reading">
                <span className="reading-value">{sensor.current ?? '—'}</span>
                <span className="reading-unit">{sensor.unit}</span>
                {live && sensor.lastTs && (
                  <span className="reading-updated">updated {relative(sensor.lastTs)}</span>
                )}
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id={`color-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="time"
                      hide
                    />
                    <YAxis
                      hide
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(4, 18, 10, 0.98)',
                        border: '2px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: '12px',
                        color: '#fff',
                        fontFamily: 'Courier New, monospace',
                        fontSize: '13px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        padding: '12px 16px'
                      }}
                      labelStyle={{
                        color: '#fbbf24',
                        marginBottom: '8px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                      itemStyle={{
                        color: '#34d399',
                        fontWeight: '600'
                      }}
                      formatter={(value) => [`${value} ${sensor.unit}`, 'Reading']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chartColor}
                      fillOpacity={1}
                      fill={`url(#color-${sensor.id})`}
                      strokeWidth={2.5}
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

            </div>
          );
        })}
      </div>

      {stats && (
        <div className="storage-footer">
          <Database size={14} />
          <span>
            {stats.totalReadings.toLocaleString()} readings stored in SQLite
            ({(stats.dbBytes / 1024 / 1024).toFixed(2)} MB)
            {stats.totalHourlyBuckets > 0 && <> · {stats.totalHourlyBuckets.toLocaleString()} hourly rollups</>}
            <> · raw kept {stats.rawRetentionDays} days, rollups kept forever</>
          </span>
        </div>
      )}
    </div>
  );
};

export default SensorMonitoring;
