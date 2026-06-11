import { driver } from '../lib/mockData';

export function DriverCard({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`driver-card-v2 ${compact ? 'compact' : ''}`}>
      <div className="driver-photo-v2" aria-hidden="true">{driver.initials}</div>
      <div className="driver-main">
        <div className="driver-name-row">
          <strong>{driver.name}</strong>
          <span>★ {driver.rating}</span>
        </div>
        <p>{driver.color} {driver.vehicle}</p>
        <div className="plate-row"><b>{driver.plate}</b><em>Plate matched</em></div>
        <div className="driver-badges">
          {driver.badges.map((badge) => <span key={badge}>{badge}</span>)}
        </div>
      </div>
    </section>
  );
}
