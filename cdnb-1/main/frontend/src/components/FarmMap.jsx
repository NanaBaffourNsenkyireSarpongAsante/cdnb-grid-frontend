// src/components/FarmMap.jsx
import React, { useState } from 'react';
import { farmNodes } from '../data/mockData';
import './FarmMap.css';

const FarmMap = () => {
  // State to hold the live mouse coordinates and distance
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, dist: 0 });

  // This function tracks the mouse and calculates the distance from the Agro Towers (Center: 500, 350)
  const handleMouseMove = (e) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    
    // Convert screen coordinates to SVG coordinates
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    // Calculate distance from center
    const dx = svgP.x - 500;
    const dy = svgP.y - 350;
    const distance = Math.sqrt(dx * dx + dy * dy);

    setCursorPos({ 
      x: svgP.x.toFixed(0), 
      y: svgP.y.toFixed(0), 
      dist: distance.toFixed(1) 
    });
  };

  return (
    <svg viewBox="0 0 1000 700" className="farm-svg" onMouseMove={handleMouseMove}>
      
      {/* ========== DEFINITIONS ========== */}
      <defs>
        <filter id="amberGlow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ========== TOPOGRAPHICAL CONTOURS ========== */}
      <path d="M -100 150 Q 300 50 600 250 T 1100 150" className="topo-contour" />
      <path d="M -100 350 Q 400 250 700 450 T 1100 350" className="topo-contour" />
      <path d="M -100 550 Q 500 450 800 650 T 1100 550" className="topo-contour" />

      {/* ========== 1. OUTER BOUNDARY ========== */}
      <rect x="20" y="20" width="960" height="660" rx="20" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="10 5" opacity="0.6" />

      {/* ========== 2. LIVESTOCK ZONE ========== */}
      <rect x="50" y="50" width="900" height="600" rx="15" className="zone-livestock" />
      <path d="M 50 80 L 50 50 L 80 50" className="hud-bracket" />
      <path d="M 950 620 L 950 650 L 920 650" className="hud-bracket" />
      
      <text x="80" y="85" className="zone-label">LIVESTOCK ZONES</text>
      
      <g><circle cx="75" cy="616" r="3" className="hud-marker" /><text x="85" y="620" className="hud-data-label">CATTLE</text></g>
      <g><circle cx="195" cy="616" r="3" className="hud-marker" /><text x="205" y="620" className="hud-data-label">GOATS</text></g>
      <g><circle cx="815" cy="616" r="3" className="hud-marker" /><text x="825" y="620" className="hud-data-label">SHEEP</text></g>
      <g><circle cx="75" cy="116" r="3" className="hud-marker" /><text x="85" y="120" className="hud-data-label">POULTRY</text></g>
      <g><circle cx="815" cy="116" r="3" className="hud-marker" /><text x="825" y="120" className="hud-data-label">PIGS</text></g>

      {/* ========== 3. OPEN FIELD CROPS ========== */}
      <rect x="150" y="150" width="700" height="400" rx="10" className="zone-crops" />
      <path d="M 150 180 L 150 150 L 180 150" className="hud-bracket" />
      <path d="M 850 520 L 850 550 L 820 550" className="hud-bracket" />

      <text x="180" y="185" className="zone-label">OPEN FIELD CROPS</text>
      
      <g><circle cx="175" cy="276" r="3" className="hud-marker" /><text x="185" y="280" className="hud-data-label">MAIZE</text></g>
      <g><circle cx="175" cy="416" r="3" className="hud-marker" /><text x="185" y="420" className="hud-data-label">CASSAVA</text></g>
      <g><circle cx="175" cy="516" r="3" className="hud-marker" /><text x="185" y="520" className="hud-data-label">RICE</text></g>
      <g><circle cx="745" cy="276" r="3" className="hud-marker" /><text x="755" y="280" className="hud-data-label">PLANTAIN</text></g>
      <g><circle cx="745" cy="416" r="3" className="hud-marker" /><text x="755" y="420" className="hud-data-label">COCOA</text></g>
      <g><circle cx="745" cy="516" r="3" className="hud-marker" /><text x="755" y="520" className="hud-data-label">OIL PALM</text></g>

      {/* ========== 4. SOFT LIGHT TRAILS ========== */}
      <line x1="50" y1="350" x2="950" y2="350" className="lane-bg" />
      <line x1="50" y1="350" x2="950" y2="350" className="lane-glow" />
      <line x1="500" y1="50" x2="500" y2="650" className="lane-bg" />
      <line x1="500" y1="50" x2="500" y2="650" className="lane-glow" />
      <circle cx="500" cy="350" r="6" fill="#fbbf24" filter="url(#amberGlow)" />

      {/* ========== 5. AGRO TOWERS ========== */}
      <rect x="350" y="250" width="300" height="200" rx="12" className="zone-towers" />
      
      <g className="tower">
        <rect x="380" y="270" width="100" height="160" rx="4" className="tower-body" />
        <line x1="380" y1="300" x2="480" y2="300" className="tower-floor" />
        <line x1="380" y1="330" x2="480" y2="330" className="tower-floor" />
        <line x1="380" y1="360" x2="480" y2="360" className="tower-floor" />
        <line x1="380" y1="390" x2="480" y2="390" className="tower-floor" />
        <rect x="375" y="265" width="110" height="6" rx="2" className="tower-roof" />
        <line x1="430" y1="265" x2="430" y2="248" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="430" cy="245" r="3" fill="#fff" className="blink" />
      </g>
      <text x="430" y="448" className="tower-name" textAnchor="middle">TOWER ALPHA</text>
      <text x="430" y="462" className="tower-crops" textAnchor="middle">Lettuce · Tomatoes · Spinach</text>

      <g className="tower">
        <rect x="520" y="285" width="100" height="145" rx="4" className="tower-body" />
        <line x1="520" y1="310" x2="620" y2="310" className="tower-floor" />
        <line x1="520" y1="340" x2="620" y2="340" className="tower-floor" />
        <line x1="520" y1="370" x2="620" y2="370" className="tower-floor" />
        <line x1="520" y1="400" x2="620" y2="400" className="tower-floor" />
        <rect x="515" y="280" width="110" height="6" rx="2" className="tower-roof" />
        <line x1="570" y1="280" x2="570" y2="263" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="570" cy="260" r="3" fill="#fff" className="blink" />
      </g>
      <text x="570" y="448" className="tower-name" textAnchor="middle">TOWER BETA</text>
      <text x="570" y="462" className="tower-crops" textAnchor="middle">Peppers · Cucumber · Herbs</text>

      {/* ========== 6. NEW: COMPASS (Top Right) ========== */}
      <g transform="translate(920, 80)">
        {/* Compass Base */}
        <circle cx="0" cy="0" r="35" fill="rgba(4, 18, 10, 0.85)" stroke="#10b981" strokeWidth="1.5" filter="drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))" />
        <circle cx="0" cy="0" r="28" fill="none" stroke="#10b981" strokeWidth="0.5" opacity="0.5" />
        
        {/* Crosshairs */}
        <line x1="0" y1="-25" x2="0" y2="25" stroke="#10b981" strokeWidth="1" opacity="0.4" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke="#10b981" strokeWidth="1" opacity="0.4" />
        
        {/* North Pointer (Amber) */}
        <polygon points="0,-22 -6,0 6,0" fill="#fbbf24" filter="drop-shadow(0 0 4px #fbbf24)" />
        {/* South Pointer (Emerald) */}
        <polygon points="0,22 -6,0 6,0" fill="#10b981" opacity="0.6" />
        
        {/* Labels */}
        <text x="0" y="-30" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Courier New">N</text>
        <text x="0" y="42" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Courier New" opacity="0.7">S</text>
        <text x="32" y="4" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Courier New" opacity="0.7">E</text>
        <text x="-32" y="4" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Courier New" opacity="0.7">W</text>
      </g>

      {/* ========== 7. NEW: LIVE CALIBRATION HUD (Bottom Left) ========== */}
      <g transform="translate(40, 600)">
        {/* Panel Background */}
        <rect x="0" y="0" width="200" height="70" rx="8" fill="rgba(4, 18, 10, 0.85)" stroke="#10b981" strokeWidth="1.5" filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))" />
        
        {/* Header */}
        <text x="15" y="22" fill="#fbbf24" fontSize="11" fontFamily="Courier New" fontWeight="bold" letterSpacing="2">LIVE CALIBRATION</text>
        <line x1="15" y1="30" x2="185" y2="30" stroke="#10b981" strokeWidth="0.5" opacity="0.3" />
        
        {/* Dynamic Data */}
        <text x="15" y="48" fill="#ecfdf5" fontSize="13" fontFamily="Courier New">
          X: {cursorPos.x} <tspan fill="#10b981" dx="15">Y: {cursorPos.y}</tspan>
        </text>
        <text x="15" y="64" fill="#34d399" fontSize="12" fontFamily="Courier New">
          DIST: {cursorPos.dist}m from Core
        </text>
      </g>

      {/* ========== 8. LIVE NODES ========== */}
      {farmNodes.sensors.map(node => (
        <g key={node.id} style={{ cursor: 'pointer' }}>
          <circle cx={node.x} cy={node.y} r="10" className="pulse-ring" stroke={node.color} />
          <circle cx={node.x} cy={node.y} r="4" fill={node.color} className="node-core" />
          <title>{`${node.label}: ${node.value}`}</title>
        </g>
      ))}

      {farmNodes.robots.map(node => (
        <g key={node.id} style={{ cursor: 'pointer' }}>
          <circle cx={node.x} cy={node.y} r="12" className="pulse-ring" stroke={node.color} />
          <rect x={node.x - 5} y={node.y - 5} width="10" height="10" fill={node.color} className="node-core" />
          <title>{`${node.label}: ${node.status}`}</title>
        </g>
      ))}

      {farmNodes.cctvs.map(node => (
        <g key={node.id} style={{ cursor: 'pointer' }}>
          <circle cx={node.x} cy={node.y} r="8" className="pulse-ring" stroke={node.color} />
          <circle cx={node.x} cy={node.y} r="3" fill={node.color} className="node-core" />
          <title>{`${node.label}: ${node.status}`}</title>
        </g>
      ))}

    </svg>
  );
};

export default FarmMap;