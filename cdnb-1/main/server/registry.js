// server/registry.js
// Single source of truth for the sensor fleet.
// Mirrors the mock data in frontend/src/data/mockData.js — the API seeds
// these into the `sensors` table on first boot, and the simulator uses
// them to generate realistic values.

export const sensorRegistry = [
  { id: 'S1', name: 'Temp Sensor A1',        zone: 'Open Field',       type: 'Temperature',  unit: '°C',   warnAbove: 35   },
  { id: 'S2', name: 'Soil Moisture B2',      zone: 'Open Field',       type: 'Soil Moisture', unit: '%',   warnBelow: 30   },
  { id: 'S3', name: 'Humidity C1',           zone: 'Agro Tower Alpha', type: 'Humidity',      unit: '%',   warnAbove: 85, warnBelow: 40 },
  { id: 'S4', name: 'Rainfall D4',           zone: 'Open Field',       type: 'Rainfall',      unit: 'mm'                    },
  { id: 'S5', name: 'Network Signal E5',     zone: 'Perimeter',        type: 'Network',       unit: 'dBm',  warnBelow: -85  },
  { id: 'S6', name: 'Boundary F6',           zone: 'Perimeter',        type: 'Boundary',      unit: 'Status', warnBelow: 50 },
  { id: 'S7', name: 'Predator Detect G7',    zone: 'Livestock',        type: 'Security',      unit: 'Alerts', warnAbove: 0  },
  { id: 'S8', name: 'Livestock Activity H8', zone: 'Livestock',        type: 'Activity',      unit: 'Steps', warnBelow: 500 }
];
