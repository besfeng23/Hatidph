import type { ReactNode } from 'react';

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <main className="stage">
      <section className="phone" aria-label="Hatid passenger app preview">
        <div className="notch" aria-hidden="true" />
        {children}
      </section>
    </main>
  );
}
