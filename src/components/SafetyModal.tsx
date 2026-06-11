export function SafetyModal({ title, message, close }: { title: string; message: string; close: () => void }) {
  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={close}>
      <div className="modal-card elevated" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="primary" onClick={close}>Got it</button>
      </div>
    </div>
  );
}
