// src/components/NetworkMap.jsx
import React, { useState } from 'react';
import { networkRouters } from '../data/mockData';
import { lagrangeInterpolation } from '../utils/math';
import './NetworkMap.css';

const NetworkMap = () => {
  const [clickData, setClickData] = useState(null);

  const handleMapClick = (e) => {
    // 1. Get the exact X/Y coordinates of the click inside the SVG
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    // 2. Calculate distance from Main Tower Alpha (Center is at x:430, y:350)
    const dx = svgP.x - 430;
    const dy = svgP.y - 350;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 3. Prepare data for Lagrange Interpolation
    const points = networkRouters.map(r => ({ x: r.distance, y: r.signal }));

    // 4. Calculate estimated signal
   const estimatedSignal = lagrangeInterpolation(points, distance);

    // 5. Update UI (Added safety check for Infinity/NaN)
    let displaySignal = estimatedSignal.toFixed(2);
    if (!isFinite(estimatedSignal) || isNaN(estimatedSignal)) {
      displaySignal = "Out of Range";
    }

    setClickData({
      x: svgP.x,
      y: svgP.y,
      distance: distance.toFixed(1),
      signal: displaySignal
    });
  };

  return (
    <div className="network-map-wrapper">
      <svg viewBox="0 0 1000 700" className="farm-svg interactive" onClick={handleMapClick}>
        
        {/* Base Farm Layout (Simplified for this module) */}
        <rect x="20" y="20" width="960" height="660" rx="20" className="farm-boundary" />
        <rect x="50" y="50" width="900" height="600" rx="15" className="zone-livestock" />
        <rect x="150" y="150" width="700" height="400" rx="10" className="zone-crops" />
        <rect x="350" y="250" width="300" height="200" rx="12" className="zone-towers" />
        
        <text x="500" y="40" className="map-instruction">CLICK ANYWHERE ON THE MAP TO ESTIMATE SIGNAL</text>

        {/* Draw Known Routers */}
        {networkRouters.map(router => (
          <g key={router.id} className="router-node">
            {/* Radar pulse */}
            <circle cx={router.x} cy={router.y} r="15" className="router-pulse" />
            {/* Router Icon (Square to differentiate from sensors) */}
            <rect x={router.x - 8} y={router.y - 8} width="16" height="16" rx="3" className="router-core" />
            <text x={router.x} y={router.y - 15} className="router-label" textAnchor="middle">
              {router.name} ({router.signal}dBm)
            </text>
          </g>
        ))}

        {/* The Click Popup / Tooltip */}
        {clickData && (
          <g className="click-popup" transform={`translate(${clickData.x}, ${clickData.y})`}>
            {/* Pointer line */}
            <line x1="0" y1="0" x2="0" y2="-20" stroke="#4CAF50" strokeWidth="2" strokeDasharray="4 2" />
            {/* Popup Box */}
            <rect x="-90" y="-90" width="180" height="70" rx="8" className="popup-box" />
            <text x="0" y="-70" className="popup-title">Signal Estimate</text>
            <text x="0" y="-50" className="popup-value">{clickData.signal} dBm</text>
            <text x="0" y="-32" className="popup-distance">Distance: {clickData.distance}m</text>
          </g>
        )}

      </svg>
    </div>
  );
};

export default NetworkMap;