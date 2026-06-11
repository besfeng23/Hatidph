import type { Screen } from '../App';

const items: Array<[Screen, string, string]> = [
  ['home', '⌂', 'Home'],
  ['trips', '◷', 'Trips'],
  ['balance', '▣', 'Balance'],
  ['safety', '◇', 'Safety'],
  ['account', '○', 'Account'],
];

export function BottomNav({ current, go }: { current: Screen; go: (screen: Screen) => void }) {
  const visible = ['home', 'trips', 'balance', 'safety', 'account'].includes(current);
  return (
    <nav className={`bottom-nav ${visible ? 'visible' : ''}`}>
      {items.map(([screen, icon, label]) => (
        <button key={screen} className={current === screen ? 'active' : ''} onClick={() => go(screen)}>
          {icon}<span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
