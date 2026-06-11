import { driver } from '../lib/mockData';

export function DriverCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`driver-card-v2 premium-driver ${compact ? 'compact' : ''}`}>
      <div className="driver-photo-v2" aria-hidden="true">{driver.initials}</div>
      <div className="driver-main">
        <div className="driver-name-row">
          <div>
            <strong>{driver.name}</strong>
            <small>{driver.trips} • {driver.verificationId}</small>
          </div>
          <span>★ {driver.rating}</span>
        </div>
        <p>{driver.color} {driver.vehicle}</p>
        <div className="plate-hero" aria-label={`Vehicle plate ${driver.plate}`}>
          <small>Plate number</small>
          <b>{driver.plate}</b>
          <em>Plate matched</em>
        </div>
        <div className="driver-badges">
          {driver.badges.map((badge) => <span key={badge}>{badge}</span>)}
        </div>
        <p className="driver-safety-note">{driver.safetyStatus}</p>
      </div>
    </section>
  );
}
