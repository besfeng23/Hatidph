import React from 'react';

type ErrorBoundaryState = {
  hasProblem: boolean;
};

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasProblem: false };

  static getDerivedStateFromError() {
    return { hasProblem: true };
  }

  componentDidCatch() {
    // Vendor reporting can be connected later.
  }

  render() {
    if (!this.state.hasProblem) return this.props.children;

    return (
      <main className="phone-shell">
        <section className="screen auth active">
          <div className="wordmark blue">Hatid</div>
          <h1>Something needs a quick refresh.</h1>
          <p>The app recovered to a safe state. Refresh the preview and try the flow again.</p>
          <button className="primary bottom" onClick={() => window.location.reload()}>
            Refresh Hatid
          </button>
        </section>
      </main>
    );
  }
}
