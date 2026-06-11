import type { TripStage } from '../lib/tripState';

type RouteMapProps = {
  stage?: TripStage;
  compact?: boolean;
};

const driverPositions: Record<TripStage, { x: number; y: number; rotate: number }> = {
  idle: { x: 98, y: 326, rotate: -20 },
  searching: { x: 150, y: 288, rotate: -22 },
  assigned: { x: 210, y: 254, rotate: -24 },
  arriving: { x: 270, y: 220, rotate: -25 },
  arrived: { x: 112, y: 308, rotate: -18 },
  in_trip: { x: 420, y: 150, rotate: -20 },
  arriving_soon: { x: 525, y: 124, rotate: -8 },
  completed: { x: 570, y: 116, rotate: -4 },
  cancelled: { x: 210, y: 254, rotate: -24 },
};

const statusCopy: Record<TripStage, { title: string; meta: string; meet: string }> = {
  idle: { title: 'Pickup accuracy: High', meta: '18 drivers nearby', meet: 'Meet at Salcedo Village lobby' },
  searching: { title: 'Scanning Makati drivers', meta: 'Checking plate-verified vehicles', meet: 'Pickup: Salcedo Village lobby' },
  assigned: { title: 'Juan accepted', meta: 'Plate ABC-1234 confirmed', meet: 'Driver 1.2 km away' },
  arriving: { title: 'Kuya Juan is arriving', meta: '450m away • 2 min', meet: 'Meet at lobby entrance' },
  arrived: { title: 'Driver has arrived', meta: 'Confirm ABC-1234 before boarding', meet: 'Share PIN only inside vehicle' },
  in_trip: { title: 'Trip in progress', meta: 'Live trip shared with Mom', meet: 'ETA 18 min via Ayala Ave' },
  arriving_soon: { title: 'Arriving soon', meta: 'Prepare to exit safely', meet: 'BGC High Street drop-off bay' },
  completed: { title: 'You have arrived', meta: 'Receipt ready', meet: 'Rate and rebook anytime' },
  cancelled: { title: 'Ride cancelled', meta: 'No charge in prototype', meet: 'Book again when ready' },
};

export function RouteMap({ stage = 'idle', compact = false }: RouteMapProps) {
  const marker = driverPositions[stage] ?? driverPositions.idle;
  const copy = statusCopy[stage] ?? statusCopy.idle;
  const routeProgress = ['in_trip', 'arriving_soon', 'completed'].includes(stage);
  const showSearchDots = stage === 'searching' || stage === 'idle';

  return (
    <div className={`svg-map ${compact ? 'compact' : ''} stage-${stage}`}>
      <svg viewBox="0 0 640 420" role="img" aria-label="Mock Makati to BGC route map">
        <defs>
          <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.16" />
          </filter>
        </defs>
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
        <path className="traffic light" d="M110 308 C190 262 248 231 326 190" />
        <path className="traffic moderate" d="M326 190 C425 140 493 132 570 116" />
        <path className="route shadow" d="M110 308 C190 262 248 231 326 190 C425 140 493 132 570 116" />
        <path className="route" d="M110 308 C190 262 248 231 326 190 C425 140 493 132 570 116" />
        {routeProgress && <path className="route-progress" d="M110 308 C190 262 248 231 326 190 C425 140 493 132 570 116" />}
        {showSearchDots && <g className="search-dots">
          <circle cx="160" cy="282" r="9" />
          <circle cx="224" cy="244" r="7" />
          <circle cx="286" cy="212" r="8" />
        </g>}
        <g className="pickup-pin" filter="url(#mapShadow)">
          <circle className="pin pickup" cx="110" cy="308" r="14" />
          <circle cx="110" cy="308" r="28" className="accuracy-ring" />
        </g>
        <g className="destination-pin" filter="url(#mapShadow)">
          <circle className="pin destination" cx="570" cy="116" r="14" />
        </g>
        <g className={`driver-dot ${routeProgress ? 'enroute' : ''}`} style={{ transform: `translate(${marker.x}px, ${marker.y}px) rotate(${marker.rotate}deg)` }}>
          <circle r="19" />
          <path d="M-7 -2h14l5 7h-24z" />
          <circle cx="-6" cy="7" r="2" />
          <circle cx="6" cy="7" r="2" />
        </g>
        <g className="map-card" filter="url(#mapShadow)">
          <rect x="22" y="22" rx="18" width="286" height="84" />
          <text x="42" y="54" className="map-card-title">{copy.title}</text>
          <text x="42" y="77" className="map-card-meta">{copy.meta}</text>
          <text x="42" y="97" className="map-card-meet">{copy.meet}</text>
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
