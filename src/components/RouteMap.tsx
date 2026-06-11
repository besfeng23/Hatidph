import type { TripStage } from '../lib/tripState';

type RouteMapProps = {
  stage?: TripStage;
  compact?: boolean;
};

const driverPositions: Record<string, { x: number; y: number }> = {
  searching: { x: 142, y: 290 },
  assigned: { x: 190, y: 260 },
  arriving: { x: 265, y: 220 },
  arrived: { x: 322, y: 190 },
  in_trip: { x: 470, y: 150 },
  completed: { x: 565, y: 128 },
  cancelled: { x: 190, y: 260 },
  idle: { x: 142, y: 290 },
};

export function RouteMap({ stage = 'idle', compact = false }: RouteMapProps) {
  const marker = driverPositions[stage] ?? driverPositions.idle;
  const tripStarted = stage === 'in_trip' || stage === 'completed';

  return (
    <div className={`svg-map ${compact ? 'compact' : ''}`}>
      <svg viewBox="0 0 640 420" role="img" aria-label="Mock Makati to BGC route map">
        <rect width="640" height="420" fill="#EEF4FF" />
        <path className="district" d="M35 55h180v120H35z" />
        <path className="district" d="M390 40h205v138H390z" />
        <path className="district" d="M74 252h180v120H74z" />
        <path className="district" d="M420 238h170v112H420z" />
        <path className="road major" d="M18 330 C160 275 270 230 390 165 S560 85 630 55" />
        <path className="road" d="M60 125 C180 170 282 188 400 150 C500 120 560 108 632 106" />
        <path className="road" d="M122 392 C185 300 224 240 310 196 C374 162 442 154 596 154" />
        <path className="road" d="M332 26 C300 125 300 225 342 392" />
        <path className="road" d="M520 18 C472 106 452 206 472 398" />
        <path className="route shadow" d="M110 308 C190 262 248 231 326 190 C425 140 493 132 570 116" />
        <path className="route" d="M110 308 C190 262 248 231 326 190 C425 140 493 132 570 116" />
        <circle className="pin pickup" cx="110" cy="308" r="14" />
        <circle className="pin destination" cx="570" cy="116" r="14" />
        <g className={`driver-dot ${tripStarted ? 'enroute' : ''}`} style={{ transform: `translate(${marker.x}px, ${marker.y}px)` }}>
          <circle r="18" />
          <text x="0" y="5" textAnchor="middle">🚘</text>
        </g>
        <text className="label" x="42" y="48">MAKATI</text>
        <text className="label" x="418" y="62">BGC</text>
        <text className="label" x="92" y="385">NAIA</text>
        <text className="road-label" x="270" y="310">EDSA</text>
        <text className="road-label" x="360" y="145">AYALA AVE</text>
        <text className="road-label" x="510" y="188">C5</text>
        <text className="pin-label" x="76" y="348">Pickup</text>
        <text className="pin-label" x="530" y="92">Dropoff</text>
      </svg>
    </div>
  );
}
