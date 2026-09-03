// src/data/mockData.js

export const dashboardModules = [
   {
    id: 0, // Changed to 0 to put it at the top
    name: "Dashboard Overview",
    route: "", // Empty string means it goes to the index (/dashboard)
    icon: "LayoutDashboard", // We'll map this below
    statValue: "Live",
    statLabel: "System Status",
    status: "Active"
  },
  {
    id: 1,
    name: "Farm Management",
    route: "farm",
    icon: "Sprout", // We will map these strings to actual Lucide icons in the component
    statValue: "98%",
    statLabel: "Crop Health",
    status: "Optimal"
  },
  {
    id: 2,
    name: "Sensor Monitoring",
    route: "sensors",
    icon: "Thermometer",
    statValue: "142",
    statLabel: "Active Sensors",
    status: "Online"
  },
  {
    id: 3,
    name: "Network Mapping",
    route: "network",
    icon: "Wifi",
    statValue: "99.9%",
    statLabel: "Uptime",
    status: "Stable"
  },
  {
    id: 4,
    name: "Automation Engine",
    route: "automation",
    icon: "Zap",
    statValue: "14",
    statLabel: "Active Rules",
    status: "Running"
  },
  {
    id: 5,
    name: "AI Predictions",
    route: "ai",
    icon: "Brain",
    statValue: "85%",
    statLabel: "Accuracy",
    status: "Learning"
  },
  {
    id: 6,
    name: "Security System",
    route: "security",
    icon: "ShieldCheck",
    statValue: "0",
    statLabel: "Active Threats",
    status: "Secure"
  },
  {
    id: 7,
    name: "Robotics Layer",
    route: "robotics",
    icon: "Bot",
    statValue: "12",
    statLabel: "Active Bots",
    status: "Patrolling"
  }
];


export const farmNodes = {
  sensors: [
    { id: 'S1', x: 250, y: 250, label: 'Temp Sensor A1', value: '28°C', color: '#00BCD4' },
    { id: 'S2', x: 750, y: 450, label: 'Soil Moisture B2', value: '45%', color: '#00BCD4' },
    { id: 'S3', x: 250, y: 500, label: 'Humidity C1', value: '62%', color: '#00BCD4' },
    { id: 'S4', x: 750, y: 250, label: 'Rainfall D4', value: '12mm', color: '#00BCD4' },
  ],
  robots: [
    { id: 'R1', x: 300, y: 400, label: 'Irrigation Bot 01', status: 'Watering', color: '#FF9800' },
    { id: 'R2', x: 650, y: 200, label: 'Harvest Bot 04', status: 'Idle', color: '#FF9800' },
    { id: 'R3', x: 500, y: 550, label: 'Surveillance Bot 02', status: 'Patrolling', color: '#FF9800' },
  ],
  cctvs: [
    { id: 'C1', x: 80, y: 80, label: 'Main Gate CCTV', status: 'Recording', color: '#F44336' },
    { id: 'C2', x: 920, y: 80, label: 'North Perimeter', status: 'Recording', color: '#F44336' },
    { id: 'C3', x: 80, y: 620, label: 'South Livestock', status: 'Recording', color: '#F44336' },
    { id: 'C4', x: 920, y: 620, label: 'Rear Exit', status: 'Recording', color: '#F44336' },
  ]
};



const generateHourlyData = (baseValue, variance) => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    const value = baseValue + (Math.random() * variance - variance / 2);
    data.push({ time, value: parseFloat(value.toFixed(1)) });
  }
  return data;
};

export const sensorDetails = [
  { id: 'S1', name: 'Temp Sensor A1', zone: 'Open Field', type: 'Temperature', unit: '°C', current: 28.5, status: 'Normal', history: generateHourlyData(28, 4) },
  { id: 'S2', name: 'Soil Moisture B2', zone: 'Open Field', type: 'Soil Moisture', unit: '%', current: 22, status: 'Warning', history: generateHourlyData(45, 20) }, // Low moisture = Warning
  { id: 'S3', name: 'Humidity C1', zone: 'Agro Tower Alpha', type: 'Humidity', unit: '%', current: 62, status: 'Normal', history: generateHourlyData(60, 10) },
  { id: 'S4', name: 'Rainfall D4', zone: 'Open Field', type: 'Rainfall', unit: 'mm', current: 12, status: 'Normal', history: generateHourlyData(10, 5) },
  { id: 'S5', name: 'Network Signal E5', zone: 'Perimeter', type: 'Network', unit: 'dBm', current: -65, status: 'Normal', history: generateHourlyData(-60, 15) },
  { id: 'S6', name: 'Boundary F6', zone: 'Perimeter', type: 'Boundary', unit: 'Status', current: 100, status: 'Secure', history: generateHourlyData(100, 0) },
  { id: 'S7', name: 'Predator Detect G7', zone: 'Livestock', type: 'Security', unit: 'Alerts', current: 0, status: 'Normal', history: generateHourlyData(0, 0) },
  { id: 'S8', name: 'Livestock Activity H8', zone: 'Livestock', type: 'Activity', unit: 'Steps', current: 1450, status: 'Normal', history: generateHourlyData(1500, 500) }
];




export const networkRouters = [
  // Main Tower (Center)
  { id: 'R1', name: 'Main Tower Alpha', x: 430, y: 350, distance: 0, signal: -30 },
  // North Perimeter (Exactly 260 SVG pixels away from center)
  { id: 'R2', name: 'North Perimeter AP', x: 500, y: 100, distance: 260, signal: -60 },
  // South Livestock (Exactly 260 SVG pixels away from center)
  { id: 'R3', name: 'South Livestock AP', x: 500, y: 600, distance: 260, signal: -65 },
  // East Field (Exactly 420 SVG pixels away from center)
  { id: 'R4', name: 'East Field AP', x: 850, y: 350, distance: 420, signal: -75 }
];


export const initialAutomationRules = [
  {
    id: 1,
    sensor: 'Soil Moisture',
    condition: '< 30%',
    action: 'Activate Irrigation Robot',
    status: 'Active'
  },
  {
    id: 2,
    sensor: 'Temperature',
    condition: '> 35°C',
    action: 'Turn on Agro Tower Cooling',
    status: 'Active'
  },
  {
    id: 3,
    sensor: 'Boundary Sensor',
    condition: 'Triggered',
    action: 'Deploy Surveillance Robot & Alert Security',
    status: 'Active'
  }
];

export const initialActivityLogs = [
  { id: 1, time: '08:15 AM', message: 'System initialized. All sensors online.', type: 'info' },
  { id: 2, time: '09:30 AM', message: 'Soil Moisture dropped to 28%. Rule #1 triggered.', type: 'warning' },
  { id: 3, time: '09:31 AM', message: 'Irrigation Robot 01 activated in Open Field (Cassava).', type: 'success' },
  { id: 4, time: '10:45 AM', message: 'Temperature normalized. Irrigation Robot 01 returned to base.', type: 'info' }
];


// Add to the bottom of src/data/mockData.js

export const aiPredictions = [
  { id: 1, category: 'Crop Health', prediction: '92% Yield', confidence: 88, trend: [80, 82, 85, 88, 90, 92] },
  { id: 2, category: 'Irrigation Demand', prediction: 'High (Next 48h)', confidence: 75, trend: [40, 50, 60, 70, 85, 90] },
  { id: 3, category: 'Livestock Risk', prediction: 'Low', confidence: 95, trend: [10, 8, 5, 4, 3, 2] },
  { id: 4, category: 'Security Risk', prediction: 'Moderate', confidence: 60, trend: [20, 25, 30, 45, 50, 55] }
];

export const securityAlerts = [
  { id: 1, time: '14:20', type: 'Intrusion', location: 'North Perimeter', severity: 'High', status: 'Resolved' },
  { id: 2, time: '12:15', type: 'Boundary Breach', location: 'East Field', severity: 'Medium', status: 'Investigating' },
  { id: 3, time: '09:00', type: 'Motion Detected', location: 'Livestock Zone', severity: 'Low', status: 'Cleared' },
  { id: 4, time: '08:30', type: 'Camera Offline', location: 'South Gate', severity: 'Low', status: 'Resolved' }
];

export const robots = [
  { id: 'R-01', name: 'Irrigation Bot Alpha', type: 'Irrigation', battery: 85, status: 'Active', task: 'Watering Zone C' },
  { id: 'R-02', name: 'Harvest Bot Beta', type: 'Harvest', battery: 42, status: 'Charging', task: 'Idle' },
  { id: 'R-03', name: 'Surveillance Bot Gamma', type: 'Security', battery: 90, status: 'Active', task: 'Patrolling Perimeter' },
  { id: 'R-04', name: 'Defense Bot Delta', type: 'Defense', battery: 100, status: 'Standby', task: 'Base Station' }
];


// Replace the old farmZones with this detailed version:
export const farmZones = [
  { 
    id: 1, name: 'Agro Tower Alpha', type: 'Vertical Farm', status: 'Optimal', 
    capacity: '100%', crops: 'Lettuce, Tomatoes, Spinach', 
    soilPh: '6.5 (Hydroponic)', planted: '2026-04-10', harvestDate: '2026-07-15', expectedYield: '1,200 kg' 
  },
  { 
    id: 2, name: 'Agro Tower Beta', type: 'Vertical Farm', status: 'Optimal', 
    capacity: '95%', crops: 'Peppers, Cucumber, Herbs', 
    soilPh: '6.2 (Hydroponic)', planted: '2026-04-12', harvestDate: '2026-07-20', expectedYield: '950 kg' 
  },
  { 
    id: 3, name: 'Open Field A', type: 'Crop Zone', status: 'Watering', 
    capacity: '80%', crops: 'Maize, Cassava', 
    soilPh: '5.8 (Loam)', planted: '2026-03-01', harvestDate: '2026-08-30', expectedYield: '4,500 kg' 
  },
  { 
    id: 4, name: 'Open Field B', type: 'Crop Zone', status: 'Harvest Ready', 
    capacity: '100%', crops: 'Rice, Plantain', 
    soilPh: '6.0 (Clay)', planted: '2025-11-15', harvestDate: '2026-06-25', expectedYield: '3,200 kg' 
  },
  { 
    id: 5, name: 'Livestock Zone 1', type: 'Animal Zone', status: 'Secure', 
    capacity: '60%', crops: 'Cattle (45), Goats (120)', 
    soilPh: 'N/A', planted: 'N/A', harvestDate: 'N/A', expectedYield: 'N/A' 
  },
  { 
    id: 6, name: 'Livestock Zone 2', type: 'Animal Zone', status: 'Feeding', 
    capacity: '75%', crops: 'Poultry (500), Pigs (30)', 
    soilPh: 'N/A', planted: 'N/A', harvestDate: 'N/A', expectedYield: 'N/A' 
  }
];

// Add these new arrays to the bottom of mockData.js:

export const livestockRegistry = [
  { id: 'L-001', type: 'Cattle', count: 45, health: 'Excellent', lastVetCheck: '2026-06-10', feedConsumption: '450 kg/day' },
  { id: 'L-002', type: 'Goats', count: 120, health: 'Good', lastVetCheck: '2026-06-05', feedConsumption: '120 kg/day' },
  { id: 'L-003', type: 'Poultry', count: 500, health: 'Excellent', lastVetCheck: '2026-06-15', feedConsumption: '80 kg/day' },
  { id: 'L-004', type: 'Pigs', count: 30, health: 'Fair (Monitoring)', lastVetCheck: '2026-05-28', feedConsumption: '90 kg/day' },
  { id: 'L-005', type: 'Sheep', count: 60, health: 'Excellent', lastVetCheck: '2026-06-12', feedConsumption: '60 kg/day' }
];

export const workforce = [
  { id: 'W-01', name: 'Kwame Mensah', role: 'Farm Manager', zone: 'All Zones', contact: '+233 24 000 0001', status: 'Active' },
  { id: 'W-02', name: 'Ama Serwaa', role: 'Lead Agronomist', zone: 'Agro Towers', contact: '+233 24 000 0002', status: 'Active' },
  { id: 'W-03', name: 'Yaw Boateng', role: 'Livestock Handler', zone: 'Zone 1 & 2', contact: '+233 24 000 0003', status: 'Active' },
  { id: 'W-04', name: 'Efua Darko', role: 'Irrigation Tech', zone: 'Open Fields', contact: '+233 24 000 0004', status: 'On Leave' },
  { id: 'W-05', name: 'Kofi Antwi', role: 'Security Chief', zone: 'Perimeter', contact: '+233 24 000 0005', status: 'Active' }
];

export const farmFinancials = [
  { id: 'F-01', date: '2026-06-18', category: 'Fertilizer Purchase', zone: 'Open Field A', amount: -1200, type: 'Expense' },
  { id: 'F-02', date: '2026-06-17', category: 'Crop Sale (Maize)', zone: 'Open Field A', amount: 4500, type: 'Income' },
  { id: 'F-03', date: '2026-06-15', category: 'Veterinary Supplies', zone: 'Livestock Zone 1', amount: -350, type: 'Expense' },
  { id: 'F-04', date: '2026-06-14', category: 'Hydroponic Nutrients', zone: 'Agro Tower Alpha', amount: -800, type: 'Expense' },
  { id: 'F-05', date: '2026-06-10', category: 'Egg Sales', zone: 'Livestock Zone 2', amount: 1200, type: 'Income' }
];

export const userSettings = {
  name: 'Nana Baffour Nsenkyire Sarpong Asante',
  role: 'System Administrator',
  email: 'nana.b@cdnb-grid.com',
  notifications: { email: true, sms: false, push: true },
  theme: 'Dark Mode'
};