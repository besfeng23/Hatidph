import type { Screen } from '../App';

const items: Array<[Screen, string, string]> = [
  ['home', 'H', 'Home'],
  ['trips', 'T', 'Trips'],
  ['balance', 'B', 'Balance'],
  ['safety', 'S', 'Safety'],
  ['account', 'A', 'Account'],
];

export function BottomNav({ current, go }: { current: Screen; go: (screen: Screen) => void }) {
  const visible = ['home', 'trips', 'balance', 'safety', 'account', 'completed', 'receipt'].includes(current);
  return (
    <nav className={`bottom-nav ${visible ? 'visible' : ''}`}>
      {items.map(([screen, glyph, label]) => (
        <button key={screen} className={current === screen ? 'active' : ''} onClick={() => go(screen)}>
          <i className="nav-glyph" aria-hidden="true">{glyph}</i><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
