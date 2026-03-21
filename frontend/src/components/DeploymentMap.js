import { useState, useEffect } from 'react';
import { MapPin, Plane, Clock, Users, CheckCircle } from 'lucide-react';

// Alaska SVG path - simplified outline
const ALASKA_PATH = `M 145 85 L 155 82 L 165 78 L 175 75 L 185 73 L 195 72 L 205 73 L 215 75 L 225 78 L 235 82 L 245 87 L 255 93 L 262 100 L 268 108 L 272 117 L 275 127 L 276 137 L 275 147 L 272 157 L 267 166 L 260 174 L 252 181 L 243 187 L 233 192 L 222 195 L 211 197 L 200 198 L 189 197 L 178 195 L 168 192 L 158 188 L 149 183 L 141 177 L 134 170 L 128 162 L 123 153 L 120 143 L 118 133 L 118 123 L 120 113 L 124 104 L 130 96 L 137 90 L 145 85 Z
M 50 170 L 58 165 L 67 162 L 77 160 L 87 160 L 97 162 L 106 166 L 114 172 L 120 180 L 124 189 L 126 199 L 125 209 L 122 218 L 116 226 L 108 232 L 99 236 L 89 238 L 79 238 L 69 236 L 60 232 L 52 226 L 46 218 L 42 209 L 40 199 L 41 189 L 44 180 L 50 170 Z`;

// Detailed Alaska mainland path
const ALASKA_DETAILED = `M 80 50 
  C 85 48, 95 45, 110 43 
  C 130 40, 150 38, 170 40 
  C 190 42, 210 48, 225 55 
  C 240 62, 252 72, 260 85 
  C 268 98, 272 115, 270 130 
  C 268 145, 260 160, 248 172 
  C 236 184, 220 193, 200 198 
  C 180 203, 158 205, 138 203 
  C 118 201, 100 195, 85 185 
  C 70 175, 58 162, 52 147 
  C 46 132, 45 115, 50 100 
  C 55 85, 65 72, 80 63 
  C 95 54, 75 52, 80 50 Z
  M 35 145 
  C 40 140, 48 137, 58 136 
  C 68 135, 80 138, 88 145 
  C 96 152, 100 163, 98 175 
  C 96 187, 88 198, 76 205 
  C 64 212, 50 214, 38 210 
  C 26 206, 18 197, 15 185 
  C 12 173, 15 160, 23 150 
  C 31 140, 30 150, 35 145 Z`;

const DeploymentMap = () => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleHotspotInteraction = (hotspotId) => {
    if (isMobile) {
      setActiveHotspot(activeHotspot === hotspotId ? null : hotspotId);
    } else {
      setActiveHotspot(hotspotId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setActiveHotspot(null);
    }
  };

  const hotspots = [
    {
      id: 'north-slope',
      name: 'NORTH SLOPE / WILLOW PROJECT',
      subtitle: 'Active Deployment Zone',
      x: 72,
      y: 22,
      color: '#38BDF8',
      isPulsing: true,
      data: [
        { icon: Users, label: 'Vetted Bench', value: '42 NSTC-Ready Tradesmen' },
        { icon: Clock, label: 'Avg Mobilization', value: '72 Hours' }
      ]
    },
    {
      id: 'anchorage',
      name: 'ANCHORAGE LOGISTICS HUB',
      subtitle: 'Point of Hire (POH)',
      x: 38,
      y: 62,
      color: '#F97316',
      isPulsing: false,
      data: [
        { icon: Plane, label: 'Routing', value: 'Commercial Flight Routing' },
        { icon: CheckCircle, label: 'Verification', value: 'Pre-Flight Verification Center' }
      ]
    }
  ];

  return (
    <section 
      className="deployment-map-section" 
      id="deployment-map"
      data-testid="deployment-map-section"
      aria-label="Deployment Intelligence Map"
    >
      <div className="deployment-map-container">
        {/* Section Header */}
        <div className="deployment-map-header">
          <h2 
            className="deployment-map-title"
            data-testid="deployment-map-title"
          >
            Basin-Specific Intelligence.
          </h2>
          <p 
            className="deployment-map-subtitle"
            data-testid="deployment-map-subtitle"
          >
            We don't just find resumes. We build deployment-ready benches for Alaska's most critical operational zones.
          </p>
        </div>

        {/* Map Container */}
        <div 
          className="map-wrapper"
          data-testid="map-wrapper"
          role="img"
          aria-label="Interactive map of Alaska showing deployment zones"
        >
          {/* SVG Map */}
          <svg
            viewBox="0 0 100 100"
            className="alaska-map-svg"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Grid lines for tech feel */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path 
                  d="M 10 0 L 0 0 0 10" 
                  fill="none" 
                  stroke="rgba(56, 189, 248, 0.05)" 
                  strokeWidth="0.3"
                />
              </pattern>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glowStrong">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Background grid */}
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Alaska Main Body */}
            <path
              d="M 25 25 
                 C 30 20, 45 15, 60 14 
                 C 75 13, 85 18, 88 28 
                 C 91 38, 88 50, 80 58 
                 C 72 66, 60 72, 45 74 
                 C 30 76, 18 72, 15 62 
                 C 12 52, 18 38, 25 25 Z"
              fill="url(#mapGradient)"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="0.5"
              className="alaska-mainland"
            />

            {/* Aleutian Islands */}
            <path
              d="M 8 65 Q 5 68, 8 72 Q 12 75, 18 73 Q 22 70, 20 66 Q 16 63, 8 65 Z"
              fill="url(#mapGradient)"
              stroke="rgba(56, 189, 248, 0.2)"
              strokeWidth="0.3"
            />
            
            {/* Small islands */}
            <ellipse cx="5" cy="70" rx="2" ry="1.5" fill="#1E293B" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.2" />
            <ellipse cx="3" cy="75" rx="1.5" ry="1" fill="#1E293B" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="0.2" />

            {/* North Slope region highlight */}
            <path
              d="M 55 14 C 65 12, 80 15, 88 22 L 88 28 C 85 20, 70 16, 55 18 Z"
              fill="rgba(56, 189, 248, 0.1)"
              stroke="rgba(56, 189, 248, 0.3)"
              strokeWidth="0.3"
              strokeDasharray="2,1"
            />

            {/* Connection line between hotspots */}
            <line
              x1="38"
              y1="62"
              x2="72"
              y2="22"
              stroke="rgba(56, 189, 248, 0.15)"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              className="connection-line"
            />

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <g key={hotspot.id} className="hotspot-group">
                {/* Pulse animation rings */}
                {hotspot.isPulsing && (
                  <>
                    <circle
                      cx={hotspot.x}
                      cy={hotspot.y}
                      r="4"
                      fill="none"
                      stroke={hotspot.color}
                      strokeWidth="0.5"
                      opacity="0.3"
                      className="pulse-ring pulse-ring-1"
                    />
                    <circle
                      cx={hotspot.x}
                      cy={hotspot.y}
                      r="6"
                      fill="none"
                      stroke={hotspot.color}
                      strokeWidth="0.3"
                      opacity="0.2"
                      className="pulse-ring pulse-ring-2"
                    />
                  </>
                )}
                
                {/* Glow effect */}
                <circle
                  cx={hotspot.x}
                  cy={hotspot.y}
                  r="3"
                  fill={hotspot.color}
                  opacity="0.3"
                  filter="url(#glowStrong)"
                />
                
                {/* Main hotspot dot */}
                <circle
                  cx={hotspot.x}
                  cy={hotspot.y}
                  r="2"
                  fill={hotspot.color}
                  filter="url(#glow)"
                  className={`hotspot-dot ${activeHotspot === hotspot.id ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => handleHotspotInteraction(hotspot.id)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => isMobile && handleHotspotInteraction(hotspot.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${hotspot.name}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleHotspotInteraction(hotspot.id)}
                />

                {/* Inner dot */}
                <circle
                  cx={hotspot.x}
                  cy={hotspot.y}
                  r="0.8"
                  fill="#FFFFFF"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            ))}
          </svg>

          {/* Tooltips */}
          {hotspots.map((hotspot) => (
            <div
              key={`tooltip-${hotspot.id}`}
              className={`map-tooltip ${activeHotspot === hotspot.id ? 'active' : ''} tooltip-${hotspot.id}`}
              style={{
                '--hotspot-color': hotspot.color
              }}
              data-testid={`tooltip-${hotspot.id}`}
              role="tooltip"
              aria-hidden={activeHotspot !== hotspot.id}
            >
              <div className="tooltip-header">
                <MapPin size={14} style={{ color: hotspot.color }} />
                <span className="tooltip-title" style={{ color: hotspot.color }}>
                  {hotspot.name}
                </span>
              </div>
              <p className="tooltip-subtitle">{hotspot.subtitle}</p>
              <div className="tooltip-data">
                {hotspot.data.map((item, idx) => (
                  <div key={idx} className="tooltip-data-row">
                    <item.icon size={12} className="tooltip-icon" />
                    <span className="tooltip-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="map-legend" data-testid="map-legend">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#38BDF8' }}></span>
              <span className="legend-label">Active Deployment Zone</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: '#F97316' }}></span>
              <span className="legend-label">Logistics Hub</span>
            </div>
          </div>
        </div>

        {/* Mobile instruction */}
        <p className="map-instruction" data-testid="map-instruction">
          {isMobile ? 'Tap hotspots for details' : 'Hover over hotspots for deployment intel'}
        </p>
      </div>
    </section>
  );
};

export default DeploymentMap;
